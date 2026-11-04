import AICircle from '../ai/AICircle.jsx';
import SplitText from './SplitText.jsx';
import { Reveal } from './Reveal.jsx';
import Button from './Button.jsx';
import styles from './CtaBand.module.css';

/** Dark closing call-to-action used at the end of inner pages. */
export default function CtaBand({ eyebrow = 'Next step', title, lead, primary, secondary }) {
  return (
    <section className="section">
      <div className="container">
        <div className={`on-dark ${styles.band}`}>
          <div className={styles.orb} aria-hidden="true">
            <AICircle tone="dark" labels={false} interactive={false} ariaLabel="" />
          </div>
          <div className={styles.copy}>
            <Reveal as="p" className="eyebrow">
              {eyebrow}
            </Reveal>
            <SplitText as="h2" className="t-h2" text={title} />
            {lead && (
              <Reveal as="p" className="t-lead" delay={0.1}>
                {lead}
              </Reveal>
            )}
            <Reveal className={styles.actions} delay={0.2}>
              {primary && (
                <Button variant="light" {...primary.props}>
                  {primary.label}
                </Button>
              )}
              {secondary && (
                <Button variant="outlineLight" {...secondary.props}>
                  {secondary.label}
                </Button>
              )}
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
