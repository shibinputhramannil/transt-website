import { Fragment } from 'react';
import { motion } from 'framer-motion';
import { ease, inViewOnce } from '../../motion/tokens.js';

/**
 * Staggered editorial headline. Each word rises out of a clipping mask.
 * Wrap words in *asterisks* to set them in italic accent: "Built into *every* solution".
 * Screen readers get the plain sentence once via aria-label.
 *
 * `trigger`: 'view' (scroll into view) | 'mount' (on mount) | boolean (controlled — animate when true)
 */
export default function SplitText({ as = 'h2', text, className, delay = 0, stagger = 0.06, trigger = 'view', id }) {
  const Tag = motion[as];
  const tokens = parse(text);
  const plain = tokens.map((t) => t.word).join(' ');

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: stagger, delayChildren: delay } },
  };
  const word = {
    hidden: { y: '110%', opacity: 0 },
    show: { y: '0%', opacity: 1, transition: { duration: 0.9, ease: ease.out } },
  };

  const control =
    trigger === 'view'
      ? { initial: 'hidden', whileInView: 'show', viewport: inViewOnce }
      : trigger === 'mount'
        ? { initial: 'hidden', animate: 'show' }
        : { initial: 'hidden', animate: trigger ? 'show' : 'hidden' };

  return (
    <Tag id={id} className={className} aria-label={plain} variants={container} {...control}>
      {tokens.map((t, i) => {
        const Inner = t.em ? 'em' : Fragment;
        return (
          <Fragment key={i}>
            <span aria-hidden="true" style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'top', paddingBottom: '0.08em', marginBottom: '-0.08em', paddingInline: '0.04em', marginInline: '-0.04em' }}>
              <motion.span style={{ display: 'inline-block', willChange: 'transform' }} variants={word}>
                <Inner>{t.word}</Inner>
              </motion.span>
            </span>
            {t.br ? <br /> : i < tokens.length - 1 ? ' ' : null}
          </Fragment>
        );
      })}
    </Tag>
  );
}

/** "Built into *every* solution|second line" → [{word, em, br}] ('|' forces a line break) */
function parse(text) {
  const out = [];
  let inEm = false;
  const lines = text.split('|');
  lines.forEach((line, li) => {
    const words = line.trim().split(/\s+/).filter(Boolean);
    words.forEach((raw, wi) => {
      let w = raw;
      if (w.startsWith('*')) {
        inEm = true;
        w = w.slice(1);
      }
      const em = inEm;
      // closing asterisk, optionally followed by punctuation: "every*" / "every*,"
      if (/\*[.,;:!?]*$/.test(w)) {
        w = w.replace(/\*([.,;:!?]*)$/, '$1');
        inEm = false;
      }
      out.push({ word: w, em, br: li < lines.length - 1 && wi === words.length - 1 });
    });
  });
  return out;
}
