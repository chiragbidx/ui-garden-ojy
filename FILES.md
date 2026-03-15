# FILES.md — Structural & Architectural Index (Next.js App Router Starter)

AI-facing index of the repository as it exists today. Drizzle ORM (PostgreSQL) is wired with a working credentials auth flow at `/auth` (server actions + users table). If something is unclear: **STOP AND ASK**.

---

## 1. High-Level Overview
- Purpose: SaaS boilerplate with App Router, Drizzle + Postgres schema, multi-tenant teams, and modular section-based landing architecture.
- Style: file-system routing, server-preferred components, small isolated client islands.
- Tech: Next.js 16, React 19, TypeScript 5, Tailwind-ready PostCSS, ESLint 9, Zod for validation, SendGrid for email.
- Present: Drizzle schema + migrations for `users`, `teams`, `team_members`, `team_invitations`; `/auth` route with sign-in/sign-up server actions; shared dashboard layout with overview, settings (profile/email/password), and team management; invitation acceptance flow; reusable UI primitives; centralized theme system.
- Not present: middleware guards, API routes, queues, tests.

## 2. Application Entry Points
- `app/layout.tsx`: Root layout; mounts `ThemeProvider`, global CSS, and `ErrorReporter`.
- `app/page.tsx`: Public landing page (server component) that composes `Layout*Section` components.
- `app/auth/page.tsx`: Split auth UI (left visual panel + right single auth card with sign-in/sign-up toggle).
- `app/auth/actions.ts`: Server actions that read/write users in Postgres through Drizzle; auto-creates team on signup.
- `app/dashboard/layout.tsx`: Shared dashboard layout (sidebar, header, auth guard) for all `/dashboard/*` routes.
- `app/dashboard/page.tsx`: Dashboard overview with demo metrics, getting started checklist, charts, activity feed, and a mock Dialog CRUD example.
- `app/dashboard/actions.tsx`: Shared dashboard server actions (currently sign-out).
- `app/dashboard/settings/page.tsx`: Account settings route (profile name, email, password).
- `app/dashboard/settings/actions.tsx`: Settings server actions (`updateProfileAction`, `updateEmailAction`, `updatePasswordAction`, `deleteAccountAction`).
- `app/dashboard/team/page.tsx`: Team management route (members list, invitations, role management).
- `app/dashboard/team/actions.tsx`: Team server actions (invite, revoke, remove, role update, team name).
- `app/invite/[token]/page.tsx`: Invitation acceptance page (validates token, adds user to team).
- `app/invite/[token]/actions.ts`: Server action for accepting invitations.
- `app/globals.css`: Global styles; imports Tailwind and design tokens.
- `app/shadcn.css`: shadcn/radix utility classes + keyframes.
- `next.config.ts`: Next config.
- `postcss.config.mjs`: PostCSS with `@tailwindcss/postcss`.
- No `middleware.ts`; requests go straight to App Router.

## 3. Modules / Feature Areas
- `app/`: UI shell and routing.
- `components/`: Shared UI and landing sections.
  - `components/dashboard/`: dashboard-specific client components (`sidebar-nav.tsx`, `dashboard-content.tsx`, `user-menu.tsx`, `mobile-nav.tsx`, `delete-account-dialog.tsx`, `invite-logger.tsx`).
  - `components/home/`: active modular sections (`Layout*Section.tsx`).
  - `components/layout/`: navbar.
  - `components/theme/`: shared `theme-provider` and `theme-toggle`.
  - `components/illustrations/`: reusable SVG illustration components.
  - `components/icons/`: reusable social/media icon components.
  - `components/ui/`: shadcn/Radix primitives used across auth, dashboard, and landing sections.
  - client-only helpers: `HeroOrbs.tsx`, `AgentActionPanel.tsx` (stub, unused by default), `ErrorReporter.tsx`.
- `content/`: typed landing content source (`home.ts`) for data-driven copy/config.
- `public/`: static assets (hero/team/images/icons).
- `lib/auth/`: Auth session helpers (`session.ts` — cookie-based, stores `{ userId, email }`).
- `lib/db/`: Drizzle schema and DB client.
- `lib/email/`: SendGrid email utility (`sendgrid.ts`).
- `drizzle/`: SQL migrations + meta journal.
- Config/tooling: `eslint.config.mjs`, `postcss.config.mjs`, `next.config.ts`, `tsconfig.json`, `drizzle.config.ts`, `components.json`, `railpack.json`, `railway.json`.
- No route groups yet; create when needed.

