/**
 * TRANST product catalog — the single file to edit when products change.
 *
 * Everything product-related reads from here: the catalog (/products), the detail pages
 * (/products/<slug>), category filters, featured badges, the generated HTML and the sitemap.
 *
 * Every statement below comes from the product's own repository (its README and docs, checked
 * against the code). Keep it that way: describe only what the software really does today, and
 * mark anything that is not built yet as planned.
 *
 * Fields
 *  slug          URL segment: /products/<slug> (lowercase, hyphens)
 *  name          Product name
 *  category      One of the `categories` ids below
 *  featured      true → star badge on the catalog, sorted first (catalog only — never the homepage)
 *  status        Optional. 'in-development' for a product whose main features are not built yet:
 *                its card and page say so, and it offers "Ask about it" instead of a demo.
 *  statusNote    Required with `status`: what exists today and what does not.
 *  summary       One sentence for cards and the page's meta description
 *  description   One or two sentences for the detail hero
 *  capabilities  [{ title, text, planned? }]               — planned: true shows a "Planned" tag
 *  benefits      [string]
 *  architecture  [{ id, label, layer, text, planned? }]    — layer: 'input' | 'core' | 'output'
 *  useCases      [{ title, text }]
 *  stack         [string]                                  — "Built with" list on the detail page
 *  source        Optional public repository URL → "View source on GitHub" (leave out for private repos)
 */

export const categories = [
  { id: 'operations', label: 'Business Operations' },
  { id: 'commerce', label: 'E-Commerce' },
  { id: 'ai-software', label: 'AI Software' },
];

