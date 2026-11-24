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
 *  status        Optional; see STATUSES below. Its label shows on the card and the product page.
 *                'pilot': built and demonstrable, but not yet a general release (offers a demo).
 *                'in-development': main features not built yet (offers "Ask about it" instead).
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
  { id: 'knowledge', label: 'Knowledge Management' },
  { id: 'transport', label: 'Transport' },
  { id: 'ai-agents', label: 'AI Agents' },
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

  // Source: the private Kitchen OS repository (README and code). It started as a copy of
  // KitchenMind AI and adds Kitchen OS phases 1–4. The app labels its estimates as estimates and
  // its production planner as a simulation; keep that wording here.
  {
    slug: 'kitchen-os',
    name: 'TRANST Kitchen OS',
    category: 'operations',
    featured: false,
    summary:
      'Commercial kitchen operations: a dashboard, costs and a draft purchase list, delivery-order scheduling for virtual brands, nutrition checks and production planning.',
    description:
      'TRANST Kitchen OS builds on KitchenMind AI to cover more of a commercial kitchen’s day: what to prep, what to buy, which delivery orders are at risk, which dishes match a personal food profile, and how to plan layered portions. Every figure comes from the kitchen’s own data, and every estimate is labelled as one.',
    capabilities: [
      {
        title: 'Operations dashboard',
        text: 'Portions sold, stock alerts, estimated waste cost and the day’s prep priorities on one screen. A day without imported sales shows “No data”, never zero.',
      },
      {
        title: 'Costs and purchasing',
        text: 'Optional costs per ingredient feed waste-cost estimates and a draft purchase list for a delivery date, worked out from prep needs, usable stock and minimum levels. Nothing is ordered automatically.',
      },
      {
        title: 'Delivery orders',
        text: 'Orders for several virtual brands share the kitchen’s equipment. A rule-based schedule estimates when each step runs and flags orders at risk of missing pickup, with the reason.',
      },
      {
        title: 'Nutrition suggestions',
        text: 'Each member can keep a private food profile and see which dishes conflict with it, can’t be fully checked, or have no conflicts, using the 14 major allergens. Informational only, never medical advice.',
      },
      {
        title: 'Production planning',
        text: 'Plan layered, customised portions from production recipes, with grams per layer, totals, timings and an illustrative preview. A software simulation: no equipment is connected.',
      },
      {
        title: 'Everything in KitchenMind AI',
        text: 'Stock batches with expiry dates, recipes, CSV or typed-in sales, waste logging, sales forecasts, prep plans and team roles.',
      },
    ],
    benefits: [
      'Prep, purchasing, orders and waste in one place, from the kitchen’s own data',
      'Rules shown on screen, and every estimate labelled as one',
      'Delivery orders at risk of missing pickup flagged, with the reason',
      'Food profiles that only their owner can see, and can delete',
    ],
    architecture: [
      {
        id: 'kitchen-data',
        label: 'Stock, sales and costs',
        layer: 'input',
        text: 'Deliveries with expiry dates, stock counts, ingredient costs, and sales from a CSV file or typed in.',
      },
      {
        id: 'orders',
        label: 'Delivery orders',
        layer: 'input',
        text: 'Typed in per virtual brand, with pickup times. No delivery app is connected.',
      },
      {
        id: 'menu',
        label: 'Menu details',
        layer: 'input',
        text: 'Recipes, prep steps per piece of equipment, and allergens, diet and nutrition values per ingredient.',
      },
      {
        id: 'planning',
        label: 'Stock and planning',
        layer: 'core',
        text: 'Batches used earliest-expiry first, forecasts from past sales, prep plans and the purchase list.',
      },
      {
        id: 'scheduler',
        label: 'Order scheduler',
        layer: 'core',
        text: 'Works out a rule-based schedule across shared equipment on every request, and explains each risk.',
      },
      {
        id: 'rules',
        label: 'Nutrition and production rules',
        layer: 'core',
        text: 'Checks dishes against a private food profile and works out layered portion plans, using recorded data only.',
      },
      {
        id: 'dashboard',
        label: 'Dashboard and purchase list',
        layer: 'output',
        text: 'The day’s figures, stock alerts, prep priorities, and a purchase list to copy or print for the supplier.',
      },
      {
        id: 'queue',
        label: 'Order queue and schedule',
        layer: 'output',
        text: 'Open orders by status, most at risk first, and the schedule by equipment or by order.',
      },
      {
        id: 'jobs',
        label: 'Suggestions and production jobs',
        layer: 'output',
        text: 'Dishes checked against a profile, and production jobs from planned to completed.',
      },
    ],
    useCases: [
      {
        title: 'Cloud kitchen with several brands',
        text: 'Take orders for each brand, see which ones are waiting for the same oven, and move a step forward with “Do next” when an order is at risk.',
      },
      {
        title: 'Restaurant planning tomorrow',
        text: 'Check prep priorities and stock alerts on the dashboard, then copy the draft purchase list for the supplier.',
      },
    ],
    stack: ['React', 'Vite', 'Framer Motion', 'Django REST Framework', 'PostgreSQL', 'Docker'],
    // The repository is private, so there is no public source link.
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

  // Source: the private CoreKnowledge repository, branch phases-2-5 (README, architecture docs, code).
  // Built (phases 1–5) and running as a private pilot. No AI model is connected yet: a built-in
  // provider quotes the documents, and the app itself says so. When a model is connected, update
  // the "Answers with citations" capability and the "Answer service" node.
  {
    slug: 'coreknowledge',
    name: 'CoreKnowledge',
    category: 'knowledge',
    featured: false,
    summary:
      'Search your organization’s own documents and get answers that cite their sources, in a private, invitation-only workspace.',
    description:
      'CoreKnowledge turns an organization’s documents into a knowledge base its team can search and question. Upload PDF, Word, text and Markdown files, search them, and ask questions answered from those documents, with every answer citing its sources.',
    capabilities: [
      {
        title: 'Document library',
        text: 'Upload PDF, Word, text and Markdown files up to 20 MB. Each file is checked, stored privately and processed in the background with its status shown, and can be retried, replaced or deleted.',
      },
      {
        title: 'Hybrid search',
        text: 'Keyword search and vector search (PostgreSQL full text and pgvector) in one query, returning ranked passages with the document and page they come from.',
      },
      {
        title: 'Answers with citations',
        text: 'Ask a question and get an answer built only from your documents, with every source cited, or a plain “not enough information”. Until an AI model is connected, answers quote the documents directly and nothing leaves the system.',
      },
      {
        title: 'Organizations and roles',
        text: 'Invitation-only accounts, an organization switcher, and Owner, Admin, Editor and Viewer roles.',
      },
      {
        title: 'Audit log',
        text: 'Sign-ins, membership changes and role changes are recorded in an audit log.',
      },
      {
        title: 'Built-in safeguards',
        text: 'Each organization’s documents are kept separate, uploaded text is treated as untrusted, and every citation in an answer is checked before it is shown.',
      },
    ],
    benefits: [
      'Answers you can check: every one cites its sources',
      'A plain “not enough information” instead of a guess',
      'Each organization’s documents private and separate from every other',
      'Questions are not stored; only a usage count is kept',
    ],
    architecture: [
      {
        id: 'docs',
        label: 'Documents',
        layer: 'input',
        text: 'PDF, Word, text and Markdown uploads, checked and stored privately in a directory or an S3-compatible bucket.',
      },
      {
        id: 'questions',
        label: 'Searches and questions',
        layer: 'input',
        text: 'Typed into the React web app by members of the organization.',
      },
      {
        id: 'pipeline',
        label: 'Processing workers',
        layer: 'core',
        text: 'Celery workers with Redis extract the text, split it into passages and index them in PostgreSQL with pgvector.',
      },
      {
        id: 'search',
        label: 'Hybrid search',
        layer: 'core',
        text: 'Full-text and vector results fused into one ranking, always limited to the organization’s own ready documents.',
      },
      {
        id: 'answers',
        label: 'Answer service',
        layer: 'core',
        text: 'Answers only from the retrieved passages and checks every citation. An AI model can be connected through its provider interface; until then a built-in provider quotes the passages.',
      },
      {
        id: 'results',
        label: 'Ranked passages',
        layer: 'output',
        text: 'Search results that show the document and page each passage comes from.',
      },
      {
        id: 'cited',
        label: 'Cited answers',
        layer: 'output',
        text: 'Answers with their sources, or “not enough information” when the documents do not say.',
      },
    ],
    useCases: [
      {
        title: 'Policies and manuals',
        text: 'Staff ask how leave, travel or a process works and get an answer that cites the policy it came from.',
      },
      {
        title: 'Onboarding new staff',
        text: 'New team members search existing guides instead of asking around, and see where each answer comes from.',
      },
    ],
    stack: ['React', 'Vite', 'Material UI', 'Django REST Framework', 'Celery', 'PostgreSQL + pgvector', 'Redis'],
    // The repository is private, so there is no public source link.
  },

  // Source: the private GoFree repository (README and code, main branch). GoFree never shows a
  // position it doesn't have: a bus is LIVE only when a passenger or an operator's GPS device shares
  // it, otherwise it is a scheduled estimate. Fares are estimates, timetables come from public
  // sources, and alerts work while the app is open. Keep that wording here.
  {
    slug: 'gofree',
    name: 'GoFree',
    category: 'transport',
    featured: false,
    summary:
      'Kerala bus timings for KSRTC and private buses: journeys between any two places, estimated fares, route maps, and live positions shared by passengers.',
    description:
      'GoFree by TRANST finds KSRTC and private bus services between any two places in Kerala, from big bus stands to village landmarks, with times, an estimated fare, every stop and a road map. A bus is shown as live only when someone on it, or its operator’s GPS, shares its position.',
    capabilities: [
      {
        title: 'Journey search',
        text: 'From any place to any other, with an optional via: bus stands, towns, villages and landmarks, in English or Malayalam. Direct buses and journeys with one change. Search runs on the phone and works offline.',
      },
      {
        title: 'Bus details and fares',
        text: 'Operator, bus type, departure and arrival times, every stop and a road-following route map, with a fare estimated from KSRTC’s published per-km rates.',
      },
      {
        title: 'Live map',
        text: 'Buses around you and buses coming to your stop. Each is marked LIVE when a passenger or the operator’s GPS shares its position, or as a scheduled estimate from the timetable.',
      },
      {
        title: 'I’m on this bus',
        text: 'Your phone’s GPS follows the bus along its route: next stop, distance and time to your stop, how late it is running, and an alarm before you get down.',
      },
      {
        title: 'Alerts and reports',
        text: 'A heads-up about five minutes before a bus reaches your stop while the app is open, and passenger reports on crowding and delays, shown as reports rather than facts.',
      },
      {
        title: 'Installable app',
        text: 'Installs from the browser on phones and laptops, keeps working offline once loaded, with dark mode, an English or Malayalam interface, and optional Google sign-in to sync saved routes.',
      },
    ],
    benefits: [
      'KSRTC and private buses in one search',
      'Never calls a position live unless real GPS is being shared',
      'Route search keeps working without a connection once the app is loaded',
      'Everything works without an account; signing in only syncs your settings',
    ],
    architecture: [
      {
        id: 'timetables',
        label: 'Timetables and places',
        layer: 'input',
        text: 'KSRTC and private bus timetables from public sources, and OpenStreetMap places and landmarks across Kerala.',
      },
      {
        id: 'gps',
        label: 'Rider and operator GPS',
        layer: 'input',
        text: 'Passengers on a bus who choose to share their location, and GPS devices registered by bus operators.',
      },
      {
        id: 'reports',
        label: 'Passenger reports',
        layer: 'input',
        text: 'Crowding, delays, sightings and timetable corrections reported by riders.',
      },
      {
        id: 'search',
        label: 'On-phone search',
        layer: 'core',
        text: 'Finds direct and one-change journeys in a background worker on the phone, so search works offline.',
      },
      {
        id: 'tracking',
        label: 'Live tracking service',
        layer: 'core',
        text: 'Checks every GPS fix, matches it to the bus’s road route, combines riders on the same bus, and works out which buses are coming to your stop.',
      },
      {
        id: 'fares',
        label: 'Fare estimate',
        layer: 'core',
        text: 'KSRTC’s published per-km rates by service class, applied to the road distance between your stops.',
      },
      {
        id: 'journeys',
        label: 'Journeys and fares',
        layer: 'output',
        text: 'Buses with times, every stop, a route map and an estimated fare.',
      },
      {
        id: 'map',
        label: 'Live map and alerts',
        layer: 'output',
        text: 'Buses around you, each labelled live or scheduled estimate, and alerts before a bus reaches your stop.',
      },
      {
        id: 'pages',
        label: 'Timetable pages',
        layer: 'output',
        text: 'Public bus-timing pages between towns that search engines can read.',
      },
    ],
    useCases: [
      {
        title: 'Daily commute',
        text: 'Save your Home and Work stops, see the next buses on your commute, and get a heads-up before your bus reaches the stop.',
      },
      {
        title: 'A trip to a new town',
        text: 'Find a direct bus or one with a change, check the stops and the estimated fare, and get an alarm before your stop while riding.',
      },
    ],
    stack: ['React', 'TypeScript', 'Vite', 'MapLibre GL', 'Leaflet', 'Django REST Framework'],
    // The repository is private, so there is no public source link.
  },

  // Source: the private Invoice Intake repository (README and code, main branch). A pilot build:
  // verified locally, not deployed, not production-ready, not yet approved for real customer
  // documents. Demo extraction is rule-based (not AI); the Anthropic AI mode has never been called
  // live and is enabled only after a supervised test and the customer's written approval.
  {
    slug: 'invoice-intake',
    name: 'TRANST Invoice Intake',
    category: 'operations',
    featured: false,
    status: 'pilot',
    statusNote:
      'A pilot build for one customer, verified on a local installation and not yet deployed. It runs in demo mode with fictional sample invoices until the customer’s pilot decisions are recorded, and it is not yet approved for real customer documents.',
    summary:
      'Invoice data entry with a person in control: upload supplier invoices, check the extracted fields against the document, approve or reject, and export to CSV.',
    description:
      'TRANST Invoice Intake reads supplier invoices into nine fields, shows them beside the document for a person to check, and lets only approved invoices out as CSV. It never fills in a value that is not printed on the invoice.',
    capabilities: [
      {
        title: 'Field extraction',
        text: 'Supplier, invoice number, dates, currency, subtotal, tax, total and PO number from PDF, PNG or JPG invoices. In the demo a rule-based reader handles simple text PDFs; it is not AI.',
      },
      {
        title: 'Side-by-side review',
        text: 'The document and its fields sit side by side. Missing or uncertain values are flagged and block approval until a person confirms, corrects or leaves them blank. Ambiguous dates are never guessed.',
      },
      {
        title: 'Approve, reject, export',
        text: 'Finance approvers approve or reject each invoice, with warnings when totals don’t add up or a duplicate is suspected, and export the approved invoices as CSV.',
      },
      {
        title: 'Roles and two-step sign-in',
        text: 'Every user signs in with a password and an authenticator-app code. Three roles are enforced by the server, and nobody can both process and approve invoices.',
      },
      {
        title: 'Full audit trail',
        text: 'Every upload, edit, check, status change, export and deletion is recorded with who did it and in which role.',
      },
      {
        title: 'Pilot report',
        text: 'Volume, corrections, exception rate, approval status and elapsed times, each labelled as recorded, derived or an estimate.',
      },
    ],
    benefits: [
      'A person checks every invoice before it is approved',
      'Never fills in a value that is not on the document',
      'The processor and the approver are always different people',
      'Shows exactly where each document was processed',
    ],
    architecture: [
      {
        id: 'invoices',
        label: 'Supplier invoices',
        layer: 'input',
        text: 'PDF, PNG or JPG files uploaded by an invoice processor.',
      },
      {
        id: 'users',
        label: 'Named users',
        layer: 'input',
        text: 'Accounts created by the operator, signing in with a password and an authenticator code.',
      },
      {
        id: 'extraction',
        label: 'Extraction',
        layer: 'core',
        text: 'A rule-based demo reader by default, which keeps every document on the server. An AI mode sends the file to Anthropic’s API, and is switched on only after a supervised test and the customer’s written approval.',
      },
      {
        id: 'rules',
        label: 'Review rules',
        layer: 'core',
        text: 'Server-side checks on required fields, uncertain values, totals, dates and duplicates, plus a role check on every request.',
      },
      {
        id: 'csv',
        label: 'Approved CSV',
        layer: 'output',
        text: 'Approved invoices exported for the finance process, with formula-like text neutralised.',
      },
      {
        id: 'audit',
        label: 'Audit log and pilot report',
        layer: 'output',
        text: 'Who did what and in which role, and pilot figures with their definitions.',
      },
    ],
    useCases: [
      {
        title: 'Accounts payable team',
        text: 'Processors upload and check supplier invoices; a finance approver approves them and exports the CSV for the finance process.',
      },
      {
        title: 'A measured pilot',
        text: 'Run a controlled pilot with named users and see volume, corrections and exception rates before deciding on wider use.',
      },
    ],
    stack: ['React', 'Vite', 'Django REST Framework', 'django-otp', 'SQLite'],
    // The repository is private, so there is no public source link.
  },

  // Source: the private Agent Control Tower repository (README, docs/PRODUCT.md and code, main
  // branch). An MVP, not deployed. Its tool connectors are SIMULATED with sample data: no real
  // email is sent and no money moves. Keep saying so here until real connectors exist.
  {
    slug: 'agent-control-tower',
    name: 'TRANST Agent Control Tower',
    category: 'ai-agents',
    featured: false,
    summary:
      'Mission control for AI agents: give each agent only the tools it needs, approve risky actions before they happen, pause or kill any agent, and audit every step.',
    description:
      'Agent Control Tower is one place to see and control a company’s AI agents: what each may do, what it did, what it is waiting for and who approved it. Its tool connectors are simulated with sample data for now, so no real email is sent and no money moves.',
    capabilities: [
      {
        title: 'Agents and permissions',
        text: 'Register an agent with a purpose, the tools it may use and a daily spending limit; every other tool is blocked. Edits never rewrite a run that is already in progress.',
      },
      {
        title: 'Live runs',
        text: 'Give an agent a task and watch every model turn and tool call on a live timeline. Agents run on Claude, or for free demos on Groq, Google Gemini’s free tier or a built-in demo brain.',
      },
      {
        title: 'Policy rules',
        text: 'Each tool call is allowed, held for approval or blocked, by rules for all agents or for one. High-risk calls, such as sending email or changing a large invoice, always need a person.',
      },
      {
        title: 'Approval queue',
        text: 'Approve or reject a held action with a note. The agent waits until a person decides, then carries on, or is told why not.',
      },
      {
        title: 'Kill switch',
        text: 'Pause an agent (reversible) or kill it (permanent). Its status is checked before every model call and every tool call.',
      },
      {
        title: 'Audit and insights',
        text: 'An append-only audit log of who did what, when and why, exportable to CSV, plus 7-, 14- or 30-day insights on runs, approvals and spend.',
      },
    ],
    benefits: [
      'A person approves every high-risk action before it happens',
      'Each agent sees only the tools it was given',
      'Any agent can be stopped at once',
      'Every change is recorded, with who approved it and why',
    ],
    architecture: [
      {
        id: 'tasks',
        label: 'Tasks',
        layer: 'input',
        text: 'Work given to an agent by an admin, such as checking an invoice or researching a supplier.',
      },
      {
        id: 'people',
        label: 'Admins and viewers',
        layer: 'input',
        text: 'People who sign in as an admin or a read-only viewer.',
      },
      {
        id: 'runner',
        label: 'Agent runner',
        layer: 'core',
        text: 'Sends the task to the agent’s brain (Claude, a free-tier model or the demo brain) and carries out the tool calls it chooses, one step at a time.',
      },
      {
        id: 'policy',
        label: 'Policy engine',
        layer: 'core',
        text: 'Checks every tool call against the agent’s permissions and the rules: allow it, hold it for approval or block it.',
      },
      {
        id: 'connectors',
        label: 'Tool connectors',
        layer: 'output',
        text: 'Email, CRM, invoices and supplier research. Simulated with sample data for now: no real email is sent and no money moves.',
      },
      {
        id: 'audit',
        label: 'Approvals and audit log',
        layer: 'output',
        text: 'The approval queue, and an append-only record of every change, with insights over time.',
      },
    ],
    useCases: [
      {
        title: 'Trying agents safely',
        text: 'Let an invoice or support agent work on sample data while every risky step waits for a person, before connecting real systems.',
      },
      {
        title: 'Oversight for AI agents',
        text: 'See what each agent did today, what it is waiting for and how much it has spent against its daily limit, and stop it if needed.',
      },
    ],
    stack: ['React', 'Vite', 'Tailwind CSS', 'Django REST Framework', 'PostgreSQL', 'Claude API'],
    // The repository is private, so there is no public source link.
  },
];

export const productBySlug = (slug) => products.find((p) => p.slug === slug);
export const categoryLabel = (id) => categories.find((c) => c.id === id)?.label ?? id;
/** Product statuses: the label shown on the card and page, and whether a demo can be requested. */
export const STATUSES = {
  pilot: { label: 'Pilot', demo: true },
  'in-development': { label: 'In development', demo: false },
};
export const statusOf = (product) => STATUSES[product?.status] ?? null;
/** False only for products whose status rules out a demo (in development). */
export const offersDemo = (product) => statusOf(product)?.demo ?? true;
