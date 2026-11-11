# TRANST website

React + Vite + React Router + Framer Motion. *Intelligence, built into every solution.*

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build in dist/  (reads VITE_SITE_URL — see Deploying)
npm run preview    # serve dist/ at http://localhost:4173
```

## Launch blockers

- [x] **Production domain.** On Vercel, `VITE_SITE_URL` is `https://transt-website.vercel.app` (Production environment). Change it and redeploy when a custom domain is added (see Deploying).
- [ ] **WhatsApp country code.** The number was supplied as `8590675644` without a country code, and `+91` (India) is assumed. Confirm it, or correct it in `src/data/contact.js`.
- [x] **Real products.** The catalog lists the four TRANST products (see Products below).
- [ ] **Contact backend (optional).** The form only hands messages to WhatsApp or email; nothing is submitted to a server.

## Deploying

The domain is configured with one environment variable, **`VITE_SITE_URL`**: the bare public origin, such as `https://www.example.com`. A trailing slash is fine and gets stripped. A path, query or missing `https://` fails the build with an explanation.

1. **Set the domain**, either:
   - in a file: copy `.env.example` to `.env.production` and fill in `VITE_SITE_URL=https://www.your-domain.com`; or
   - in the host's build settings (Netlify, Vercel or Cloudflare Pages: Environment variables → `VITE_SITE_URL`).
2. **Build:** `npm ci && npm run build`. With a domain set, the build prints no `transt-site` warning.
3. **Check the output** in `dist/` before uploading:
   - `robots.txt` ends with `Sitemap: https://www.your-domain.com/sitemap.xml`;
   - `sitemap.xml` lists the indexable pages: `/`, `/products`, `/services`, `/about`, `/contact` and every product page (the 404 page is left out);
   - `dist/services/index.html` contains `<link rel="canonical" href="https://www.your-domain.com/services" />`.
4. **Upload `dist/`** to any static host. Publish directory: `dist`. Build command: `npm run build`.

### Routing on the host

The build writes one HTML file per route, each with that route's title, description, robots and canonical tags already in `<head>`:

```
dist/index.html                       dist/products/index.html
dist/services/index.html              dist/products/<slug>/index.html   (one per product)
dist/about/index.html                 dist/404.html                     (noindex)
dist/contact/index.html
```

So every route loads directly and survives a refresh **without any rewrite rule**: Netlify, Cloudflare Pages, GitHub Pages and S3/CloudFront website hosting serve `about/index.html` for `/about`. Unknown URLs get `404.html` with a real 404 status, and it shows the site's "page not found" screen.

- **Recommended:** no catch-all rewrite. It would turn unknown URLs into "200 OK" pages instead of real 404s.
- **If your host needs a catch-all** (some only serve `index.html` for unknown paths), add one that applies only when no file matches. Netlify `_redirects`: `/* /index.html 200`. Vercel `vercel.json`: `{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }`. Routes still work. On such hosts, crawlers that don't run JavaScript see the homepage's `<head>` until the app updates it. `npm run preview` behaves like this too.

When the domain is **not** set, the build warns and deliberately emits no absolute URLs: no canonical, no `og:url`, and a relative share image. The app does not fall back to whichever host is serving it, so a preview or staging URL can never become canonical.

## Edit content here

