import { Link } from 'react-router-dom';
import PageHero from '../components/layout/PageHero.jsx';
import Logo from '../components/brand/Logo.jsx';
import SectionHeader from '../components/ui/SectionHeader.jsx';
import SplitText from '../components/ui/SplitText.jsx';
import { Reveal, RevealGroup, RevealItem } from '../components/ui/Reveal.jsx';
import { Arrow } from '../components/ui/Button.jsx';
import CtaBand from '../components/ui/CtaBand.jsx';
import Process from '../components/home/Process.jsx';
import { principles } from '../data/approach.js';
import { services } from '../data/services.js';
import useSeo from '../hooks/useSeo.js';
import { pages } from '../data/seo.js';
import styles from './About.module.css';

export default function About() {
  useSeo(pages['/about']);
  return (
    <>
      <PageHero
        eyebrow="About TRANST"
        title="We make intelligence *practical.*"
        lead="TRANST is a software company built around one idea: AI is most valuable when it is designed into the tools people already depend on — carefully, transparently and for a clear purpose."
      />

      {/* Editorial story */}
      <section className="section" aria-labelledby="story-title">
        <div className={`container ${styles.story}`}>
          <aside className={styles.storyAside}>
            <Reveal className={styles.markFrame}>
              <Logo variant="mark" height={120} alt="TRANST mark" />
            </Reveal>
            <Reveal as="p" className="t-mono" delay={0.1}>
              Our story
            </Reveal>
          </aside>
          <div className={styles.storyBody}>
            <SplitText
              as="h2"
              id="story-title"
              className="t-h2"
              text="Closing the gap between what AI *can do* and what a business *actually uses.*"
              stagger={0.04}
            />
            <Reveal as="p" className={styles.dropcap}>
              Every organisation now has access to powerful AI models. Far fewer have software that puts those models
              to work in a way their people trust. That gap — between what AI can do and what a business relies on
              every day — is where TRANST works.
            </Reveal>
            <Reveal as="p" className="t-lead">
              We design and build software with intelligence in its foundation: products that understand language and
              documents, automations that handle the judgement calls rules cannot, agents that complete multi-step
              work, and integrations that bring AI into the systems you already run.
            </Reveal>
            <Reveal as="p" className="t-lead">
              Our approach is deliberately practical. We begin with the work itself, build in small verifiable steps,
              and keep people in control of the decisions that matter. The result should feel less like a new
              technology and more like a better way of working.
            </Reveal>
            <Reveal as="blockquote" className={styles.quote}>
              <p>
                Intelligence, built into <em>every</em> solution.
              </p>
              <footer className="t-mono">The TRANST principle</footer>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Principles */}
      <section className={`section ${styles.principlesSection}`} aria-labelledby="principles-title">
        <div className="container">
          <SectionHeader eyebrow="What we believe" id="principles-title" title="Three principles behind *every* build." />
          <RevealGroup as="ol" role="list" className={styles.principles} stagger={0.1}>
            {principles.map((p, i) => (
              <RevealItem as="li" key={p.title} className={styles.principle}>
                <span className={styles.bigNum} aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="t-h3">{p.title}</h3>
                <p className="t-body">{p.text}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* plain tone: the principles section above already uses the cream band */}
      <Process tone="plain" />

      {/* What we do */}
      <section className="section" aria-labelledby="disciplines-title">
        <div className="container">
          <SectionHeader eyebrow="What we do" id="disciplines-title" title="Five disciplines, *one* way of working." />
          <RevealGroup as="ul" role="list" className={styles.disciplines} stagger={0.06}>
            {services.map((s) => (
              <RevealItem as="li" key={s.id}>
                <Link to={`/services#${s.id}`} className={styles.discipline}>
                  <span className="t-mono">{s.index}</span>
                  <span className={styles.discTitle}>{s.title}</span>
                  <span className={styles.discShort}>{s.short}</span>
                  <Arrow className={styles.discArrow} />
                </Link>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      <CtaBand
        eyebrow="Work with us"
        title="Let's build something *useful.*"
        lead="If you have a process to improve, a product to create or a system to connect, we would like to hear about it."
        primary={{ label: 'Get in touch', props: { to: '/contact' } }}
        secondary={{ label: 'View services', props: { to: '/services' } }}
      />
    </>
  );
}
