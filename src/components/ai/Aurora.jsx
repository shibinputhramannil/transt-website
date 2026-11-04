import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

/**
 * Aurora light for the hero: soft curtains of forest, mint and peach rising from the bottom.
 *
 * Rendered by one tiny WebGL fragment shader into a LOW-resolution canvas (≈1/6 of its CSS size)
 * that the browser scales up — the light is soft, so the upscale is invisible, and the GPU work is
 * negligible. Updates at ~30 fps, only while visible; `paused` freezes it; reduced motion draws a
 * single still frame; on devices that can't hold a smooth frame rate it settles into a still frame
 * after ~2 s. Falls back to a static CSS gradient without WebGL.
 */
const FRAG = `
precision mediump float;
uniform vec2 uRes;
uniform float uTime;

// one curtain: a soft column whose centre and width sway slowly, fading towards the top
float curtain(vec2 uv, float x, float w, float h, float speed, float phase) {
  float sway = sin(uTime * speed + phase) * 0.05 + sin(uTime * speed * 0.53 + phase * 1.7) * 0.03;
  float wave = sin(uv.y * 3.0 + uTime * speed * 1.4 + phase) * 0.025;
  float dx = (uv.x - (x + sway + wave)) / (w * (1.0 + 0.15 * sin(uTime * speed * 0.7 + phase)));
  float column = exp(-dx * dx * 2.6);
  float height = h * (0.88 + 0.12 * sin(uTime * speed * 0.9 + phase * 2.3));
  float rise = smoothstep(height, 0.0, uv.y);
  return column * rise * rise;
}

void main() {
  vec2 uv = gl_FragCoord.xy / uRes; // (0,0) bottom-left
  vec3 forest = vec3(0.14, 0.36, 0.29);
  vec3 sage   = vec3(0.31, 0.54, 0.45);
  vec3 mint   = vec3(0.43, 0.77, 0.63);
  vec3 peach  = vec3(0.91, 0.77, 0.64);

  vec3 c = vec3(0.0);
  c += sage   * curtain(uv, 0.10, 0.10, 0.80, 0.21, 0.0) * 0.85;
  c += mint   * curtain(uv, 0.30, 0.11, 0.70, 0.17, 1.9) * 0.55;
  c += mint   * curtain(uv, 0.48, 0.12, 0.95, 0.24, 3.1) * 0.95;
  c += peach  * curtain(uv, 0.66, 0.09, 0.62, 0.19, 4.4) * 0.45;
  c += forest * curtain(uv, 0.86, 0.12, 0.85, 0.15, 5.6) * 1.2;
  // faint ground glow
  c += mint * smoothstep(0.35, 0.0, uv.y) * 0.12;

  float a = clamp(max(c.r, max(c.g, c.b)) * 1.15, 0.0, 1.0);
  gl_FragColor = vec4(c, a); // premultiplied
}`;

const VERT = `attribute vec2 p; void main(){ gl_Position = vec4(p, 0.0, 1.0); }`;

export default function Aurora({ play = true, paused = false, className = '', fallbackClassName = '' }) {
  const canvasRef = useRef(null);
  const reduce = useReducedMotion();
  const [supported, setSupported] = useState(true);
  const live = useRef({ play, paused, reduce });
  live.current = { play, paused, reduce };
  const kick = useRef(() => {});

  useEffect(() => {
    const canvas = canvasRef.current;
    const gl = canvas?.getContext('webgl', { alpha: true, premultipliedAlpha: true, antialias: false, depth: false });
    if (!gl) {
      setSupported(false);
      return undefined;
    }
    const sh = (type, src) => {
      const s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const prog = gl.createProgram();
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      setSupported(false);
      return undefined;
    }
    gl.useProgram(prog);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, 'p');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const uRes = gl.getUniformLocation(prog, 'uRes');
    const uTime = gl.getUniformLocation(prog, 'uTime');

    const SCALE = 1 / 6;
    const resize = () => {
      const r = canvas.getBoundingClientRect();
      canvas.width = Math.max(8, Math.round(r.width * SCALE));
      canvas.height = Math.max(8, Math.round(r.height * SCALE));
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      request(true);
    };

    let raf = 0;
    let time = 4; // start mid-motion so the first still frame is already composed
    let last = performance.now();
    let lastDraw = 0;
    let visible = true;
    let force = false;
    // On devices that can't keep the page smooth, the aurora becomes a still image so the
    // particle sphere (the focal point) gets the frame budget.
    let slow = 0;
    let samples = 0;
    let frozen = false;

    const frame = (now) => {
      raf = 0;
      const { play: on, paused: hold, reduce: still } = live.current;
      const moving = on && !hold && !still && visible && !document.hidden && !frozen;
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      if (moving && samples < 120) {
        samples++;
        if (dt > 1 / 40) slow++;
        if (samples === 120 && slow > 60) frozen = true;
      }
      if (moving) time += dt;
      if (force || (moving && now - lastDraw > 32)) {
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.uniform1f(uTime, time);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
        lastDraw = now;
        force = false;
      }
      if (moving) raf = requestAnimationFrame(frame);
    };
    function request(redraw = false) {
      if (redraw) force = true;
      last = performance.now();
      if (!raf) raf = requestAnimationFrame(frame);
    }
    kick.current = () => request(true);

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) request();
    });
    io.observe(canvas);
    const onVis = () => !document.hidden && request();
    document.addEventListener('visibilitychange', onVis);
    resize();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener('visibilitychange', onVis);
    };
  }, []);

  useEffect(() => {
    kick.current();
  }, [play, paused, reduce]);

  if (!supported) return <div className={fallbackClassName} aria-hidden="true" />;
  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
