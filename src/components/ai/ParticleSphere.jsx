import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import styles from './ParticleSphere.module.css';

/**
 * TRANST particle sphere — a luminous sphere made of thousands of points, rendered with raw WebGL
 * (no 3D library). Original implementation; tuned to the brand palette.
 *
 * Behaviour
 *  - particles gather into the sphere when `play` becomes true
 *  - the surface breathes and wobbles; the sphere drifts slowly
 *  - the surface bulges toward the pointer (mouse hover, or finger while touching)
 *  - a click / tap sends a ripple across the surface
 *  - renders only while on screen and the tab is visible; `paused` freezes it
 *  - prefers-reduced-motion: one still frame, no pointer reaction
 *
 * Props: play, paused, interactionRef (element that receives pointer events; defaults to the canvas
 * wrapper), className.
 */

// Palette (linear-ish RGB 0..1): mint, forest tint, peach accent.
const MINT = [0.56, 0.86, 0.72];
const FOREST = [0.31, 0.62, 0.5];
const PEACH = [0.98, 0.8, 0.62];

const VERT = `
attribute vec3 aDir;
attribute vec4 aRnd; // x: size, y: colour pick, z: scatter, w: radius jitter
uniform mat3 uRot;
uniform float uTime;
uniform float uScale;
uniform float uAspect;
uniform float uPR;
uniform float uSize;
uniform float uAssemble;
uniform vec3 uPtr;
uniform float uPtrAmt;
uniform vec4 uRip; // xyz: ripple origin direction (view space), w: age in seconds (<0 = none)
varying float vAlpha;
varying float vPick;
varying float vLit;
varying float vHot;
varying float vRim;

void main() {
  vec3 d = uRot * aDir;

  // organic surface: three slow, different-scale waves
  float w = sin(dot(aDir, vec3(3.1, 2.3, 1.7)) * 1.6 + uTime * 0.55) * 0.55
          + sin(dot(aDir, vec3(-1.9, 3.7, 2.9)) * 2.4 - uTime * 0.42) * 0.3
          + sin(dot(aDir, vec3(2.7, -1.3, 3.3)) * 4.2 + uTime * 0.8) * 0.15;
  float r = aRnd.w * (1.0 + w * 0.028 + sin(uTime * 0.7) * 0.008);

  // pointer: the region facing the pointer swells outward
  float facing = max(dot(d, uPtr), 0.0);
  float bulge = pow(facing, 7.0) * uPtrAmt;
  r += bulge * 0.2;

  // ripple travelling over the surface from the tap point
  float rip = 0.0;
  if (uRip.w >= 0.0) {
    float ang = acos(clamp(dot(d, uRip.xyz), -1.0, 1.0));
    float front = uRip.w * 2.4;
    rip = exp(-pow((ang - front) * 5.0, 2.0)) * exp(-uRip.w * 1.1);
    r += rip * 0.09;
  }

  // gather-in: particles start scattered outward and converge onto the shell
  float a = smoothstep(0.0, 1.0, clamp(uAssemble * 1.15 - aRnd.z * 0.15, 0.0, 1.0));
  r = mix(r * (1.8 + aRnd.z * 2.2), r, a);

  vec3 p = d * r;
  float persp = 3.2 / (3.2 - p.z);
  vec2 xy = p.xy * persp * uScale;
  xy.x /= uAspect;
  gl_Position = vec4(xy, 0.0, 1.0);

  float depth = clamp(p.z * 0.5 + 0.5, 0.0, 1.0); // 0 back … 1 front
  // limb brightening: particles seen edge-on stack up at the silhouette, like a lit shell
  float rim = pow(1.0 - abs(d.z), 2.2);
  vRim = rim;
  gl_PointSize = uSize * uPR * (0.55 + aRnd.x * 0.95) * (0.7 + depth * 0.45 + rim * 0.35) * (1.0 + bulge * 1.2 + rip * 1.5);
  // quiet centre (text reads cleanly over it), bright limb
  vAlpha = mix(0.16, 0.85, depth) * (0.45 + rim * 1.1) * (0.5 + aRnd.x * 0.5) * a;
  vPick = aRnd.y;
  vLit = clamp(0.5 - p.y * 0.55, 0.0, 1.0); // lit from below
  vHot = clamp(bulge * 1.6 + rip * 2.0, 0.0, 1.0);
}`;

