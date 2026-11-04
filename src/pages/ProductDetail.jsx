import { Link, useParams } from 'react-router-dom';
import PageHero from '../components/layout/PageHero.jsx';
import ProductVisual from '../components/products/ProductVisual.jsx';
import ArchitectureDiagram from '../components/products/ArchitectureDiagram.jsx';
import SectionHeader from '../components/ui/SectionHeader.jsx';
import { RevealGroup, RevealItem, Reveal } from '../components/ui/Reveal.jsx';
import Button from '../components/ui/Button.jsx';
import CtaBand from '../components/ui/CtaBand.jsx';
import NotFound from './NotFound.jsx';
import { productBySlug, categoryLabel } from '../data/products.js';
import { whatsappLink } from '../data/site.js';
import useSeo from '../hooks/useSeo.js';
import { productMeta } from '../data/seo.js';
import styles from './ProductDetail.module.css';

export default function ProductDetail() {
  const { slug } = useParams();
  const product = productBySlug(slug);
  useSeo(productMeta(product));
  if (!product) return <NotFound />;

  const isPlaceholder = Boolean(product.placeholder);
  const demoTo = `/contact?intent=demo&product=${encodeURIComponent(product.slug)}#enquiry`;
  const enquiryTo = '/contact?topic=products#enquiry';

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
        {isPlaceholder && (
          <div className={styles.notice} role="note">
            <span className="t-mono">Placeholder page</span>
            <p>
              This page previews the TRANST product template. It does not describe a real product, and the
              capabilities, benefits and architecture below are sample text.
            </p>
          </div>
        )}
        <div className={styles.ctas}>
          {isPlaceholder ? (
            <Button to={enquiryTo}>Ask about TRANST products</Button>
          ) : (
            <Button to={demoTo}>Request a demo</Button>
          )}
          <Button to="/products" variant="secondary">
            All products
          </Button>
        </div>
      </PageHero>

      {/* Capabilities */}
      <section className="section" aria-labelledby="cap-title">
        <div className="container">
          <SectionHeader eyebrow="Capabilities" id="cap-title" title="What it *does.*" as="h2" />
          <RevealGroup as="ol" role="list" className={styles.caps} stagger={0.1}>
            {product.capabilities.map((c, i) => (
              <RevealItem as="li" key={c.title} className={styles.cap}>
                <span className={`t-mono ${styles.capNum}`}>{String(i + 1).padStart(2, '0')}</span>
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

      {isPlaceholder ? (
        <CtaBand
          eyebrow="Products"
          title="Looking for a specific *solution?*"
          lead="Full product details are coming soon. Tell us what you need and we will point you in the right direction."
          primary={{ label: 'Get in touch', props: { to: enquiryTo } }}
          secondary={{ label: 'Explore services', props: { to: '/services' } }}
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
