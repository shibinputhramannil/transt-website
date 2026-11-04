/**
 * TRANST product catalog — the single file to edit when the real portfolio arrives.
 *
 * Everything product-related reads from here: the catalog (/products), the detail pages
 * (/products/<slug>), category filters, featured badges and the sitemap.
 *
 * CURRENT STATE: all six entries are PLACEHOLDERS. They exist only so the catalog and detail
 * template can be reviewed. While `placeholder: true` is set, an entry:
 *   • shows a "Placeholder" tag on its card and a notice on its detail page,
 *   • offers no demo request (visitors are pointed to a general enquiry instead),
 *   • is marked noindex and left out of sitemap.xml,
 * and the catalog shows a notice for as long as any placeholder remains.
 *
 * TO ADD A REAL PRODUCT: copy PRODUCT_TEMPLATE below into `products`, fill every field with
 * verified information, and remove a placeholder. Do not set `placeholder` on real entries.
 * In development, missing or malformed fields are reported in the browser console
 * (see validateProducts.js).
 *
 * Fields
 *  slug          URL segment: /products/<slug> (lowercase, hyphens)
 *  name          Product name
 *  category      One of the `categories` ids below
 *  featured      true → star badge on the catalog, sorted first (catalog only — never the homepage)
 *  summary       One sentence for cards
 *  description   One or two sentences for the detail hero
 *  capabilities  [{ title, text }]               — 3 recommended
 *  benefits      [string]                        — 3 recommended
 *  architecture  [{ id, label, layer, text }]    — layer: 'input' | 'core' | 'output'
 *  useCases      [{ title, text }]               — 2 recommended
 */

export const categories = [
  { id: 'ai-software', label: 'AI Software' },
  { id: 'automation', label: 'Automation' },
  { id: 'agents', label: 'AI Agents' },
  { id: 'web', label: 'Web Applications' },
  { id: 'integration', label: 'Integration' },
];

/* Copy this shape for each real product (shown as a comment so it never renders):

  {
    slug: 'example-product',
    name: 'Example Product',
    category: 'automation',
    featured: false,
    summary: 'One verified sentence about what it does.',
    description: 'One or two verified sentences: what it does and who it is for.',
    capabilities: [
      { title: 'Capability', text: 'What it does, in plain language.' },
    ],
    benefits: ['A concrete benefit you can stand behind'],
    architecture: [
      { id: 'in', label: 'Input', layer: 'input', text: 'Where information comes from.' },
      { id: 'core', label: 'Core', layer: 'core', text: 'What processes it.' },
      { id: 'out', label: 'Output', layer: 'output', text: 'What it produces.' },
    ],
    useCases: [{ title: 'Use case', text: 'A real situation where it helps.' }],
  },
*/

// ---- Placeholder data (remove as real products are added) ---------------------------------

const placeholderArchitecture = [
  { id: 'src', label: 'Data sources', layer: 'input', text: 'Describe where this product receives information from.' },
  { id: 'ui', label: 'User input', layer: 'input', text: 'Describe how people interact with or instruct the product.' },
  { id: 'core', label: 'Intelligence core', layer: 'core', text: 'Describe the models, rules or logic at the centre of the product.' },
  { id: 'guard', label: 'Guardrails', layer: 'core', text: 'Describe validation, permissions and review steps.' },
  { id: 'act', label: 'Actions', layer: 'output', text: 'Describe what the product produces or changes.' },
  { id: 'report', label: 'Reporting', layer: 'output', text: 'Describe how results are surfaced and tracked.' },
];

const placeholder = (n, category, featured = false) => ({
  slug: `product-${n}`,
  name: `Product ${n}`,
  placeholder: true,
  category,
  featured,
  summary: 'Placeholder entry — replace with a one-sentence product summary.',
  description:
    'Placeholder description — replace with one or two sentences on what the product does and who it is for.',
  capabilities: [
    { title: 'Capability one', text: 'Describe a core capability of the product.' },
    { title: 'Capability two', text: 'Describe a second capability.' },
    { title: 'Capability three', text: 'Describe a third capability.' },
  ],
  benefits: ['First benefit to the customer', 'Second benefit to the customer', 'Third benefit to the customer'],
  architecture: placeholderArchitecture,
  useCases: [
    { title: 'Use case one', text: 'Describe a situation where this product helps.' },
    { title: 'Use case two', text: 'Describe another situation where this product helps.' },
  ],
});

// ---- The catalog ---------------------------------------------------------------------------

export const products = [
  placeholder(1, 'ai-software', true),
  placeholder(2, 'automation', true),
  placeholder(3, 'agents'),
  placeholder(4, 'web'),
  placeholder(5, 'integration'),
  placeholder(6, 'ai-software'),
];

export const productBySlug = (slug) => products.find((p) => p.slug === slug);
export const categoryLabel = (id) => categories.find((c) => c.id === id)?.label ?? id;
export const hasPlaceholders = products.some((p) => p.placeholder);
