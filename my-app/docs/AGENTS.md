# Daddy Pay Admin — Agent Guide

Next.js 15 admin frontend for Daddy Pay. This app is a **BFF (Backend-for-Frontend)**: browser talks to Next.js (`/api/*`, Server Actions); Next.js proxies to the backend at `API_URL`.

## Read first

| File | Purpose |
|------|---------|
| [DESIGN.md](./DESIGN.md) | Architecture, auth flow, folder layout |
| [RULE.md](./RULE.md) | Coding standards and constraints |
| [SKILL.md](./SKILL.md) | Step-by-step workflows for common tasks |

Cursor also loads:

- `.cursor/rules/daddy-pay.mdc` — always-on rules (short)
- `.cursor/skills/daddy-pay/SKILL.md` — task workflows

## Stack

- **Framework**: Next.js 15 (App Router), React 19, TypeScript
- **UI**: Bootstrap 5, React Bootstrap, Tailwind (layout utilities), Sass
- **State**: Redux Toolkit (`src/store/`)
- **HTTP**: axios (client + API routes), `fetch` in Server Actions
- **Backend**: External API — `process.env.API_URL`, prefix `/api/v1/admin/`

## Project layout

```
src/
  app/
    (appAuth)/          # Protected pages (dashboard, reports, shop, user, …)
    api/                # BFF route handlers → proxy to API_URL
    login/              # Public login
    actions.ts          # Server Actions (e.g. getData)
  components/           # UI by feature
  constants/            # Endpoints, config
  hooks/                # Client data hooks
  middleware.ts         # Auth gate, token refresh, LRU user cache
  store/                # Redux slices
  types/ utils/ lib/ services/
```

## Feature page structure (required for new/changed features)

When adding or changing a feature under `(appAuth)`, **do not put all logic in `page.tsx`**. Split into layers (reference: **language-settings**).

```
src/app/(appAuth)/<feature>/page.tsx     # Thin: hook + View only (~10–20 lines)
src/hooks/use<Feature>ViewModel.ts       # State, handlers, Redux dispatch
src/services/<feature>Service.ts         # axios → /api/... (no UI)
src/types/<feature>Type.ts               # Types
src/constants/<feature>.ts               # API paths, config
src/utils/<feature>Validation.ts           # Form validation (if needed)
src/lib/                                   # Static helpers (e.g. default JSON)
src/components/<Feature>/
  <Feature>View.tsx                      # Compose only — map lang → props
  <Feature>Header.tsx                    # Back, title, toolbar (if applicable)
  <Feature>Filter.tsx                    # Search / date / filters (if applicable)
  <Feature>Table.tsx                     # Table + rows (if applicable)
  <Feature>*Modal.tsx                    # Modals (if applicable)
  index.ts
src/app/api/<feature>/                   # BFF routes
```

| Layer | Responsibility |
|-------|----------------|
| **page** | `const vm = useXxxViewModel(); return <XxxView vm={vm} />;` |
| **ViewModel hook** | `useState`, fetch/save, modals, `openModalAlert`, `setProcess` |
| **service** | HTTP calls only |
| **View / components** | JSX, labels from `lang`, props + callbacks — no direct API |
| **BFF** | `cookies()`, proxy to `API_URL` |

### Sub-components (do not skip)

`<Feature>View.tsx` must **not** contain full header + filter + table markup in one file. Split each major block into `components/<Feature>/<Feature><Block>.tsx` and wire from the View.

Examples:

- `LanguageSettings/` — Toolbar, Tabs, Table, Add/Edit modals
- `ShopManagementTransaction/` — Header, Filter, Table

Also: every new UI string → `lang['key']` + **`languageDefault.json`**.

### UI design (match existing project)

Do **not** design new screens from scratch. Follow [DESIGN.md — UI design system](./DESIGN.md#ui-design-system-required):

- Page shell: `bg-white p-2 md:p-4` + `ErrorBoundary`
- Compose: **Header → Filter → Table → Modals** in separate files under `components/<Feature>/`
- Reuse: `TableComponent`, `FormGroup/*`, `Modals/*`, `Filter/*`
- Bootstrap + Tailwind + Font Awesome only
- Status formatters in `utils/`, colors `text-success` / `text-danger`

References: `ShopInfo/`, `ShopManagementTransaction/`, `LanguageSettings/`, `Filter/FilterReportBank.tsx`

## Auth (critical)

1. Login: `POST /api/auth-signin` → sets **httpOnly** cookie `token`.
2. **Middleware** (`src/middleware.ts`): runs on page routes (not `/api/*`). Validates token via `GET {API_URL}/api/v1/admin/me`, refreshes token from `X-New-Token` / `X-Token-Refreshed`, LRU-caches user JSON **in middleware only**.
3. **Do not** put full user JSON in response headers (`x-user-data`). Large headers cause **502** behind nginx/ALB (~4–8KB limit).
4. **Server user data**: `getData()` in `src/app/actions.ts` reads `token` cookie and calls `/admin/me` with `fetch`, `cache: 'no-store'`.
5. **API routes**: read `token` from `cookies()`, forward `Authorization: Bearer`, use `createResponseWithHeaders` / `handleTokenExpiration` from `src/utils/`.

## Roles

- `super-admin` — full menu (shop, machine, program, user, language)
- `admin` / `user` — dashboard, reports; shop context from permissions

Menu visibility is defined in `src/app/(appAuth)/layout.tsx` (`menuItems[].role`).

## Commands

```bash
npm run dev      # next dev --turbopack
npm run build
npm run lint
```

## Environment

- `API_URL` — backend base URL (required for middleware, API routes, Server Actions)

## When changing code

1. **New or non-trivial feature changes**: use the [feature page structure](#feature-page-structure-required-for-newchanged-features) above; copy `language-settings` / `LanguageSettings` if unsure.
2. **UI**: follow [UI design system](./DESIGN.md#ui-design-system-required); copy nearest `components/<Feature>/` and `Modals/*`.
3. Match existing patterns in the nearest file (API route, service, view model).
3. New backend calls: BFF in `src/app/api/...` + client calls via `src/services/...` (not axios inside page/components).
4. Keep diffs minimal; do not refactor unrelated files.
5. Do not commit `.env` or secrets.
6. Run `npm run lint` after substantive edits.

## Out of scope for agents unless asked

- Force push, amend commits, skip git hooks
- Increasing proxy header limits instead of fixing oversized headers
- Committing without explicit user request
