export type HeroContent = {
  eyebrow: string;
  title: string;
  subtitle: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
  featureCards: { title: string; subtitle: string; body: string }[];
};

export type LogosContent = {
  title: string;
  subtitle: string;
  logos: string[];
};

export type FeaturesContent = {
  title: string;
  intro: string;
  items: { title: string; body: string }[];
};

export type MetricsContent = {
  title: string;
  blurb: string;
  stats: { label: string; value: string }[];
  snapshot: string[];
};

export type PricingContent = {
  title: string;
  blurb: string;
  ctas: { sales: { label: string; href: string }; terms: { label: string; href: string } };
  plans: { name: string; price: string; desc: string; features: string[]; cta: { label: string; href: string } }[];
};

export type SecurityContent = {
  title: string;
  blurb: string;
  checklist: string[];
  badges: string[];
  cta: { label: string; href: string };
};

export type DocsSupportContent = {
  title: string;
  blurb: string;
  links: { label: string; link: string }[];
  supportBullets: string[];
  supportBadge: string;
  supportCta: { label: string; href: string };
};

export type LegalContent = {
  title: string;
  blurb: string;
  docs: { label: string; link: string; tag?: string }[];
  corporate: string[];
  note: string;
};

export type CtaContent = {
  title: string;
  blurb: string;
  productLinks: { label: string; href: string }[];
  resourceLinks: { label: string; href: string }[];
  footer: string;
};

export type HomeContent = {
  hero: HeroContent;
  logos: LogosContent;
  features: FeaturesContent;
  metrics: MetricsContent;
  pricing: PricingContent;
  security: SecurityContent;
  docs: DocsSupportContent;
  legal: LegalContent;
  cta: CtaContent;
};

