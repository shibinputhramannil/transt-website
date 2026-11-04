import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useInView } from 'framer-motion';
import ServiceDiagram from '../services/ServiceDiagram.jsx';
import SectionHeader from '../ui/SectionHeader.jsx';
import { RevealGroup, RevealItem } from '../ui/Reveal.jsx';
import { Arrow } from '../ui/Button.jsx';
import { services } from '../../data/services.js';
import styles from './ServiceCards.module.css';

// Visual variation across the bento: one feature card, then alternating surfaces.
const LAYOUT = {
  'ai-powered-software': { size: 'feature', tone: 'dark' },
  'intelligent-automation': { size: 'wide', tone: 'cream' },
  'ai-agents': { size: 'third', tone: 'peach' },
  'custom-web-applications': { size: 'third', tone: 'cream' },
  'ai-integration': { size: 'third', tone: 'mint' },
};

function useCoarsePointer() {
  const [coarse, setCoarse] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(hover: none), (pointer: coarse)');
    const update = () => setCoarse(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);
  return coarse;
}

function ServiceCard({ service, coarse }) {
  const ref = useRef(null);
  const [hover, setHover] = useState(false);
  const [focus, setFocus] = useState(false);
  // On touch screens there is no hover: the card nearest the middle of the viewport comes alive.
  const centred = useInView(ref, { margin: '-38% 0px -38% 0px' });
  const { size, tone } = LAYOUT[service.id];
  const active = hover || focus || (coarse && centred);
  const showPoints = size === 'feature' || size === 'wide';

  return (
    <RevealItem as="li" id={`service-${service.id}`} className={`${styles.item} ${styles[size]}`}>
      <Link
        ref={ref}
        to={`/services#${service.id}`}
        className={`${styles.card} ${styles[tone]} ${active ? styles.active : ''}`}
        onPointerEnter={(e) => e.pointerType === 'mouse' && setHover(true)}
        onPointerLeave={() => setHover(false)}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
      >
        <div className={styles.top}>
          <span className="t-mono">{service.index}</span>
          <span className={styles.go} aria-hidden="true">
            <Arrow />
          </span>
        </div>

        <div className={styles.text}>
          <h3 className={styles.title}>{service.title}</h3>
          <p className={styles.short}>{size === 'feature' ? service.summary : service.short}</p>
        </div>

        <div className={styles.diagram} aria-hidden="true">
          <ServiceDiagram type={service.diagram} tone={tone === 'dark' ? 'dark' : 'light'} active={active} />
        </div>

        {showPoints && (
          <ul className={styles.points}>
            {service.points.slice(0, size === 'feature' ? 4 : 3).map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        )}

        <span className={styles.more}>
          Explore {service.title}
          <Arrow />
        </span>
      </Link>
    </RevealItem>
  );
}

/**
 * Services as a bento grid. Every card shows its full content (no hover-only reveals);
 * hover, keyboard focus or — on touch — scrolling a card into the centre brings its diagram to life.
 */
export default function ServiceCards() {
  const coarse = useCoarsePointer();
  return (
    <section className={`section ${styles.section}`} id="services" aria-labelledby="services-title">
      <div className="container">
        <div className={styles.head}>
          <SectionHeader
            eyebrow="Services"
            id="services-title"
            title="Five ways we build *intelligence* in."
            lead="Each discipline stands on its own, and together they cover the path from an idea to an AI capability running inside your business."
          />
          <Link to="/services" className={styles.all}>
            All services <Arrow />
          </Link>
        </div>

        <RevealGroup as="ul" role="list" className={styles.grid} stagger={0.08}>
          {services.map((s) => (
            <ServiceCard key={s.id} service={s} coarse={coarse} />
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