## 4. Routes (Controllers)
- `/` → `app/page.tsx`
  - Purpose: section-based landing page composed from `components/home/Layout*Section.tsx` modules.
  - Section IDs currently include: `layout-hero`, `layout-sponsors`, `layout-benefits`, `layout-features`, `layout-services`, `layout-testimonials`, `layout-team`, `layout-pricing`, `layout-contact`, `layout-faq`, `layout-footer`.
  - Visibility controls: `ONLY_SECTIONS` (whitelist) and `HIDE_SECTIONS` (blacklist).
  - Layout: responsive, centered content up to ~1600px; client interactivity kept in small islands.
  - To add a custom section: create `components/home/<NewLayoutSection>.tsx` and register it in the `sections` array in `app/page.tsx` with a stable ID.
  - DTOs/validation/guards: none; render-focused route.
- `/auth` → `app/auth/page.tsx`
  - Purpose: credentials entry (one visible form at a time, toggled sign-in/sign-up).
  - Backend wiring: form `action` targets server actions in `app/auth/actions.ts`.
  - Data contract:
    - Sign up inserts into `users` with `password_hash` from bcrypt, auto-creates a personal team, and adds user as owner.
    - Sign in verifies `email` + bcrypt password compare.
  - Mode deep links: `/auth#signin`, `/auth#signup`.
- `/dashboard` → `app/dashboard/layout.tsx` + `app/dashboard/page.tsx`
  - Layout: shared sidebar (Overview, Team, Settings) + header with sign-out. Auth guard reads session from `lib/auth/session.ts` and redirects unauthenticated users to `/auth#signin`.
  - Purpose: dashboard overview with demo metric cards, getting started checklist, charts, recent activity feed, and a mock Dialog-based CRUD example (local state only).
  - Backend wiring: sign-out form uses server action from `app/dashboard/actions.tsx` (`clearAuthSession()` + redirect).
- `/dashboard/settings` → `app/dashboard/settings/page.tsx`
  - Purpose: account settings for profile (first/last name), email, password, and account deletion.
  - Backend wiring: forms target server actions in `app/dashboard/settings/actions.tsx`.
  - Data contract:
    - Update profile writes `firstName`/`lastName` to `users` table.
    - Update email verifies current password, checks uniqueness, updates `users.email`, and refreshes auth session.
    - Update password verifies current password and writes new bcrypt hash to `users.password_hash`.
    - Delete account verifies current password, deletes user row, and clears session.
- `/dashboard/team` → `app/dashboard/team/page.tsx`
  - Purpose: team management — view members, manage roles, invite new members, view/revoke pending invitations.
  - Backend wiring: forms target server actions in `app/dashboard/team/actions.tsx`.
  - Data contract:
    - Invite creates `team_invitations` row with unique token, sends SendGrid email.
    - Revoke sets invitation status to `expired`.
    - Remove deletes `team_members` row (owner/admin only, cannot remove owner).
    - Role update changes `team_members.role` (owner only).
    - Team name updates `teams.name`.
- `/invite/[token]` → `app/invite/[token]/page.tsx`
  - Purpose: invitation acceptance — validates token, checks expiry, adds logged-in user to team.
  - If user is not logged in, redirects to `/auth#signup` with invite token.
  - Backend wiring: `app/invite/[token]/actions.ts` handles acceptance.

## 5. Services & Providers
- `ThemeProvider`: centralized in `components/theme/theme-provider.tsx`, mounted at root layout.
- OpenAI helper: `lib/openai.ts` (server-side helper layer).
- SendGrid email: `lib/email/sendgrid.ts` (server-side, sends transactional email for team invitations).
- Auth session: `lib/auth/session.ts` (cookie-based, stores JSON `{ userId, email }` payload with iframe-compatible attributes: `sameSite: "none"`, `secure: true`, `httpOnly: true`, `path: "/"`).
- No background service layer or worker runtime in-app.

## 6. Data Layer
- ORM/DB: Drizzle ORM + PostgreSQL.
- Schema: `lib/db/schema.ts` — tables: `users`, `teams`, `team_members`, `team_invitations`.
- Client: `lib/db/client.ts`.
- Migrations: `drizzle/*.sql` + `drizzle/meta/_journal.json` (single 0000 migration creates all tables).
- Auth persistence: `users` table is the source of truth for credentials flow.
- Team model: multi-tenant. Each user belongs to a team via `team_members` (roles: `owner`, `admin`, `member`). A personal team is auto-created on signup. Invitations are tracked in `team_invitations` with unique tokens and expiry.
- Rule: keep migrations and journal in sync; `scripts/db-init.js` validates journal integrity before migrate.

