# RULES.md — Change Boundaries & Placement (Boilerplate)

`/auth` credentials flow, `/dashboard` (overview, settings, team), and `/invite/[token]` routes are wired. Cookie-based session stores `{ userId, email }`. No middleware guards yet. These guardrails keep changes predictable. Update this file first if scope expands.

## 1) Routing & Placement
- Public/marketing pages live directly under `app/` (e.g., `app/page.tsx`, `app/about/page.tsx`).
- Current landing sections live in `components/home/Layout*Section.tsx` and are composed in `app/page.tsx`.
- Shared primitives and presentation helpers stay grouped by purpose:
  - `components/ui/*` for shared UI primitives.
  - `components/illustrations/*` and `components/icons/*` for reusable visual assets.
  - `components/layout/*` and `components/theme/*` for shell/theme concerns.
- Keep section visibility controls in `app/page.tsx` via `ONLY_SECTIONS` / `HIDE_SECTIONS`.
- Authenticated pages live under `app/dashboard/` and share `app/dashboard/layout.tsx` (sidebar, header, auth guard).
- Shared dashboard actions belong in `app/dashboard/actions.tsx` (for example `signOutAction`).
- Feature-specific mutations stay co-located: `app/dashboard/settings/actions.tsx`, `app/dashboard/team/actions.tsx`, etc.
- Existing auth flow is in `app/auth/` with co-located server actions (`app/auth/actions.ts`).
- Additional auth flows should stay co-located with their route segment unless explicitly migrating to grouped routes.
- New feature areas should be added under `app/dashboard/<feature>/` with co-located actions.
- Use `app/dashboard/feature/` as the canonical reference scaffold when creating a new dashboard feature.
- The shared dashboard layout (`app/dashboard/layout.tsx`) handles sidebar navigation and auth guard; update `components/dashboard/sidebar-nav.tsx` when adding new nav items.

## 2) Dashboard Page Pattern
- Use existing dashboard pages as the reference for spacing, heading, card wrappers, and form placement.
- For new feature bootstrapping, use `app/dashboard/feature/page.tsx` and `app/dashboard/feature/actions.tsx` as the baseline template, then rename/export action names to match the real feature.
- Keep dashboard pages as Server Components; add `'use client'` only when client hooks are needed.
- Do not import Client Components (or hooks like `useState`, `useEffect`, `useActionState`) into Server Components. If a file needs these, add `"use client"` at the top and keep server-only code out of it.
- Sidebar/nav is centralized in `app/dashboard/layout.tsx` + `components/dashboard/sidebar-nav.tsx`. Do not duplicate sidebar markup in individual pages.
- Dashboard pages only render their content section; the layout handles chrome (sidebar, header, auth).

## 3) Backend & Data
- Drizzle + Postgres are configured. Edit `lib/db/schema.ts`; generate migrations via `npm run db:generate` and apply via `npm run db:migrate`; keep migration SQL committed.
- Current tables: `users`, `teams`, `team_members`, `team_invitations`.
- Drizzle only applies migrations listed in `drizzle/meta/_journal.json`. Whenever you add a `.sql` migration, commit the updated journal as well or the migration will be skipped. The init script/CI will fail if it detects unjournaled migrations.
- Team model: multi-tenant with roles (`owner`, `admin`, `member`). A personal team is auto-created on signup. Team actions enforce role-based access (owner/admin for management, owner for role changes).
- Server actions validate input with Zod; keep schemas co-located in the action file.
- Email delivery uses `@sendgrid/mail` via `lib/email/sendgrid.ts`. Gracefully skips if `SENDGRID_API_KEY` is not set.
- Any route/page that reads DB state or auth session during render must be runtime-rendered (for example `export const dynamic = "force-dynamic"` in App Router pages) to avoid build-time prerender failures.
- Do not require DB migrations before `npm run build` by default. Only run migrate-before-build if a route intentionally depends on build-time static generation with live DB queries.
- Stripe/billing (if introduced) goes in `lib/payments/*`; update server actions and route handlers together.
- Avoid time- or randomness-dependent values inside React render (`new Date()`, `Date.now()`, `Math.random()`). Precompute in server components, shared constants, or `useEffect` for client-only needs.

