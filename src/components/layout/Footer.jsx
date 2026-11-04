import { Link } from 'react-router-dom';
import Logo from '../brand/Logo.jsx';
import { nav, site, mailto, whatsappLink } from '../../data/site.js';
import { services } from '../../data/services.js';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.top}`}>
        <div className={styles.brand}>
          <Link to="/" aria-label="TRANST — home">
            <Logo height={44} alt="" />
          </Link>
          <p className={styles.tagline}>
            Intelligence, built into <em>every</em> solution.
          </p>
        </div>

        <nav className={styles.cols} aria-label="Footer">
          <div>
            <p className="t-mono">Company</p>
            <ul role="list">
              {nav.map((n) => (
                <li key={n.to}>
                  <Link to={n.to}>{n.label}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="t-mono">Services</p>
            <ul role="list">
              {services.map((s) => (
                <li key={s.id}>
                  <Link to={`/services#${s.id}`}>{s.title}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="t-mono">Contact</p>
            <ul role="list">
              <li>
                <a href={mailto()}>{site.contact.email}</a>
              </li>
              <li>
                <a href={whatsappLink()} target="_blank" rel="noopener noreferrer">
                  WhatsApp · {site.contact.whatsappDisplay}
                </a>
              </li>
              <li>
                <a href={site.contact.github} target="_blank" rel="noopener noreferrer">
                  GitHub · {site.contact.githubHandle}
                </a>
              </li>
            </ul>
          </div>
        </nav>
      </div>
      <div className={`container ${styles.bottom}`}>
        <p>© {new Date().getFullYear()} TRANST. All rights reserved.</p>
        <p className="t-mono">Intelligence · Automation · Agents · Web · Integration</p>
      </div>
    </footer>
  );
}
