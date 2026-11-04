import SplitText from '../ui/SplitText.jsx';
import { Reveal } from '../ui/Reveal.jsx';
import Button from '../ui/Button.jsx';
import ContactChannels from '../contact/ContactChannels.jsx';
import styles from './ContactSection.module.css';

export default function ContactSection() {
  return (
    <section className="section" aria-labelledby="contact-title">
      <div className="container">
        <div className={styles.panel}>
          <div className={styles.copy}>
            <Reveal as="p" className="eyebrow">
              Get in touch
            </Reveal>
            <SplitText as="h2" id="contact-title" className="t-h1" text="Have a problem worth *solving?*" />
            <Reveal as="p" className="t-lead" delay={0.1}>
              Tell us what you are working on — a process to automate, a product to build or a system to connect.
              Reach us by email, on WhatsApp or through the contact form.
            </Reveal>
            <Reveal delay={0.2}>
              <Button to="/contact#enquiry" variant="secondary">
                Open the contact form
              </Button>
            </Reveal>
          </div>
          <Reveal delay={0.15} className={styles.channels}>
            <ContactChannels />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