## 7. DTOs, Schemas & Validation
- Server actions use Zod for input validation (schemas co-located in the action files).
- UI form primitives exist in `components/ui/form.tsx` and related controls.
- When adding APIs/forms, keep validators with the feature or under `lib/validation/` and document contracts.

## 8. Cross-Cutting Concerns
- Middleware guards, tracing, and centralized logging are not implemented.
- Credentials auth form + DB actions are implemented; cookie-based session (`lib/auth/session.ts`) stores `{ userId, email }`. Dashboard layout enforces auth guard.
- Current custom auth type is stateful cookie session (credentials + DB user lookup + `httpOnly` cookie managed in `lib/auth/session.ts`).
- If custom auth is expanded, standardize on DB-backed session IDs (opaque/signed token) instead of raw identity values in cookie payloads.
- Iframe embedding cookie policy is defined in `README.md` Section 14 and mirrored in `RULES.md` Auth & Security rules.
- Error forwarding exists via `scripts/error-reporter.ts` + `components/ErrorReporter.tsx`.
- Theme switching is cross-cutting and centralized in `components/theme/*`.
- Email delivery via SendGrid is wired for team invitations; gracefully degrades if `SENDGRID_API_KEY` is not set.

## 9. Configuration & Environment
- `env.example` currently defines: `OPENAI_API_KEY`, optional `OPENAI_MODEL`, `DATABASE_URL`, `DATABASE_SSL`, `BASE_URL`, `SENDGRID_API_KEY`, `SENDGRID_FROM_EMAIL`, and optional `NEXTAUTH_SECRET`.
- Secrets: keep in `.env.local` (gitignored); never commit secrets.
- Config files in repo: `next.config.ts`, `postcss.config.mjs`, `eslint.config.mjs`, `tsconfig.json`, `drizzle.config.ts`, `railpack.json`, `railway.json`.
- Runtime/deployment contract: Railpack by Railway for development workflow and Vercel for production.

## 10. Async & Background Processing
- Queues/workers/schedulers: none.
- Operational scripts in `scripts/`:
  - `dev-supervisor.js`: supervised dev runtime (Next + git poll integration).
  - `git-poll.js`: optional origin polling for supervised environments.
  - `db-init.js`: migration bootstrap with Drizzle journal guard.

## 11. Testing Structure
- No tests currently.
- Suggested layout when added: unit (`__tests__/` or co-located), e2e (`e2e/` via Playwright), shared fixtures in `tests/utils/`.

