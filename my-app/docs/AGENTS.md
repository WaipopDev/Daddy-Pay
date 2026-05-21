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
  types/ utils/ lib/
```

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

1. Match existing patterns in the nearest file (API route, page, hook).
2. New backend calls: prefer `src/app/api/...` BFF + client axios to `/api/...` with `withCredentials: true` where cookies matter.
3. Keep diffs minimal; do not refactor unrelated files.
4. Do not commit `.env` or secrets.
5. Run `npm run lint` after substantive edits.

## Out of scope for agents unless asked

- Force push, amend commits, skip git hooks
- Increasing proxy header limits instead of fixing oversized headers
- Committing without explicit user request
