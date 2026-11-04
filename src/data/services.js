/**
 * The five TRANST service lines.
 * `diagram` selects the animated illustration in components/services/ServiceDiagram.jsx.
 * Copy describes the kind of work, not results — add verified outcomes only when available.
 */

export const services = [
  {
    id: 'ai-powered-software',
    index: '01',
    title: 'AI-Powered Software',
    short: 'Products with intelligence at the core, not added at the end.',
    summary:
      'Software designed around what models do well — understanding language, recognising patterns, generating drafts — wrapped in interfaces people can trust and correct.',
    points: [
      'Product discovery and AI feasibility mapping',
      'Model selection, prompting and evaluation',
      'Human-in-the-loop review and correction flows',
      'Production deployment and monitoring',
    ],
    diagram: 'stack',
  },
  {
    id: 'intelligent-automation',
    index: '02',
    title: 'Intelligent Automation',
    short: 'Workflows that read, decide and route — and know when to ask.',
    summary:
      'Automation for the work rules alone cannot handle: unstructured documents, judgement calls and exceptions. Each step is visible, auditable and easy to hand back to a person.',
    points: [
      'Process mapping and automation candidates',
      'Document and message understanding',
      'Decision steps with confidence thresholds',
      'Exception queues and audit trails',
    ],
    diagram: 'pipeline',
  },
  {
    id: 'ai-agents',
    index: '03',
    title: 'AI Agents',
    short: 'Goal-driven assistants that plan, use tools and report back.',
    summary:
      'Agents that break a goal into steps, call the tools and data they are permitted to use, check their own work and stop for approval where it matters.',
    points: [
      'Agent scope, permissions and guardrails',
      'Tool and data access design',
      'Plan → act → observe loops with checkpoints',
      'Evaluation harnesses and observability',
    ],
    diagram: 'agent',
  },
  {
    id: 'custom-web-applications',
    index: '04',
    title: 'Custom Web Applications',
    short: 'Fast, accessible web products built around your workflow.',
    summary:
      'Web applications engineered for the way your team actually works — from internal tools to customer-facing platforms — with clean architecture that is ready for intelligence later.',
    points: [
      'UX, interface design and prototyping',
      'Front-end and API engineering',
      'Authentication, roles and data modelling',
      'Performance, accessibility and maintainability',
    ],
    diagram: 'webapp',
  },
  {
    id: 'ai-integration',
    index: '05',
    title: 'AI Integration',
    short: 'Bring AI into the systems you already run.',
    summary:
      'Connecting language models and AI services to existing software, databases and channels — securely, with clear data boundaries and fallbacks when a model is unsure.',
    points: [
      'Integration architecture and data boundaries',
      'Retrieval over your own documents and data',
      'API, CRM and messaging connectors',
      'Cost, latency and quality monitoring',
    ],
    diagram: 'bridge',
  },
];

export const serviceById = (id) => services.find((s) => s.id === id);
