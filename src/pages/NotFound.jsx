import AICircle from '../components/ai/AICircle.jsx';
import Button from '../components/ui/Button.jsx';
import useSeo from '../hooks/useSeo.js';
import { notFoundMeta } from '../data/seo.js';
import styles from './NotFound.module.css';

export default function NotFound() {
  useSeo(notFoundMeta);
  return (
    <section className={styles.wrap} aria-labelledby="nf-title">
      <div className={`container ${styles.inner}`}>
        <div className={styles.visual} aria-hidden="true">
          <AICircle labels={false} ariaLabel="" />
        </div>
        <div className={styles.copy}>
          <p className="eyebrow">Error 404</p>
          <h1 id="nf-title" className="t-h1">
            This path isn&rsquo;t <em>connected</em> yet.
          </h1>
          <p className="t-lead">The page you are looking for doesn&rsquo;t exist or has moved.</p>
          <div className={styles.actions}>
            <Button to="/">Back to home</Button>
            <Button to="/products" variant="secondary">
              Explore products
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
