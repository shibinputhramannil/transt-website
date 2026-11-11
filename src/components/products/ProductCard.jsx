import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ProductGlyph from './ProductGlyph.jsx';
import { Arrow } from '../ui/Button.jsx';
import { categoryLabel, inDevelopment } from '../../data/products.js';
import { ease } from '../../motion/tokens.js';
import styles from './ProductCard.module.css';

export function StarBadge({ className = '' }) {
  return (
    <span className={`${styles.badge} ${className}`}>
      <svg width="12" height="12" viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M12 2.8l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 16.8l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"
          fill="currentColor"
        />
      </svg>
      Featured
    </span>
  );
}

/** Interactive catalog card: cursor spotlight, lift, glyph alignment on hover/focus. */
export default function ProductCard({ product }) {
  const [hover, setHover] = useState(false);

  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`);
  };

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.2 } }}
      transition={{ duration: 0.5, ease: ease.out }}
      className={`${styles.card} ${product.featured ? styles.featured : ''}`}
      onPointerMove={onMove}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
      onFocus={() => setHover(true)}
      onBlur={() => setHover(false)}
    >
      <div className={styles.visual}>
        <div className={styles.glyph}>
          <ProductGlyph seed={product.slug} active={hover} />
        </div>
        {product.featured && <StarBadge className={styles.badgePos} />}
        {inDevelopment(product) && <span className={styles.sample}>In development</span>}
      </div>
      <div className={styles.body}>
        <p className={`t-mono ${styles.cat}`}>{categoryLabel(product.category)}</p>
        <h3 className={styles.name}>
          <Link to={`/products/${product.slug}`} className={styles.link}>
            {product.name}
          </Link>
        </h3>
        <p className={styles.summary}>{product.summary}</p>
        <span className={styles.more} aria-hidden="true">
          View product <Arrow />
        </span>
      </div>
    </motion.article>
  );
}
