import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { normalizeSiteUrl } from './src/data/siteUrl.js';
import { allRoutes, notFoundMeta, fullTitle, SITE_NAME, TAGLINE, OG_IMAGE } from './src/data/seo.js';
import { contact } from './src/data/contact.js';

// Fonts used above the fold on every page — preloaded to avoid a late font swap (layout shift).
const PRELOAD_FONTS = [/newsreader-latin-opsz-normal/, /newsreader-latin-opsz-italic/, /geist-latin-wght-normal/];

const HEAD_START = '<!-- transt:seo:start -->';
const HEAD_END = '<!-- transt:seo:end -->';

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/**
 * <head> metadata for one route. Absolute URLs (canonical, og:url, image) are only written when a
 * production domain is configured; otherwise canonical/og:url are omitted and the image stays relative.
 * noindex routes (placeholders, 404) get no canonical either, to avoid mixed signals.
 */
function headFor(route, siteUrl) {
  const title = fullTitle(route.title);
  const url = siteUrl && !route.noindex && route.path ? `${siteUrl}${route.path}` : null;
  const image = `${siteUrl}${OG_IMAGE.path}`;
  const org = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    slogan: TAGLINE,
    ...(siteUrl ? { url: `${siteUrl}/`, logo: `${siteUrl}/apple-touch-icon.png` } : {}),
    email: contact.email,
    contactPoint: { '@type': 'ContactPoint', contactType: 'customer enquiries', email: contact.email, telephone: contact.telephone },
  };
  const tags = [
    `<title>${esc(title)}</title>`,
    `<meta name="description" content="${esc(route.description)}" />`,
    `<meta name="robots" content="${route.noindex ? 'noindex, follow' : 'index, follow'}" />`,
    url && `<link rel="canonical" href="${esc(url)}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="${SITE_NAME}" />`,
    `<meta property="og:title" content="${esc(title)}" />`,
    `<meta property="og:description" content="${esc(route.description)}" />`,
    url && `<meta property="og:url" content="${esc(url)}" />`,
    `<meta property="og:image" content="${esc(image)}" />`,
    `<meta property="og:image:width" content="${OG_IMAGE.width}" />`,
    `<meta property="og:image:height" content="${OG_IMAGE.height}" />`,
    `<meta property="og:image:alt" content="${esc(OG_IMAGE.alt)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${esc(title)}" />`,
    `<meta name="twitter:description" content="${esc(route.description)}" />`,
    `<meta name="twitter:image" content="${esc(image)}" />`,
    `<script type="application/ld+json">${JSON.stringify(org).replace(/</g, '\\u003c')}</script>`,
  ].filter(Boolean);
  return [HEAD_START, ...tags, HEAD_END].join('\n    ');
}

const noscript = () =>
  `<noscript><p style="font-family: system-ui, sans-serif; padding: 1.5rem">${SITE_NAME} — ${esc(TAGLINE)} This site needs JavaScript. ` +
  `You can reach us at <a href="mailto:${esc(contact.email)}">${esc(contact.email)}</a> or on WhatsApp at ` +
  `<a href="https://wa.me/${esc(contact.whatsappDigits)}">${esc(contact.whatsappDisplay)}</a>.</p></noscript>`;

/**
 * Launch helpers (no extra dependencies):
 *  - validates VITE_SITE_URL (the build fails on a malformed value instead of emitting bad URLs)
 *  - writes route-specific <head> metadata into index.html, then one HTML file per route
 *    (/products/index.html, /products/<slug>/index.html, …) plus 404.html, so every route loads
 *    directly — even on hosts without a SPA rewrite — and non-JS crawlers see the right metadata
 *  - emits robots.txt, and sitemap.xml (indexable routes only) when the domain is configured
 *  - preloads the critical web fonts
 */
function transtSite(siteUrl) {
  const routes = allRoutes();
  const home = routes.find((r) => r.path === '/');
  let outDir = 'dist';

  return {
    name: 'transt-site',
    configResolved(config) {
      outDir = config.build.outDir;
    },
    transformIndexHtml: {
      order: 'post',
      handler(html, ctx) {
        const out = html.replace('<!-- transt:head -->', headFor(home, siteUrl)).replace('<!-- transt:noscript -->', noscript());
        const tags = [];
        for (const file of Object.keys(ctx.bundle ?? {})) {
          if (file.endsWith('.woff2') && PRELOAD_FONTS.some((re) => re.test(file))) {
            tags.push({ tag: 'link', attrs: { rel: 'preload', href: `/${file}`, as: 'font', type: 'font/woff2', crossorigin: '' }, injectTo: 'head' });
          }
        }
        return { html: out, tags };
      },
    },
    generateBundle() {
      const robots = ['User-agent: *', 'Allow: /'];
      if (siteUrl) robots.push('', `Sitemap: ${siteUrl}/sitemap.xml`);
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: robots.join('\n') + '\n' });

      if (!siteUrl) {
        this.warn(
          'VITE_SITE_URL is not set: no canonical or og:url tags, relative share-image URLs and no sitemap.xml. Set it before launch (see README → Deploying).',
        );
        return;
      }
      const indexable = routes.filter((r) => !r.noindex).map((r) => r.path);
      const xml =
        '<?xml version="1.0" encoding="UTF-8"?>\n' +
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
        indexable.map((p) => `  <url><loc>${siteUrl}${p}</loc></url>`).join('\n') +
        '\n</urlset>\n';
      this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: xml });
    },
    async writeBundle() {
      // index.html is final at this point (assets + preloads injected); clone it per route.
      const file = join(outDir, 'index.html');
      const template = await readFile(file, 'utf8');
      const block = new RegExp(`${HEAD_START}[\\s\\S]*?${HEAD_END}`);
      if (!block.test(template)) throw new Error('transt-site: SEO block markers missing from built index.html');
      const write = async (rel, route) => {
        const target = join(outDir, rel);
        await mkdir(dirname(target), { recursive: true });
        await writeFile(target, template.replace(block, headFor(route, siteUrl)));
      };
      for (const route of routes) {
        if (route.path !== '/') await write(join(route.path.slice(1), 'index.html'), route);
      }
      await write('404.html', { ...notFoundMeta, path: null });
    },
  };
}

export default defineConfig(({ mode }) => {
  // VITE_SITE_URL comes from the environment or a .env / .env.production file (see .env.example).
  const env = loadEnv(mode, process.cwd(), '');
  const siteUrl = normalizeSiteUrl(env.VITE_SITE_URL); // throws on malformed values
  return {
    plugins: [react(), transtSite(siteUrl)],
    server: { port: 5173 },
  };
});
