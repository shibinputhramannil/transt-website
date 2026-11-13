import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion';
import PageHero from '../components/layout/PageHero.jsx';
import ProductCard from '../components/products/ProductCard.jsx';
import Button from '../components/ui/Button.jsx';
import { categories, products } from '../data/products.js';
import useSeo from '../hooks/useSeo.js';
import { pages } from '../data/seo.js';
import styles from './Products.module.css';

export default function Products() {
  useSeo(pages['/products']);
  const [params, setParams] = useSearchParams();
  const current = categories.some((c) => c.id === params.get('category')) ? params.get('category') : 'all';

  const counts = useMemo(() => {
    const c = { all: products.length };
    categories.forEach((cat) => (c[cat.id] = products.filter((p) => p.category === cat.id).length));
    return c;
  }, []);

  const visible = useMemo(
    () =>
      products
        .filter((p) => current === 'all' || p.category === current)
        .sort((a, b) => Number(b.featured) - Number(a.featured)),
    [current],
  );

  const select = (id) => {
    const next = new URLSearchParams(params);
    if (id === 'all') next.delete('category');
    else next.set('category', id);
    setParams(next, { replace: true });
  };

  const filters = [{ id: 'all', label: 'All products' }, ...categories];

  return (
    <>
      <PageHero
        eyebrow="Products"
        title="Products built by *TRANST.*"
        lead="Software for running a business, a kitchen and an online store, for finding answers in your own documents, and for catching the right bus in Kerala. Filter by category or open a product for details."
        compact
      />

      <section className={`section ${styles.catalog}`} aria-labelledby="catalog-title">
        <div className="container">
          <h2 id="catalog-title" className="visually-hidden">
            Product catalog
          </h2>

          <div className={styles.toolbar}>
            <LayoutGroup id="product-filters">
              <div className={styles.filters} role="group" aria-label="Filter by category">
                {filters.map((f) => {
                  const on = current === f.id;
                  return (
                    <button
                      key={f.id}
                      type="button"
                      className={`${styles.filter} ${on ? styles.filterOn : ''}`}
                      aria-pressed={on}
                      onClick={() => select(f.id)}
                    >
                      {on && <motion.span layoutId="filter-pill" className={styles.pill} transition={{ type: 'spring', stiffness: 400, damping: 34 }} />}
                      <span className={styles.filterLabel}>
                        {f.label}
                        <span className={styles.count}>{counts[f.id]}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </LayoutGroup>
            <p className={`t-small ${styles.result}`} aria-live="polite">
              Showing {visible.length} {visible.length === 1 ? 'product' : 'products'}
            </p>
          </div>

          <motion.div
            layout
            className={styles.grid}
            data-count={visible.length}
            data-odd={visible.length > 1 && visible.length % 2 === 1 ? '' : undefined}
            data-many={visible.length >= 7 ? '' : undefined}
          >
            <AnimatePresence mode="popLayout" initial={false}>
              {visible.map((p) => (
                <ProductCard key={p.slug} product={p} />
              ))}
            </AnimatePresence>
          </motion.div>

          {visible.length === 0 && (
            <div className={styles.empty}>
              <p className="t-h3">No products in this category yet.</p>
              <Button variant="secondary" onClick={() => select('all')} arrow={false}>
                Show all products
              </Button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
