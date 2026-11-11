import { Link, useParams } from 'react-router-dom';
import PageHero from '../components/layout/PageHero.jsx';
import ProductVisual from '../components/products/ProductVisual.jsx';
import ArchitectureDiagram from '../components/products/ArchitectureDiagram.jsx';
import SectionHeader from '../components/ui/SectionHeader.jsx';
import { RevealGroup, RevealItem, Reveal } from '../components/ui/Reveal.jsx';
import Button from '../components/ui/Button.jsx';
import CtaBand from '../components/ui/CtaBand.jsx';
import NotFound from './NotFound.jsx';
import { productBySlug, categoryLabel, inDevelopment } from '../data/products.js';
import { whatsappLink } from '../data/site.js';
import useSeo from '../hooks/useSeo.js';
import { productMeta } from '../data/seo.js';
import styles from './ProductDetail.module.css';

function PlannedTag() {
  return <span className={`t-mono ${styles.planned}`}>Planned</span>;
}

export default function ProductDetail() {
  const { slug } = useParams();
  const product = productBySlug(slug);
  useSeo(productMeta(product));
  if (!product) return <NotFound />;

  const developing = inDevelopment(product);
  const demoTo = `/contact?intent=demo&product=${encodeURIComponent(product.slug)}#enquiry`;
  const interestTo = `/contact?intent=interest&product=${encodeURIComponent(product.slug)}#enquiry`;

  return (
    <>
      <PageHero
        eyebrow={
          <span className={styles.crumbs}>
            <Link to="/products">Products</Link>
            <span aria-hidden="true">/</span>
            {categoryLabel(product.category)}
          </span>
        }
        title={product.name}
        lead={product.description}
        visual={<ProductVisual product={product} />}
      >
        {developing && (
          <div className={styles.notice} role="note">
            <span className="t-mono">In development</span>
            <p>
              {product.statusNote} Everything marked <strong>Planned</strong> on this page describes the product as it
              is designed, not features you can use today.
            </p>
          </div>
        )}
        <div className={styles.ctas}>
          {developing ? <Button to={interestTo}>Ask about {product.name}</Button> : <Button to={demoTo}>Request a demo</Button>}
          <Button to="/products" variant="secondary">
            All products
          </Button>
        </div>
        {(product.stack?.length > 0 || product.source) && (
          <div className={styles.meta}>
            {product.stack?.length > 0 && (
              <div className={styles.stackRow}>
                <span className="t-mono">Built with</span>
                <ul role="list" className={styles.stack}>
                  {product.stack.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              </div>
            )}
            {product.source && (
              <a className={styles.source} href={product.source} target="_blank" rel="noopener noreferrer">
                <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fill="currentColor"
                    d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
                  />
                </svg>
                View source on GitHub
                <span className="visually-hidden"> (opens in a new tab)</span>
              </a>
            )}
          </div>
        )}
      </PageHero>

      {/* Capabilities */}
      <section className="section" aria-labelledby="cap-title">
        <div className="container">
          <SectionHeader eyebrow="Capabilities" id="cap-title" title="What it *does.*" as="h2" />
          <RevealGroup as="ol" role="list" className={styles.caps} stagger={0.1}>
            {product.capabilities.map((c, i) => (
              <RevealItem as="li" key={c.title} className={`${styles.cap} ${c.planned ? styles.capPlanned : ''}`}>
                <span className={styles.capHead}>
                  <span className={`t-mono ${styles.capNum}`}>{String(i + 1).padStart(2, '0')}</span>
                  {c.planned && <PlannedTag />}
                </span>
                <h3 className="t-h3">{c.title}</h3>
                <p className="t-body">{c.text}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* Benefits */}
      <section className={`section ${styles.benefitsSection}`} aria-labelledby="benefits-title">
        <div className={`container ${styles.benefits}`}>
          <SectionHeader eyebrow="Benefits" id="benefits-title" title="Why it *matters.*" className={styles.sticky} />
          <RevealGroup as="ul" role="list" className={styles.benefitList} stagger={0.08}>
            {product.benefits.map((b) => (
              <RevealItem as="li" key={b} className={styles.benefit}>
                <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
                  <circle cx="12" cy="12" r="11" fill="none" stroke="currentColor" strokeWidth="1.2" />
                  <path d="M7.5 12.5l3 3 6-7" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span>{b}</span>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* Architecture */}
      <section className="section" aria-labelledby="arch-title">
        <div className="container">
          <SectionHeader
            eyebrow="Architecture"
            id="arch-title"
            title="How it *fits together.*"
            lead="Select any component to see its role. Highlighted paths show how information moves through the product."
          />
          <Reveal className={styles.arch}>
            <ArchitectureDiagram nodes={product.architecture} />
          </Reveal>
        </div>
      </section>

      {/* Use cases */}
      <section className="section" aria-labelledby="uses-title">
        <div className="container">
          <SectionHeader eyebrow="Use cases" id="uses-title" title="Where it *helps.*" />
          <RevealGroup className={styles.uses} stagger={0.1}>
            {product.useCases.map((u) => (
              <RevealItem key={u.title} className={styles.use}>
                <h3 className="t-h4">{u.title}</h3>
                <p className="t-body">{u.text}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {developing ? (
        <CtaBand
          eyebrow="In development"
          title={`Interested in *${product.name}?*`}
          lead="It is still being built. Tell us what you would use it for, and we will get back to you."
          primary={{ label: `Ask about ${product.name}`, props: { to: interestTo } }}
          secondary={{
            label: 'Ask on WhatsApp',
            props: { href: whatsappLink(`Hello TRANST, I'd like to know more about ${product.name}.`) },
          }}
        />
      ) : (
        <CtaBand
          eyebrow="Request a demo"
          title={`See ${product.name} *in action.*`}
          lead="Tell us a little about your team and what you want to achieve. We will arrange a walkthrough around your use case."
          primary={{ label: 'Request a demo', props: { to: demoTo } }}
          secondary={{
            label: 'Ask on WhatsApp',
            props: { href: whatsappLink(`Hello TRANST, I'd like a demo of ${product.name}.`) },
          }}
        />
      )}
    </>
  );
}