## 4) Auth & Security
- Credentials auth is implemented at `app/auth/page.tsx` and `app/auth/actions.ts` using Drizzle + bcrypt.
- Session is cookie-based (`lib/auth/session.ts`), storing `{ userId, email }` as JSON with iframe-compatible attributes (`sameSite: "none"`, `secure: true`). No JWT or NextAuth session yet.
- Cookie session helpers live in `lib/auth/session.ts`; reuse them rather than duplicating cookie logic in routes/actions.
- For long-term custom-auth evolution, migrate cookie payload to an opaque/signed session ID backed by DB session storage.
- Do not migrate to Auth.js/NextAuth unless explicitly requested for OAuth/social login/provider-based auth use cases.
- `middleware.ts` guards and NextAuth route wiring are not implemented yet. Any addition requires explicit approval.
- Dashboard layout (`app/dashboard/layout.tsx`) enforces auth guard for all dashboard routes.
- Team management actions enforce role-based access (`requireTeamRole` helper in `app/dashboard/team/actions.tsx`).
- Account deletion (`deleteAccountAction` in `app/dashboard/settings/actions.tsx`) requires password verification and cascades via DB foreign keys.
- Invitation tokens are cryptographically random (32 bytes) with 7-day expiry.
- For iframe auth compatibility, keep server auth/session cookies with `sameSite: "none"`, `secure: true`, `httpOnly: true`, and `path: "/"`.
- Do not change redirect/guard behavior when adjusting iframe cookie support; only cookie metadata should change.
- If app is embedded, ensure iframe host and app host share the same root domain (or use a parent-proxy domain) to keep cookies first-party.
- Do not add client-side cookie hacks for auth; cookie changes must happen server-side in session helpers/middleware.

## 5) Infrastructure & Scripts
- Treat `scripts/` as infrastructure; adjust only with intent.
- Agent lock policy: do not modify files under `scripts/` unless the current task explicitly authorizes script changes.
- Current script contracts:
  - `scripts/server.js` is the unified Express + Next server for Railway-style runtime on one port.
  - `scripts/commandRunner.js` owns `/run` command parsing/execution (spawn + timeout + lock).
  - `scripts/db-init.js` validates Drizzle journal integrity and runs migrations.
  - `scripts/dev-supervisor.js` supervises runtime and can launch `server.js` plus git polling.
  - `scripts/git-poll.js` polls origin for branch updates in supervised environments.
- Respect existing path structure; avoid moving files across route groups without agreement.
- Runtime UI may import only `scripts/error-reporter.ts` (via `components/ErrorReporter.tsx`); keep other scripts server-only.
- Deployment/runtime contract: Railpack by Railway for development workflow and Vercel for production. Do not introduce Docker as an active deployment path without explicit approval.

## 6) Coordination
- Keep shared UI primitives backward compatible or update all consumers.
- For cross-cutting changes, document affected routes/actions in PR/commit notes.
- Avoid creating new `*.md` explainer files unless explicitly requested; prefer updating existing docs.
- Never use double quotes (`"`) in any BuildArtifact title.

# Next.js Server / Client Component Rules (App Router)

## Server vs Client Components
1. Default: files under `app/` are Server Components.
2. Use `"use client"` only when the file needs hooks (`useState`, `useEffect`, etc.), browser APIs (`window`, `document`, `localStorage`), event handlers, or other interactive UI.
3. Keep Server Components for data fetching, API calls, DB access, env vars, and static rendering.

## Server Actions
- Never place `"use server"` inside a Client Component.
- Server actions may be placed under `app/actions/` or co-located inside the route segment (current auth pattern: `app/auth/actions.ts`); each action file must start with `"use server"`.
- Return only serializable data (strings, numbers, booleans, objects, arrays); never return JSX.

**Pattern**
```
app/actions/generateDocs.ts
"use server";
export async function generateDocs(formData: FormData) { /* server logic */ }

components/generate-form.tsx
"use client";
import { generateDocs } from "@/app/actions/generateDocs";
export default function GenerateForm() {
  return <form action={generateDocs}>{/* ... */}</form>;
}

app/page.tsx
import GenerateForm from "@/components/generate-form";
export default function Page() { return <GenerateForm />; }
```

## Hydration Safety
- Do not call `new Date()`, `Date.now()`, or `Math.random()` directly in render. Precompute on the server, inside `useEffect`, or as constants.

## Environment Variables
- Access `process.env` only in Server Components or Server Actions. Never expose secrets in Client Components.

## File Structure (target)
```
app/
  actions/
  auth/
  dashboard/
    layout.tsx
    team/
    settings/
  invite/
  ai/
  data/
  shadcn.css
components/
  dashboard/
  home/
  layout/
  theme/
  forms/
  ui/
lib/
  auth/
    session.ts
  db/
    client.ts
    schema.ts
  email/
    sendgrid.ts
  openai.ts
```

## Quick checks before coding
1) Does it need hooks? → mark `"use client"`.
2) Does it touch env vars/APIs/DB? → keep on server.
3) Creating a server action? → place in `app/actions/`, start with `"use server"`.

Never mix client and server logic in the same file.
