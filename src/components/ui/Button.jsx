import { Link } from 'react-router-dom';
import styles from './Button.module.css';

export function Arrow({ className }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * variant: 'primary' | 'secondary' | 'ghost' | 'light' (primary on dark)
 * Renders <Link> for `to`, <a> for `href`, otherwise <button>.
 */
export default function Button({ variant = 'primary', size = 'md', to, href, arrow = true, children, className = '', ...rest }) {
  const cls = `${styles.btn} ${styles[variant]} ${styles[size]} ${className}`;
  const content = (
    <>
      <span>{children}</span>
      {arrow && <Arrow className={styles.arrow} />}
    </>
  );
  if (to) {
    return (
      <Link to={to} className={cls} {...rest}>
        {content}
      </Link>
    );
  }
  if (href) {
    const external = /^https?:/.test(href);
    return (
      <a href={href} className={cls} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})} {...rest}>
        {content}
      </a>
    );
  }
  return (
    <button type="button" className={cls} {...rest}>
      {content}
    </button>
  );
}
