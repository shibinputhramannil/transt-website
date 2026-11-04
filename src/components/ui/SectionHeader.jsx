import SplitText from './SplitText.jsx';
import { Reveal } from './Reveal.jsx';
import styles from './SectionHeader.module.css';

export default function SectionHeader({ eyebrow, title, lead, align = 'left', size = 'h2', as = 'h2', id, className = '', children }) {
  return (
    <header className={`${styles.header} ${styles[align]} ${className}`}>
      {eyebrow && (
        <Reveal as="p" className="eyebrow">
          {eyebrow}
        </Reveal>
      )}
      <SplitText as={as} id={id} text={title} className={`t-${size} ${styles.title}`} />
      {lead && (
        <Reveal as="p" delay={0.15} className={`t-lead ${styles.lead}`}>
          {lead}
        </Reveal>
      )}
      {children}
    </header>
  );
}