export const products = [
  // Source: github.com/shibinputhramannil/transt-erp (README, docs, phase reports, code)
  {
    slug: 'erp',
    name: 'TRANST ERP',
    category: 'operations',
    featured: false,
    summary:
      'A multi-company ERP for sales, purchasing, inventory, finance, CRM and employees, with a read-only AI assistant.',
    description:
      'TRANST ERP runs a business’s daily operations in one web application, from the first lead to the paid invoice and from the purchase order to the vendor payment, with the books kept in double entry. Each company’s data stays separate.',
    capabilities: [
      {
        title: 'Sales to cash',
        text: 'Leads and deals become customers, quotations, sales orders, stock reservations, invoices and payments in one connected flow.',
      },
      {
        title: 'Purchase to pay',
        text: 'Vendors, purchase orders, goods receipts, vendor bills and payments, with stock updated as goods arrive.',
      },
      {
        title: 'Inventory control',
        text: 'Products and stock levels, with reservations for confirmed orders, low-stock warnings and rules that stop stock going negative.',
      },
      {
        title: 'Double-entry finance',
        text: 'Payments and other transactions post balanced journal entries, where debits always equal credits, to the ledger behind the reports.',
      },
      {
        title: 'AI assistant',
        text: 'Ask about sales, purchases, stock, customers or finances and get answers from your company’s own records. It can read your data but never change it.',
      },
      {
        title: 'Workspace',
        text: 'Notes, documents, email, a calendar and notifications alongside the business modules, plus a global search.',
      },
    ],
    benefits: [
      'Sales, purchasing, stock and accounts in one system instead of separate tools',
      'Sales and purchases flow through to balanced, double-entry books',
      'Several companies in one installation, each with its own data and team',
      'An assistant that answers from your own records and cannot change them',
    ],
    architecture: [
      {
        id: 'people',
        label: 'Teams and roles',
        layer: 'input',
        text: 'People sign in and work inside the companies they belong to. Their role decides what they can do.',
      },
      {
        id: 'records',
        label: 'Business records',
        layer: 'input',
        text: 'Leads, customers, vendors, orders, receipts, invoices and bills, entered in the React web app.',
      },
      {
        id: 'api',
        label: 'Django REST API',
        layer: 'core',
        text: 'Applies the business rules (stock reservations, journal postings, permissions) and limits every request to the active company.',
      },
      {
        id: 'assistant',
        label: 'AI assistant',
        layer: 'core',
        text: 'A read-only layer that gathers figures from every module. With a Gemini or OpenAI key it writes answers grounded in those figures; without one it answers directly from the data.',
      },
      {
        id: 'books',
        label: 'Ledger and reports',
        layer: 'output',
        text: 'Journal entries, financial reports and the dashboard, all stored in PostgreSQL.',
      },
      {
        id: 'insights',
        label: 'Insights and alerts',
        layer: 'output',
        text: 'Business summaries, trends, low-stock warnings and notifications for the team.',
      },
    ],
    useCases: [
      {
        title: 'Trading business',
        text: 'Follow a sale from the first enquiry to payment, with stock reserved and the books updated along the way.',
      },
      {
        title: 'Group of companies',
        text: 'Run several companies from one installation, each with its own team, records and accounts.',
      },
    ],
    stack: ['React', 'Vite', 'Material UI', 'Django REST Framework', 'PostgreSQL', 'Docker'],
    source: 'https://github.com/shibinputhramannil/transt-erp',
  },

  // Source: github.com/shibinputhramannil/transtkitchen (README and code)
  {
    slug: 'kitchenmind-ai',
    name: 'KitchenMind AI',
    category: 'operations',
    featured: false,
    summary:
      'Kitchen operations for restaurants, bakeries and cloud kitchens: prep plans from sales forecasts, stock with expiry dates, and waste tracking.',
    description:
      'KitchenMind AI helps independent restaurants, bakeries and cloud kitchens decide how much to prepare from their own sales history, keep track of stock and expiry dates, and see where food goes to waste.',
    capabilities: [
      {
        title: 'Sales forecasts',
        text: 'Estimates how many portions of each menu item will sell, from recent sales on the same weekday (or the last 14 trading days), and shows which days each forecast used.',
      },
      {
        title: 'Prep planner',
        text: 'Turns forecasts plus an adjustable buffer into a prep plan for any day up to two weeks ahead, and works out the ingredients it needs from your recipes.',
      },
      {
        title: 'Stock and expiry',
        text: 'Every delivery is tracked as its own batch with an optional expiry date. Stock is used earliest-expiry first, and anything expiring within three days is flagged.',
      },
      {
        title: 'Sales imports',
        text: 'Import daily sales from a CSV file. A preview matches items to the menu and lists any warnings before stock changes.',
      },
      {
        title: 'Waste logging',
        text: 'Log waste by ingredient or by menu item, with a reason such as expired, spoiled or overproduction, and review summaries for any date range.',
      },
      {
        title: 'Team roles',
        text: 'Owners, managers and staff each see and do what their role allows, and every kitchen’s data is kept separate.',
      },
    ],
    benefits: [
      'Prep quantities based on what actually sold',
      'Stock used earliest-expiry first, with expiring items flagged ahead of time',
      'A complete history of every stock change: what changed, who made it and when',
      'Prep plans that show which ingredients will be short',
    ],
    architecture: [
      {
        id: 'sales',
        label: 'Sales CSV',
        layer: 'input',
        text: 'Daily sales in a CSV file, previewed and matched to menu items before they are applied.',
      },
      {
        id: 'stock',
        label: 'Deliveries and counts',
        layer: 'input',
        text: 'Stock received, with optional expiry dates, and stock counted on the shelf.',
      },
      {
        id: 'recipes',
        label: 'Recipes',
        layer: 'input',
        text: 'How much of each ingredient one portion of each menu item uses.',
      },
      {
        id: 'ledger',
        label: 'Stock ledger',
        layer: 'core',
        text: 'Batches with expiry dates. Sales and waste are deducted earliest-expiry first, and every change is kept in the stock history.',
      },
      {
        id: 'forecast',
        label: 'Forecasting',
        layer: 'core',
        text: 'Averages of applied sales: the same weekday over recent weeks, or the last 14 trading days when there is less history.',
      },
      {
        id: 'plans',
        label: 'Prep plans',
        layer: 'output',
        text: 'Portions to prepare per menu item, the ingredients they need, and what is short against current stock.',
      },
      {
        id: 'reports',
        label: 'Sales and waste reports',
        layer: 'output',
        text: 'Quantities sold per item per day, and waste by ingredient, reason and menu item.',
      },
    ],
    useCases: [
      {
        title: 'Independent restaurant',
        text: 'Import yesterday’s sales in the morning, check tomorrow’s prep plan, and see which ingredients are short or close to expiry.',
      },
      {
        title: 'Bakery or cloud kitchen',
        text: 'Track every batch and its expiry date, log what gets discarded and why, and compare what was prepared with what actually sold.',
      },
    ],
    stack: ['React', 'Vite', 'Django REST Framework', 'PostgreSQL', 'Docker'],
    source: 'https://github.com/shibinputhramannil/transtkitchen',
  },

  // Source: github.com/shibinputhramannil/transt-ecommerce (README and code)
  {
    slug: 'ecommerce',
    name: 'TRANST E-Commerce',
    category: 'commerce',
    featured: false,
    summary:
      'A full-stack online store: catalog search and filters, a saved cart that checks stock, checkout that updates inventory, and order history.',
    description:
      'A complete storefront and API for selling online. Shoppers browse and search the catalog, keep a cart saved to their account, and place orders that update stock and record the prices paid.',
    capabilities: [
      {
        title: 'Catalog and search',
        text: 'Search products by name or description, filter by category and sort the results.',
      },
      {
        title: 'Saved cart',
        text: 'Each customer’s cart is stored on the server. Quantities are checked against stock, and adding an item twice merges the quantities.',
      },
      {
        title: 'Stock-safe checkout',
        text: 'Placing an order creates it, deducts the stock and empties the cart in one database transaction: either all of it happens or none of it does.',
      },
      {
        title: 'Order history',
        text: 'Customers see their past orders and receipts. Each line keeps the price paid, even if catalog prices change later.',
      },
      {
        title: 'Customer accounts',
        text: 'Registration and sign-in with tokens that refresh automatically. Checkout and order pages need a signed-in customer.',
      },
      {
        title: 'Separate customer data',
        text: 'Customers can only see and change their own cart and orders.',
      },
    ],
    benefits: [
      'Stock is checked when items go into the cart and again when the order is placed',
      'Order records keep the price actually paid',
      'Designed for desktop, tablet and phone screens',
      'Storefront and API are separate, so either can be adapted on its own',
    ],
    architecture: [
      {
        id: 'shoppers',
        label: 'Shoppers',
        layer: 'input',
        text: 'Browse, search, fill a cart and check out in the React storefront.',
      },
      {
        id: 'catalog',
        label: 'Product catalog',
        layer: 'input',
        text: 'Products, categories, prices and stock levels stored in the database.',
      },
      {
        id: 'api',
        label: 'Django REST API',
        layer: 'core',
        text: 'Sign-in with JWT tokens, catalog queries, the server-side cart and the order endpoints.',
      },
      {
        id: 'checkout',
        label: 'Checkout transaction',
        layer: 'core',
        text: 'Checks stock, creates the order, deducts inventory and clears the cart in one atomic step.',
      },
      {
        id: 'orders',
        label: 'Orders and receipts',
        layer: 'output',
        text: 'Order history with the prices paid, visible only to the customer who placed each order.',
      },
      {
        id: 'inventory',
        label: 'Updated stock',
        layer: 'output',
        text: 'Stock levels that reflect every order as it is placed.',
      },
    ],
    useCases: [
      {
        title: 'Brand selling direct',
        text: 'Put a product range online with search, a cart and order history, on your own hosting and database.',
      },
      {
        title: 'Base for a custom store',
        text: 'Start from a working storefront and API, then add your payment provider and adapt the catalog and design to your business.',
      },
    ],
    stack: ['React', 'Redux Toolkit', 'Tailwind CSS', 'Django REST Framework', 'PostgreSQL'],
    source: 'https://github.com/shibinputhramannil/transt-ecommerce',
  },

  // Source: the private Knowledge AI repository (README and architecture docs).
  // Phase 1 only: everything below except the stack is planned, and is marked so.
  {
    slug: 'knowledge-ai',
    name: 'TRANST Knowledge AI',
    category: 'ai-software',
    featured: false,
    status: 'in-development',
    statusNote:
      'The first stage is built: the dashboard and the API foundation. Document upload, search and AI answers are planned and not available yet.',
    summary:
      'In development: an AI assistant that will answer questions from your organization’s own documents and cite its sources.',
    description:
      'Knowledge AI is being built so a team can upload its documents, search them, and ask questions answered only from those documents, with every source cited.',
    capabilities: [
      {
        title: 'Document library',
        planned: true,
        text: 'Upload documents and have them processed in the background (text extracted, split and indexed), with each document’s status shown as it really is.',
      },
      {
        title: 'Semantic search',
        planned: true,
        text: 'Search by meaning and by keyword, across your own organization’s documents only.',
      },
      {
        title: 'Cited answers',
        planned: true,
        text: 'Ask a question and get an answer built only from passages in your own documents, with each source cited.',
      },
    ],
    benefits: [
      'Answers grounded in your own documents, with sources you can check',
      'Each organization’s documents kept separate from every other',
      'An AI layer that can change provider without rebuilding the product',
    ],
    architecture: [
      {
        id: 'docs',
        label: 'Documents',
        layer: 'input',
        planned: true,
        text: 'Files your team uploads, stored with their processing status.',
      },
      {
        id: 'questions',
        label: 'Questions',
        layer: 'input',
        planned: true,
        text: 'Questions asked in the web app.',
      },
      {
        id: 'pipeline',
        label: 'Processing pipeline',
        layer: 'core',
        planned: true,
        text: 'Background workers (Celery and Redis) extract text, split it into passages and index them in PostgreSQL with pgvector.',
      },
      {
        id: 'ai',
        label: 'AI service layer',
        layer: 'core',
        planned: true,
        text: 'One interface for embeddings and answers, so the AI provider can change without touching the rest of the product.',
      },
      {
        id: 'search',
        label: 'Search results',
        layer: 'output',
        planned: true,
        text: 'Passages from your own organization’s documents, ranked by meaning and keywords.',
      },
      {
        id: 'answers',
        label: 'Cited answers',
        layer: 'output',
        planned: true,
        text: 'Answers built from the retrieved passages, each with its sources.',
      },
    ],
    useCases: [
      {
        title: 'Company knowledge base',
        text: 'Staff ask how a process works and get an answer that quotes the policy or manual it came from.',
      },
      {
        title: 'Onboarding new staff',
        text: 'New team members find answers in existing documents instead of searching through folders.',
      },
    ],
    stack: ['React', 'Vite', 'Material UI', 'Django REST Framework'],
    // The repository is private, so there is no public source link.
  },
];

export const productBySlug = (slug) => products.find((p) => p.slug === slug);
export const categoryLabel = (id) => categories.find((c) => c.id === id)?.label ?? id;
/** True for a product whose main features are not built yet (see `status` above). */
export const inDevelopment = (product) => product?.status === 'in-development';