## 12. File & Directory Index
```text
.gitignore                 # Git ignores
.dockerignore              # Docker ignores
README.md                  # Operational guide
FILES.md                   # Structural index (this file)
RULES.md                   # Change boundaries
components.json            # shadcn/ui configuration (radix-nova preset)
app/
  favicon.ico              # Favicon
  auth/
    actions.ts             # Server actions for sign in / sign up (+ team auto-creation)
    page.tsx               # Auth UI route
  dashboard/
    layout.tsx             # Shared dashboard layout (sidebar, header, auth guard)
    actions.tsx            # Shared dashboard actions (sign out)
    page.tsx               # Dashboard overview (metrics, onboarding, charts, activity, mock Dialog CRUD demo)
    settings/
      actions.tsx          # Settings actions (profile/email/password/delete account)
      page.tsx             # Account settings route (profile, email, password, danger zone)
    team/
      actions.tsx          # Team management actions (invite, revoke, remove, roles, name)
      page.tsx             # Team members and invitations route
  invite/
    [token]/
      actions.ts           # Invitation acceptance action
      page.tsx             # Invitation acceptance route
  globals.css              # Global styles + tokens
  layout.tsx               # Root layout (ThemeProvider + ErrorReporter)
  page.tsx                 # Public landing page (composes Layout* sections)
  shadcn.css               # Utility classes/keyframes
content/
  home.ts                  # Typed landing content + defaults
public/
  demo-img.jpg             # Demo image
  hero-image-light.jpeg    # Hero asset
  hero-image-dark.jpeg     # Hero asset
  team1.jpg                # Team asset
  team2.jpg                # Team asset
  team3.jpg                # Team asset
  file.svg                 # Sample asset
  globe.svg                # Sample asset
  next.svg                 # Next.js logo
  vercel.svg               # Vercel logo
  window.svg               # Sample asset
scripts/
  db-init.js               # Validates Drizzle journal + runs migrate
  dev-supervisor.js        # Supervisor for Next dev + git poller
  git-poll.js              # Polls git origin for updates
  error-reporter.ts        # Client-safe error forwarder
types/
  bcryptjs.d.ts            # TypeScript declarations for bcryptjs
components/
  dashboard/
    sidebar-nav.tsx        # Client sidebar nav with active-route detection
    dashboard-content.tsx  # Client dashboard overview (metrics, charts, search, activity, mock Dialog CRUD demo)
    user-menu.tsx          # Client user avatar popover with sign-out
    mobile-nav.tsx         # Client mobile navigation sheet (imports SidebarNav)
    delete-account-dialog.tsx  # Client account deletion dialog with password confirmation
    invite-logger.tsx      # Client helper that logs invite URLs to console
  home/
    LayoutHeroSection.tsx
    LayoutSponsorsSection.tsx
    LayoutBenefitsSection.tsx
    LayoutFeatureGridSection.tsx
    LayoutServicesSection.tsx
    LayoutTestimonialSection.tsx
    LayoutTeamSection.tsx
    LayoutPricingSection.tsx
    LayoutContactSection.tsx
    LayoutFaqSection.tsx
    LayoutFooterSection.tsx
  layout/
    navbar.tsx             # Responsive navbar
  theme/
    theme-provider.tsx     # Shared ThemeProvider wrapper
    theme-toggle.tsx       # Shared theme toggle
  illustrations/
    HeroStackIllustration.tsx
    GlobeBadgeIllustration.tsx
  icons/
    discord-icon.tsx
    github-icon.tsx
    linkedin-icon.tsx
    x-icon.tsx
  ui/
    accordion.tsx
    alert-dialog.tsx
    avatar.tsx
    badge.tsx
    button.tsx
    card.tsx
    carousel.tsx
    command.tsx
    collapsible.tsx
    data-table.tsx
    dialog.tsx
    dropdown-menu.tsx
    form.tsx
    icon.tsx
    input.tsx
    label.tsx
    navigation-menu.tsx
    pagination.tsx
    popover.tsx
    scroll-area.tsx
    select.tsx
    separator.tsx
    sheet.tsx
    skeleton.tsx
    sonner.tsx
    table.tsx
    tabs.tsx
    textarea.tsx
    tooltip.tsx
  HeroOrbs.tsx             # Client parallax helper
  AgentActionPanel.tsx     # Client note stub (not rendered by default)
  ErrorReporter.tsx        # Mounts error reporter on client
lib/
  openai.ts                # OpenAI helper
  utils.ts                 # Shared utility helpers
  auth/
    session.ts             # Cookie-backed auth session helper (userId+email)
  db/
    schema.ts              # Drizzle schema (users, teams, team_members, team_invitations)
    client.ts              # Drizzle + pg pool client
  email/
    sendgrid.ts            # SendGrid email utility
drizzle/
  0000_minor_crusher_hogan.sql  # Initial migration (all tables)
  meta/
    _journal.json          # Migration journal
    0000_snapshot.json     # Schema snapshot
drizzle.config.ts          # Drizzle CLI config
eslint.config.mjs          # ESLint config
next.config.ts             # Next.js config
postcss.config.mjs         # PostCSS config (Tailwind-ready)
tsconfig.json              # TypeScript config
package.json               # Scripts and dependencies
package-lock.json          # Locked deps
old-docker-compose.yml     # Legacy compose artifact (not active deployment path)
old-dockerfile.txt         # Legacy Docker reference (inactive)
railpack.json              # Railpack config
railway.json               # Railway start/build config
.github/
  workflows/
    init-db.yml            # GitHub Actions DB init workflow (manual dispatch, operational)
```

## 13. Safe Modification Guidance
- New public pages: add under `app/` with route folders (for example `app/about/page.tsx`).
- New dashboard features: add under `app/dashboard/<feature>/` with co-located actions. The shared layout (`app/dashboard/layout.tsx`) handles sidebar and auth guard automatically.
- Landing sections: add under `components/home/` and register in `app/page.tsx` using stable section IDs.
- Data/API: place server code in `lib/` or `app/api/.../route.ts`; validate inputs at the edge; keep server-only dependencies out of client components.
- Keep theme logic centralized in `components/theme/*`.
- Avoid expanding global CSS unnecessarily; prefer scoped/component styles.
- Keep changes minimal; update `README.md` and `RULES.md` if scope (auth, DB, billing, deployment architecture) changes.

---

If structure or intent is uncertain, **STOP AND ASK** before modifying.