const FRAG = `
precision mediump float;
uniform vec3 uMint;
uniform vec3 uForest;
uniform vec3 uPeach;
uniform float uBright;
varying float vAlpha;
varying float vPick;
varying float vLit;
varying float vHot;
varying float vRim;
void main() {
  float d = length(gl_PointCoord - 0.5);
  float disc = smoothstep(0.5, 0.05, d);
  vec3 c = mix(uForest, uMint, smoothstep(0.25, 0.75, vPick));
  c = mix(c, uPeach, step(0.93, vPick));          // ~7% peach accents
  c = mix(c, vec3(0.95, 0.98, 0.94), vHot * 0.55); // excited particles near pointer / ripple
  float glow = (0.6 + vLit * 0.7 + vRim * 0.45) * uBright;
  float alpha = disc * vAlpha;
  gl_FragColor = vec4(c * glow * alpha, alpha);   // premultiplied, additive blending
}`;

function compile(gl, type, src) {
  const s = gl.createShader(type);
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) || 'shader compile failed');
  return s;
}

/** Uniformly random directions on the sphere (Gaussian method) — organic, not lattice-like. */
function buildParticles(count) {
  const dir = new Float32Array(count * 3);
  const rnd = new Float32Array(count * 4);
  const gauss = () => {
    let u = 0;
    let v = 0;
    while (u === 0) u = Math.random();
    while (v === 0) v = Math.random();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  };
  for (let i = 0; i < count; i++) {
    let x = gauss();
    let y = gauss();
    let z = gauss();
    const l = Math.hypot(x, y, z) || 1;
    x /= l;
    y /= l;
    z /= l;
    dir.set([x, y, z], i * 3);
    // a fuzzy shell: most points sit on the surface, a few drift slightly inside/outside
    const jitter = Math.random() < 0.88 ? 1 + (Math.random() - 0.5) * 0.035 : 0.9 + Math.random() * 0.16;
    rnd.set([Math.random() ** 1.6, Math.random(), Math.random(), jitter], i * 4);
  }
  return { dir, rnd };
}

const rotY = (a) => [Math.cos(a), 0, -Math.sin(a), 0, 1, 0, Math.sin(a), 0, Math.cos(a)];
const rotX = (a) => [1, 0, 0, 0, Math.cos(a), Math.sin(a), 0, -Math.sin(a), Math.cos(a)];
function mul3(a, b) {
  // column-major 3×3 multiply (a · b)
  const o = new Array(9);
  for (let c = 0; c < 3; c++)
    for (let r = 0; r < 3; r++) o[c * 3 + r] = a[r] * b[c * 3] + a[3 + r] * b[c * 3 + 1] + a[6 + r] * b[c * 3 + 2];
  return o;
}

