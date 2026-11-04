import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import PageHero from '../components/layout/PageHero.jsx';
import ServiceDiagram from '../components/services/ServiceDiagram.jsx';
import AICircle from '../components/ai/AICircle.jsx';
import SplitText from '../components/ui/SplitText.jsx';
import { Reveal, RevealGroup, RevealItem } from '../components/ui/Reveal.jsx';
import Button from '../components/ui/Button.jsx';
import CtaBand from '../components/ui/CtaBand.jsx';
import { services } from '../data/services.js';
import useSeo from '../hooks/useSeo.js';
import { pages } from '../data/seo.js';
import styles from './Services.module.css';

/** Tracks which service section has crossed the middle of the viewport (first one when above all). */
function useActiveSection(ids) {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const line = window.innerHeight * 0.5;
      let current = ids[0];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= line) current = id;
      }
      setActive(current);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [ids]);
  return active;
}

const ids = services.map((s) => s.id);

// The Services hero shows the five disciplines orbiting one core (the homepage sphere shows capabilities).
const SERVICE_NODES = [
  { id: 'ai-powered-software', label: 'AI Software', ring: 'outer', angle: -90 },
  { id: 'intelligent-automation', label: 'Automation', ring: 'inner', angle: -18 },
  { id: 'ai-agents', label: 'AI Agents', ring: 'outer', angle: 54 },
  { id: 'custom-web-applications', label: 'Web Apps', ring: 'inner', angle: 126 },
  { id: 'ai-integration', label: 'Integration', ring: 'outer', angle: 198 },
];

export default function Services() {
  useSeo(pages['/services']);
  const active = useActiveSection(ids);

  return (
    <>
      <PageHero
        eyebrow="Services"
        title="Five disciplines, one *intelligent* craft."
        lead="From AI-native products to the integrations that connect them, every TRANST engagement is designed, engineered and delivered with intelligence at its centre."
        visual={
          <AICircle
            nodes={SERVICE_NODES}
            labels="auto"
            ariaLabel="Animated diagram of TRANST's five service lines connected to one intelligence core: AI-powered software, intelligent automation, AI agents, custom web applications and AI integration."
          />
        }
      >
        <Button to="/contact?topic=services#enquiry">Discuss a project</Button>
      </PageHero>

      <nav className={styles.index} aria-label="Services on this page">
        <div className="container">
          <ul role="list" className={styles.indexList}>
            {services.map((s) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    const smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
                    document.getElementById(s.id)?.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto' });
                    window.history.replaceState(window.history.state, '', `#${s.id}`);
                  }}
                  className={`${styles.indexLink} ${active === s.id ? styles.indexOn : ''}`} aria-current={active === s.id ? 'true' : undefined}>
                  {active === s.id && <motion.span layoutId="svc-index" className={styles.indexPill} transition={{ type: 'spring', stiffness: 380, damping: 34 }} />}
                  <span className={styles.indexText}>
                    <span className="t-mono">{s.index}</span> {s.title}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {services.map((s, i) => (
        <section key={s.id} id={s.id} className={`section ${styles.service} ${i % 2 ? styles.alt : ''}`} aria-labelledby={`${s.id}-title`}>
          <div className={`container ${styles.grid}`}>
            <div className={styles.copy}>
              <Reveal as="p" className={`t-mono ${styles.num}`}>
                {s.index} / 05
              </Reveal>
              <SplitText as="h2" id={`${s.id}-title`} className="t-h2" text={s.title} />
              <Reveal as="p" className="t-lead" delay={0.1}>
                {s.summary}
              </Reveal>
              <RevealGroup as="ul" role="list" className={styles.points} stagger={0.07}>
                {s.points.map((p, pi) => (
                  <RevealItem as="li" key={p} className={styles.point} tabIndex={0}>
                    <span className="t-mono">{String(pi + 1).padStart(2, '0')}</span>
                    <span>{p}</span>
                  </RevealItem>
                ))}
              </RevealGroup>
              <Reveal delay={0.1}>
                <Button to={`/contact?service=${s.id}#enquiry`} variant="ghost">
                  Talk to us about {s.title}
                </Button>
              </Reveal>
            </div>
            <Reveal className={styles.figure} delay={0.1}>
              <div className={styles.figureInner}>
                <span className={`t-mono ${styles.figLabel}`}>Fig. {s.index} — {s.short}</span>
                <ServiceDiagram type={s.diagram} />
              </div>
            </Reveal>
          </div>
        </section>
      ))}

      <CtaBand
        eyebrow="Not sure where to start?"
        title="Bring us the problem. We will *map the path.*"
        lead="Many projects combine more than one discipline. Describe what you need and we will suggest the right mix."
        primary={{ label: 'Get in touch', props: { to: '/contact' } }}
        secondary={{ label: 'Explore products', props: { to: '/products' } }}
      />
    </>
  );
}