| What | File |
| --- | --- |
| Products (catalog, detail pages, generated HTML, sitemap) | `src/data/products.js` |
| Page titles, descriptions, index/noindex rules | `src/data/seo.js` |
| Email, WhatsApp number and GitHub profile (the only place they're defined) | `src/data/contact.js` |
| Services (five service lines) | `src/data/services.js` |
| Nav, tagline | `src/data/site.js` |
| What we do pillars, process stages, principles | `src/data/approach.js` |
| Homepage particle sphere (count, colours, motion) | `src/components/ai/ParticleSphere.jsx` |
| Hero aurora light | `src/components/ai/Aurora.jsx` |
| Diagram sphere nodes (Services, CTA bands, 404) | `DEFAULT_NODES` in `src/components/ai/AICircle.jsx` |
| Social share image | `public/og-image.png` (1200×630) |
| Production domain | `VITE_SITE_URL` (`.env.production` or host settings), validated by `src/data/siteUrl.js` |

`index.html` is a template: the `transt-site` plugin in `vite.config.js` fills in its metadata, Organization JSON-LD and `<noscript>` contact fallback from the files above. Don't hardcode metadata or contact details there.

### Products

`products.js` lists the four TRANST products. Every statement comes from the product's own repository (README and docs, checked against the code):

| Product | Page | Category | Repository |
| --- | --- | --- | --- |
| TRANST ERP | `/products/erp` | Business Operations | [transt-erp](https://github.com/shibinputhramannil/transt-erp) (public) |
| KitchenMind AI | `/products/kitchenmind-ai` | Business Operations | [transtkitchen](https://github.com/shibinputhramannil/transtkitchen) (public) |
| TRANST E-Commerce | `/products/ecommerce` | E-Commerce | [transt-ecommerce](https://github.com/shibinputhramannil/transt-ecommerce) (public) |
| TRANST Knowledge AI | `/products/knowledge-ai` | AI Software | private repository (no source link) |

- **Knowledge AI is in development** (`status: 'in-development'`). Only its dashboard shell and API foundation exist. Its card shows an **In development** tag, its page explains what exists today, every feature is tagged **Planned**, and it offers **Ask about it** instead of a demo request. When its features ship, remove the `planned` flags and the status, and update the text.
- Detail pages show a **Built with** list (`stack`) and, for public repositories, a **View source on GitHub** link (`source`).
- All product pages and the catalog are indexable and listed in `sitemap.xml`.
- To change a product, edit its entry; the field reference is at the top of `products.js`. In development the browser console reports missing or malformed fields (`src/data/validateProducts.js`). Set `featured: true` for a star badge on the catalog (never shown on the homepage).
- KitchenMind AI also runs on Render (`kitchenmind-web.onrender.com`, free plan). The site does not link to it, because the free database expires and has no backups. Add a link only once it is on a paid plan.

### Contact form

There is **no submission backend**. The form validates input, then opens WhatsApp or the visitor's email app with the message pre-written; the visitor presses send there. The page says so in plain words. A blocked WhatsApp window shows an error with a direct link. Every send offers **Copy message** plus the email address and WhatsApp number as a fallback. Links can prefill the form: `/contact?service=<id>#enquiry`, `/contact?topic=products#enquiry`, `/contact?intent=demo&product=<slug>#enquiry` (a demo request; products in development get a plain enquiry instead), and `/contact?intent=interest&product=<slug>#enquiry`.

The WhatsApp number assumes the India country code (`+91`) and **needs confirmation**. If it's wrong, change `whatsappDigits`, `whatsappDisplay` and `telephone` together in `src/data/contact.js`.

## Structure

```
src/
  assets/brand/        logo: original SVG + cropped, background-removed PNGs (never recolour/redraw)
  styles/tokens.css    design tokens: colour, type scale, spacing, radius, shadow, motion
  styles/base.css      reset, typography classes (.t-display … .t-mono, .eyebrow), layout utilities
  motion/tokens.js     motion system: easings, durations, shared variants + the motion rules
  data/                content + config: products, services, contact, seo, site, siteUrl, approach
  hooks/               useSeo (keeps <head> in sync on navigation), useHashScroll
  components/
    ai/AICircle        signature AI visual (SVG + Framer Motion), reusable, tone="light|dark", custom nodes
    intro/             cinematic opening (once per session, skip button + Esc, off under reduced motion)
    layout/            Header (+ modal mobile menu), Footer, PageHero, PageTransition (route focus)
    home/              homepage sections
    services/          ServiceDiagram — five animated technical diagrams
    products/          ProductCard, ProductGlyph, ProductVisual, ArchitectureDiagram
    contact/           ContactChannels
    ui/                Button, Reveal, SplitText, SectionHeader, CtaBand
  pages/               Home (eager) · Products, ProductDetail, Services, About, Contact, NotFound (lazy)
vite.config.js         transt-site plugin: domain validation, per-route HTML + 404.html, metadata,
                       JSON-LD, robots.txt, sitemap.xml, font preloads
```

## Homepage

`Hero` → `WhatWeDo` → `ServiceCards` (bento) → `Process` → `ContactSection`, all in `src/components/home/`.
No products appear on the homepage.

- **Hero:** a dark stage with a WebGL particle sphere (14,000 points, 7,000 on phones) and the headline set inside it, with aurora light rising beneath. The sphere gathers into shape on load and breathes slowly. It swells toward the cursor (or a finger while touching), and a click or tap sends a ripple across its surface. There is no visible control or hint text; a **Pause motion** button appears only when it receives keyboard focus (Tab, like a skip link) and stops the sphere and the aurora (WCAG 2.2.2).
  - Performance: no 3D library, raw WebGL. Both canvases render only while visible and the tab is active. The aurora is drawn at 1/6 resolution at ~30 fps, and freezes into a still image on devices that can't keep frames smooth. The sphere tries fewer particles if frames are slow and keeps the change only if it helps.
  - Reduced motion: one still frame of each, no pointer reaction, no pause button. Without WebGL, static CSS stand-ins are shown.
  - The canvases are decorative (`aria-hidden`). The headline, description and buttons are ordinary HTML.
- **WhatWeDo:** a dark panel that opens from an inset card to full width as it scrolls in. It animates `clip-path`, which only repaints.
- **ServiceCards:** every card shows its content up front. The diagram animates on hover or keyboard focus, or on touch screens when the card is centred.
- **Process:** a sticky stage tracker on desktop and a stacked timeline on mobile. Pass `tone="plain"` when it follows another cream-band section (About does this).

`ParticleSphere` props: `play`, `paused`, `interactionRef` (the element whose pointer events drive it; the hero passes the whole section).
`AICircle` (the SVG diagram sphere, still used on Services, the CTA bands and the 404 page) props: `nodes`, `play`, `tone`, `labels`, `interactive`, `active`, `paused`, `onActiveChange(id)`, `onSelect(id)`.

## Accessibility & SEO

- One `h1` per page, no skipped heading levels, labelled landmarks, and a skip link.
- After each client-side navigation, focus moves to the new page's `h1`.
- Mobile menu: it's a dialog. Focus moves into it, the page behind is `inert`, Esc closes it and returns focus to the toggle, and it closes automatically when the screen widens to desktop.
- Muted text (`--ink-3`) meets AA contrast on both cream surfaces.
- Metadata for every route comes from `src/data/seo.js`. The build bakes it into each route's HTML file, and `useSeo()` applies the same values on client-side navigation.

## Motion rules

1. Motion explains: it reveals hierarchy, shows flow or confirms input.
2. One hero motion per viewport; everything else stays quiet.
3. Ambient loops are slow (≥ 6 s) and pause when off-screen.
4. `prefers-reduced-motion`: no intro, no loops, no parallax. Content and diagrams render in their final state.

## Verification

```bash
npm run build                      # must finish without errors
npm run preview                    # then load every route at 390 / 820 / 1440px
# confirm generated routes and metadata without a browser (no JavaScript involved):
grep -o '<title>[^<]*</title>\|name="robots" content="[^"]*"' dist/products/erp/index.html
```

The project has no lint or test scripts. During development it was checked with ESLint 9 (`@eslint/js` recommended + `eslint-plugin-react` + `react-hooks`) and axe-core 4, both run from a temporary folder, plus Playwright in Chromium and WebKit. Those runs covered all routes at three widths, direct loads and refreshes on a host with no rewrite rule, the contact hand-offs, and reduced motion.

## Brand

Deep Forest Green `#245C49` · Warm Cream `#FEF9EC` · Secondary Cream `#EAE6D9` · Soft Peach `#E8C5A3` · Charcoal `#202923`.
Newsreader (headings), Geist (body), Geist Mono (labels), all self-hosted via Fontsource. The three above-the-fold font files are preloaded in production.
Use the logo only on light (cream) surfaces: the green wordmark lacks contrast on charcoal.