export const defaultHomeContent: HomeContent = {
  hero: {
    eyebrow: "Simple Panda Stack",
    title: "Build and launch faster with a calm, opinionated starting point.",
    subtitle:
      "The Panda starter pairs clean defaults with sensible layout decisions so you can focus on product, not plumbing. Fully responsive, accessible, and easy to extend.",
    primaryCta: { label: "Explore features", href: "#features" },
    secondaryCta: { label: "See how it works", href: "#cta" },
    featureCards: [
      { title: "Launch", subtitle: "Zero-fuss deploys", body: "Prewired for Vercel with environment helpers and sane defaults." },
      { title: "Design", subtitle: "Responsive by default", body: "Layout stretches the full viewport while keeping breathable spacing." },
      { title: "Code", subtitle: "Type-safe stack", body: "Next.js App Router, TypeScript, ESLint, and formatting baked in." },
      { title: "Speed", subtitle: "Ready in minutes", body: "Opinionated setup trims decisions so you can ship faster." },
    ],
  },
  logos: {
    title: "Trusted teams",
    subtitle: "Built for teams who ship quickly and sleep well",
    logos: ["Stripe", "Monday.com", "Linear", "Segment", "Notion", "OpenAI", "Loom", "Figma", "Intercom", "Salesforce"],
  },
  features: {
    title: "Enterprise-ready from day one",
    intro: "Opinionated defaults plus the guardrails you need for SOC2, GDPR, and scale.",
    items: [
      { title: "Security & Compliance", body: "Role-based access, audit logging hooks, env management, and policy-first routing ready for SOC2 review." },
      { title: "Data & Observability", body: "Telemetry-friendly logging, tracing placeholders, and ship-ready health endpoints for SRE handoff." },
      { title: "Multi-tenant Friendly", body: "Patterns for org/user separation, billing ids, and per-tenant feature flags without rewriting core logic." },
      { title: "Docs & Runbooks", body: "Starter guides, API reference scaffolding, and incident playbooks so support stays unblocked." },
      { title: "Performance", body: "Edge-ready routing, image optimization, and caching hints that match production-grade SLAs." },
      { title: "Team Workflow", body: "Prettier, ESLint, CI templates, and PR check recipes so contributors stay consistent." },
    ],
  },
  metrics: {
    title: "Confident handoffs to security, finance, and ops",
    blurb: "We bundle the checklists real teams ask for: logging, billing hooks, runbooks, and DPA-friendly templates.",
    stats: [
      { label: "Minutes to deploy", value: "6" },
      { label: "Coverage on lint/tests", value: "98%" },
      { label: "Starter playbooks", value: "12" },
      { label: "Prebuilt policies", value: "9" },
    ],
    snapshot: [
      "Next.js App Router with API routes for secure server actions",
      "Drizzle ORM templates with migrations and seed script ready",
      "Auth patterns ready for Bring-Your-Own provider (JWT/OAuth/SAML placeholder)",
      "Observability hooks: request logging, structured events, and error boundary demos",
      "Billing-ready: plan model, usage counters, and webhooks slot for Stripe",
    ],
  },
  pricing: {
    title: "Predictable plans that scale with you",
    blurb: "Start free, upgrade when you need enterprise controls. Usage counters and Stripe webhook stubs included.",
    ctas: {
      sales: { label: "Talk to sales", href: "mailto:sales@example.com" },
      terms: { label: "Review terms", href: "#legal" },
    },
    plans: [
      {
        name: "Starter",
        price: "$0",
        desc: "Perfect for prototypes and internal tools.",
        features: ["Up to 3 teammates", "Email support", "Basic auth and RBAC"],
        cta: { label: "Launch now", href: "https://vercel.com/new" },
      },
      {
        name: "Growth",
        price: "$49",
        desc: "For product teams shipping to customers.",
        features: ["Unlimited teammates", "Webhook-ready billing", "Audit log events"],
        cta: { label: "Start trial", href: "https://vercel.com/new" },
      },
      {
        name: "Enterprise",
        price: "Custom",
        desc: "Security reviews, SSO, and DPAs included.",
        features: ["SAML/SCIM-ready", "Priority support", "Dedicated sandbox"],
        cta: { label: "Book a demo", href: "https://vercel.com/new" },
      },
    ],
  },
  security: {
    title: "Trust-first by default",
    blurb: "Security review ready: least-privilege patterns, secrets hygiene, and data residency notes included.",
    checklist: [
      "Security checklist mapped to SOC2-Type II control families",
      "Incident response playbook with RACI owners and timelines",
      "Data Processing Addendum (DPA) starter template",
      "Vendor security questionnaire boilerplate to speed up reviews",
    ],
    badges: ["SOC2", "GDPR", "HIPAA", "ISO 27001", "PCI Ready", "CCPA"],
    cta: { label: "Request security pack", href: "mailto:security@example.com" },
  },
  docs: {
    title: "Everything documented, with humans in the loop",
    blurb: "Developer-friendly guides plus enterprise-grade support channels. Handoffs stay unblocked.",
    links: [
      { label: "API reference", link: "https://nextjs.org/docs" },
      { label: "Runbooks", link: "https://vercel.com/changelog" },
      { label: "Status page", link: "https://status.example.com" },
      { label: "Implementation guide", link: "https://vercel.com/templates" },
    ],
    supportBullets: [
      "Slack connect with 2-hour response on high severity",
      "Shared runbook for incident comms and on-call rotations",
      "Quarterly architecture reviews with our solutions engineers",
      "Dedicated sandbox and feature flag rollout plan",
    ],
    supportBadge: "24/7 optional",
    supportCta: { label: "Contact support", href: "mailto:support@example.com" },
  },
  legal: {
    title: "Transparent terms, ready for procurement",
    blurb: "We ship with the paperwork your legal and procurement teams expect.",
    docs: [
      { label: "Master Service Agreement", link: "https://example.com/msa", tag: "PDF" },
      { label: "Data Processing Addendum", link: "https://example.com/dpa", tag: "PDF" },
      { label: "Privacy Policy", link: "https://example.com/privacy", tag: "PDF" },
      { label: "Acceptable Use", link: "https://example.com/aup", tag: "PDF" },
    ],
    corporate: [
      "HQ: San Francisco, CA • Remote first",
      "EIN & W-9 ready upon request",
      "Vendor onboarding packet with security summary",
      "Production support SLAs available for enterprise plans",
      "Accessibility statement aligned to WCAG 2.1 AA",
    ],
    note: "Need a custom clause? Email legal@example.com and we will review within 2 business days.",
  },
  cta: {
    title: "Stay lightweight. Launch confidently.",
    blurb: "A calm base with generous spacing, clear typography, and production-friendly defaults so you can focus on your product.",
    productLinks: [
      { label: "Docs", href: "https://nextjs.org/docs" },
      { label: "Features", href: "#features" },
      { label: "Templates", href: "https://vercel.com/templates" },
    ],
    resourceLinks: [
      { label: "Changelog", href: "https://vercel.com/changelog" },
      { label: "GitHub", href: "https://github.com/" },
      { label: "Support", href: "mailto:hello@example.com" },
    ],
    footer: "Built with the Panda starter • MIT licensed • Ready for your next launch",
  },
};

// Helper for future overrides (e.g., reading JSON from env or file)
export function getHomeContent(): HomeContent {
  return defaultHomeContent;
}
