import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import PageHero from '../components/layout/PageHero.jsx';
import ContactChannels from '../components/contact/ContactChannels.jsx';
import { Reveal, RevealGroup, RevealItem } from '../components/ui/Reveal.jsx';
import Button from '../components/ui/Button.jsx';
import { services, serviceById } from '../data/services.js';
import { productBySlug, inDevelopment } from '../data/products.js';
import { site, mailto, whatsappLink } from '../data/site.js';
import useSeo from '../hooks/useSeo.js';
import { pages } from '../data/seo.js';
import styles from './Contact.module.css';

const TOPICS = [
  { id: 'general', label: 'General enquiry' },
  { id: 'products', label: 'Products & demos' },
  ...services.map((s) => ({ id: s.id, label: s.title })),
];

const MAX_MESSAGE = 2000;

/**
 * Derive initial form state from links such as
 *   /contact?intent=demo&product=<slug>       (products in development never prefill a demo)
 *   /contact?intent=interest&product=<slug>   /contact?service=<service-id>   /contact?topic=products|services
 */
function initialFromParams(params) {
  const product = productBySlug(params.get('product') ?? '');
  const service = serviceById(params.get('service') ?? '');
  const topic = params.get('topic');
  if (product) {
    const demo = params.get('intent') === 'demo' && !inDevelopment(product);
    const message = demo ? `I'd like to request a demo of ${product.name}.` : `I'd like to know more about ${product.name}.`;
    return { topic: 'products', message: `${message}\n\n` };
  }
  if (params.get('intent') === 'demo' || topic === 'products') {
    return { topic: 'products', message: "I'd like to know more about TRANST products.\n\n" };
  }
  if (service) return { topic: service.id, message: `I'm interested in ${service.title}.\n\n` };
  return { topic: 'general', message: topic === 'services' ? "I'd like to discuss a project.\n\n" : '' };
}