export default function ParticleSphere({ play = true, paused = false, interactionRef, className = '' }) {
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);
  const reduce = useReducedMotion();
  const [supported, setSupported] = useState(true);
  const state = useRef({ play, paused, reduce });
  state.current.play = play;
  state.current.paused = paused;
  state.current.reduce = reduce;
  const kick = useRef(() => {});

  useEffect(() => {
    const canvas = canvasRef.current;
    const gl = canvas.getContext('webgl', { alpha: true, antialias: false, premultipliedAlpha: true, powerPreference: 'high-performance' });
    if (!gl) {
      setSupported(false);
      return undefined;
    }

    let program;
    try {
      program = gl.createProgram();
      gl.attachShader(program, compile(gl, gl.VERTEX_SHADER, VERT));
      gl.attachShader(program, compile(gl, gl.FRAGMENT_SHADER, FRAG));
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program) || 'link failed');
    } catch {
      setSupported(false);
      return undefined;
    }
    gl.useProgram(program);

    const small = window.matchMedia('(max-width: 760px)').matches;
    const fullCount = small ? 7000 : 14000;
    let count = fullCount; // may be lowered at runtime on slow devices (see the frame-time guard)
    const { dir, rnd } = buildParticles(count);
    const bind = (name, data, size) => {
      const buf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
      const loc = gl.getAttribLocation(program, name);
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, size, gl.FLOAT, false, 0, 0);
    };
    bind('aDir', dir, 3);
    bind('aRnd', rnd, 4);

    const u = {};
    ['uRot', 'uTime', 'uScale', 'uAspect', 'uPR', 'uSize', 'uAssemble', 'uPtr', 'uPtrAmt', 'uRip', 'uMint', 'uForest', 'uPeach', 'uBright'].forEach(
      (n) => (u[n] = gl.getUniformLocation(program, n)),
    );
    gl.uniform3fv(u.uMint, MINT);
    gl.uniform3fv(u.uForest, FOREST);
    gl.uniform3fv(u.uPeach, PEACH);

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE); // additive glow
    gl.clearColor(0, 0, 0, 0);

    // ---- sizing ----
    let w = 1;
    let h = 1;
    let pr = 1;
    const resize = () => {
      const r = canvas.getBoundingClientRect();
      pr = Math.min(window.devicePixelRatio || 1, 2);
      w = Math.max(1, Math.round(r.width * pr));
      h = Math.max(1, Math.round(r.height * pr));
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
      gl.uniform1f(u.uAspect, w / h);
      gl.uniform1f(u.uPR, pr);
      // point size scales gently with the rendered size so small spheres don't look heavy
      gl.uniform1f(u.uSize, Math.max(1.3, Math.min(2.3, r.width / 360)));
      requestDraw();
    };

    // ---- interaction (smoothed) ----
    const ptr = { x: 0, y: 0, z: 1, amt: 0, tx: 0, ty: 0, tz: 1, tamt: 0 };
    const tilt = { x: 0, y: 0, tx: 0, ty: 0 };
    const rip = { x: 0, y: 0, z: 1, t0: -1 };
    let touching = false;
    const target = interactionRef?.current || wrapRef.current;

    const toSphere = (e) => {
      const r = canvas.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const radius = (Math.min(r.width, r.height) / 2) * 0.74;
      const nx = (e.clientX - cx) / radius;
      const ny = -(e.clientY - cy) / radius;
      const len = Math.hypot(nx, ny);
      if (len <= 1) return { x: nx, y: ny, z: Math.sqrt(1 - len * len), len };
      const k = 1 / len;
      return { x: nx * k * 0.96, y: ny * k * 0.96, z: 0.28, len };
    };
    const onMove = (e) => {
      if (state.current.reduce) return;
      if (e.pointerType !== 'mouse' && !touching) return;
      const s = toSphere(e);
      const l = Math.hypot(s.x, s.y, s.z);
      ptr.tx = s.x / l;
      ptr.ty = s.y / l;
      ptr.tz = s.z / l;
      // strongest at/near the surface, fading out ~0.7 radii beyond the rim
      ptr.tamt = s.len <= 1 ? 0.55 + 0.45 * s.len : Math.max(0, 1 - (s.len - 1) / 0.7);
      tilt.tx = Math.max(-1, Math.min(1, s.x)) * 0.22;
      tilt.ty = Math.max(-1, Math.min(1, s.y)) * 0.16;
      requestDraw();
    };
    const onLeave = () => {
      ptr.tamt = 0;
      tilt.tx = 0;
      tilt.ty = 0;
    };
    const onDown = (e) => {
      if (state.current.reduce) return;
      if (e.pointerType !== 'mouse') touching = true;
      const s = toSphere(e);
      if (s.len < 1.25) {
        const l = Math.hypot(s.x, s.y, s.z);
        Object.assign(rip, { x: s.x / l, y: s.y / l, z: s.z / l, t0: performance.now() });
      }
      onMove(e);
      requestDraw();
    };
    const onUp = () => {
      if (touching) onLeave();
      touching = false;
    };
    target.addEventListener('pointermove', onMove, { passive: true });
    target.addEventListener('pointerdown', onDown, { passive: true });
    target.addEventListener('pointerleave', onLeave, { passive: true });
    window.addEventListener('pointerup', onUp, { passive: true });
    window.addEventListener('pointercancel', onUp, { passive: true });

    // ---- loop ----
    let raf = 0;
    let last = performance.now();
    let time = 0;
    let yaw = 0.6;
    let assemble = state.current.reduce ? 1 : 0;
    let assembleStart = -1; // wall-clock based, so the sphere forms on time even if frames drop
    let visible = true;
    let lost = false;
    // Frame-time guard: if frames are consistently slow, try drawing 40% fewer particles once.
    // Keep the reduction only if it actually helped (the bottleneck may be page compositing, not
    // particles) — otherwise restore full detail and stop adjusting.
    let slowFrames = 0;
    let sampled = 0;
    let guard = 'watch'; // 'watch' → 'trial' → 'done'
    let slowBefore = 0;

    const draw = () => {
      raf = 0;
      if (lost) return;
      const now = performance.now();
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const { play: on, paused: hold, reduce: still } = state.current;
      const moving = on && !hold && !still && visible && !document.hidden;

      if (still) {
        assemble = 1;
      } else if (on) {
        if (assembleStart < 0) assembleStart = now;
        assemble = Math.min(1, (now - assembleStart) / 1800);
      }
      if (moving) {
        sampled++;
        if (dt > 1 / 40) slowFrames++;
        if (sampled === 90) {
          if (guard === 'watch' && slowFrames > 45) {
            slowBefore = slowFrames;
            count = Math.round(fullCount * 0.6);
            guard = 'trial';
          } else if (guard === 'trial') {
            if (slowFrames > slowBefore * 0.6) count = fullCount; // no real gain → keep full detail
            guard = 'done';
          }
          sampled = 0;
          slowFrames = 0;
        }
        time += dt;
        yaw += dt * 0.07;
        const k = 1 - Math.exp(-dt * 5);
        ptr.x += (ptr.tx - ptr.x) * k;
        ptr.y += (ptr.ty - ptr.y) * k;
        ptr.z += (ptr.tz - ptr.z) * k;
        ptr.amt += (ptr.tamt - ptr.amt) * (1 - Math.exp(-dt * 3.5));
        tilt.x += (tilt.tx - tilt.x) * (1 - Math.exp(-dt * 2.5));
        tilt.y += (tilt.ty - tilt.y) * (1 - Math.exp(-dt * 2.5));
      }

      const rot = mul3(rotX(-0.32 + tilt.y), rotY(yaw + tilt.x));
      gl.uniformMatrix3fv(u.uRot, false, rot);
      gl.uniform1f(u.uTime, time);
      gl.uniform1f(u.uScale, 0.74);
      gl.uniform1f(u.uAssemble, assemble);
      const pl = Math.hypot(ptr.x, ptr.y, ptr.z) || 1;
      gl.uniform3f(u.uPtr, ptr.x / pl, ptr.y / pl, ptr.z / pl);
      gl.uniform1f(u.uPtrAmt, still ? 0 : ptr.amt);
      const age = rip.t0 < 0 || still ? -1 : (now - rip.t0) / 1000;
      gl.uniform4f(u.uRip, rip.x, rip.y, rip.z, age > 3 ? -1 : age);
      gl.uniform1f(u.uBright, 1.15 + ptr.amt * 0.25);

      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.POINTS, 0, count);

      const settling = on && !still && assemble < 1;
      if ((moving || settling) && !raf) raf = requestAnimationFrame(draw);
    };
    function requestDraw() {
      if (!raf) raf = requestAnimationFrame(draw);
    }
    kick.current = () => {
      last = performance.now();
      requestDraw();
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) kick.current();
    });
    io.observe(canvas);
    const onVis = () => !document.hidden && kick.current();
    document.addEventListener('visibilitychange', onVis);
    const onLost = (e) => {
      e.preventDefault();
      lost = true;
      setSupported(false);
    };
    canvas.addEventListener('webglcontextlost', onLost);
    resize();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener('visibilitychange', onVis);
      canvas.removeEventListener('webglcontextlost', onLost);
      target.removeEventListener('pointermove', onMove);
      target.removeEventListener('pointerdown', onDown);
      target.removeEventListener('pointerleave', onLeave);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
    };
  }, [interactionRef]);

  // restart the loop when play / pause / motion preference changes
  useEffect(() => {
    kick.current();
  }, [play, paused, reduce]);

  return (
    <div ref={wrapRef} className={`${styles.wrap} ${className}`} aria-hidden="true">
      {supported ? <canvas ref={canvasRef} className={styles.canvas} /> : <div className={styles.fallback} />}
    </div>
  );
}