export default function Contact() {
  useSeo(pages['/contact']);
  const [params] = useSearchParams();
  const init = useMemo(() => initialFromParams(params), [params]);
  const [form, setForm] = useState({ name: '', company: '', topic: init.topic, message: init.message });
  const [errors, setErrors] = useState({});
  // { channel: 'whatsapp' | 'email', ok: boolean } after the visitor presses a send button
  const [sent, setSent] = useState(null);
  const [copied, setCopied] = useState(null); // null | 'ok' | 'failed'

  const set = (k) => (e) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    if (errors[k]) setErrors((er) => ({ ...er, [k]: undefined }));
  };

  const compose = () => {
    const topic = TOPICS.find((t) => t.id === form.topic)?.label ?? 'Enquiry';
    const lines = [
      form.message.trim(),
      '',
      `— ${form.name.trim()}${form.company.trim() ? `, ${form.company.trim()}` : ''}`,
      `Topic: ${topic}`,
    ];
    return { subject: `${topic} — ${form.name.trim()}`, body: lines.join('\n') };
  };

  const validate = () => {
    const er = {};
    if (!form.name.trim()) er.name = 'Please tell us your name.';
    if (form.message.trim().length < 10) er.message = 'Please add a short message (at least 10 characters).';
    setErrors(er);
    if (Object.keys(er).length) {
      document.getElementById(`f-${Object.keys(er)[0]}`)?.focus();
      return false;
    }
    return true;
  };

  const send = (channel) => {
    if (!validate()) return;
    const { subject, body } = compose();
    setCopied(null);
    if (channel === 'whatsapp') {
      // window.open returns null when a pop-up blocker stops the new tab.
      const win = window.open(whatsappLink(`Hello TRANST,\n\n${body}`), '_blank');
      if (win) win.opener = null;
      setSent({ channel, ok: Boolean(win) });
    } else {
      // A mailto: link can't report whether an email app opened, so the fallback is always offered.
      window.location.href = mailto(subject, body);
      setSent({ channel, ok: true });
    }
  };

  const copyMessage = async () => {
    const { subject, body } = compose();
    try {
      await navigator.clipboard.writeText(`${subject}\n\n${body}`);
      setCopied('ok');
    } catch {
      setCopied('failed');
    }
  };
  const { body: preparedBody } = compose();

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Let's build something *intelligent.*"
        lead="Tell us about your idea, product or process. Reach us directly by email or WhatsApp, or prepare your message with the form below."
        compact
      />

      <section className={`section ${styles.section}`} aria-label="Contact options">
        <div className={`container ${styles.grid}`}>
          <div className={styles.side}>
            <Reveal>
              <ContactChannels />
            </Reveal>
            <Reveal className={styles.tips} delay={0.1}>
              <p className="t-mono">Helpful to include</p>
              <RevealGroup as="ul" role="list" stagger={0.06}>
                {[
                  'What you want to achieve, in a sentence or two',
                  'Who will use the solution day to day',
                  'Systems or data it needs to work with',
                  'Any timing that matters to you',
                ].map((t) => (
                  <RevealItem as="li" key={t}>
                    {t}
                  </RevealItem>
                ))}
              </RevealGroup>
            </Reveal>
          </div>

          <Reveal className={styles.formCard} delay={0.05} id="enquiry">
            <form
              className={styles.form}
              noValidate
              onSubmit={(e) => {
                e.preventDefault();
                send('whatsapp');
              }}
            >
              <div className={styles.formHead}>
                <h2 className="t-h3">Prepare your message</h2>
                <p className={styles.limit}>
                  <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
                    <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="1.6" />
                    <path d="M12 11v6M12 7.5v.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  </svg>
                  <span>
                    This form doesn&rsquo;t send anything by itself. It prepares your message and opens WhatsApp or your
                    email app, where you press send. Nothing is stored on this website.
                  </span>
                </p>
              </div>

              <div className={styles.row}>
                <Field id="f-name" label="Your name" required error={errors.name}>
                  <input
                    id="f-name"
                    type="text"
                    autoComplete="name"
                    required
                    maxLength={100}
                    value={form.name}
                    onChange={set('name')}
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? 'f-name-err' : undefined}
                  />
                </Field>
                <Field id="f-company" label="Company" hint="Optional">
                  <input id="f-company" type="text" autoComplete="organization" maxLength={120} value={form.company} onChange={set('company')} />
                </Field>
              </div>

              <fieldset className={styles.topics}>
                <legend className={styles.label}>Topic</legend>
                <div className={styles.chips}>
                  {TOPICS.map((t) => (
                    <label key={t.id} className={`${styles.chip} ${form.topic === t.id ? styles.chipOn : ''}`}>
                      <input type="radio" name="topic" value={t.id} checked={form.topic === t.id} onChange={set('topic')} />
                      {t.label}
                    </label>
                  ))}
                </div>
              </fieldset>

              <Field id="f-message" label="Message" required error={errors.message}>
                <textarea
                  id="f-message"
                  rows={6}
                  required
                  maxLength={MAX_MESSAGE}
                  value={form.message}
                  onChange={set('message')}
                  aria-invalid={!!errors.message}
                  aria-describedby={`f-message-count${errors.message ? ' f-message-err' : ''}`}
                />
                <span id="f-message-count" className={styles.count}>
                  {form.message.length} / {MAX_MESSAGE}
                </span>
              </Field>

              <div className={styles.actions}>
                <Button type="submit">Send via WhatsApp</Button>
                <Button variant="secondary" onClick={() => send('email')}>
                  Send via email
                </Button>
              </div>

              <AnimatePresence>
                {sent && (
                  <motion.div
                    key={`${sent.channel}-${sent.ok}`}
                    className={`${styles.result} ${sent.ok ? styles.resultOk : styles.resultError}`}
                    role={sent.ok ? 'status' : 'alert'}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    {sent.ok ? (
                      <p>
                        <strong>Almost done.</strong> Your message is ready in{' '}
                        {sent.channel === 'whatsapp' ? 'WhatsApp' : 'your email app'} — press send there to deliver it.
                        It has not been sent yet.
                      </p>
                    ) : (
                      <p>
                        <strong>WhatsApp didn&rsquo;t open.</strong> Your browser may have blocked the new tab.{' '}
                        <a href={whatsappLink(`Hello TRANST,\n\n${preparedBody}`)} target="_blank" rel="noopener noreferrer">
                          Open WhatsApp with your message
                        </a>{' '}
                        or use one of the options below.
                      </p>
                    )}
                    <p className={styles.fallback}>
                      If nothing opened, copy your message and send it to <a href={mailto()}>{site.contact.email}</a>{' '}
                      or on WhatsApp to {site.contact.whatsappDisplay}.
                    </p>
                    <div className={styles.resultActions}>
                      <Button variant="secondary" size="sm" arrow={false} onClick={copyMessage}>
                        {copied === 'ok' ? 'Message copied' : 'Copy message'}
                      </Button>
                      {copied === 'failed' && (
                        <span className={styles.copyFail} role="alert">
                          Copying isn&rsquo;t available here — select the text in the message box instead.
                        </span>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </Reveal>
        </div>
      </section>
    </>
  );
}

function Field({ id, label, hint, required, error, children }) {
  return (
    <div className={`${styles.field} ${error ? styles.hasError : ''}`}>
      <label htmlFor={id} className={styles.label}>
        {label}
        {required && <span aria-hidden="true"> *</span>}
        {hint && <span className={styles.hint}>{hint}</span>}
      </label>
      {children}
      <AnimatePresence>
        {error && (
          <motion.span id={`${id}-err`} className={styles.error} initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            {error}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}
