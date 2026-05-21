---
name: daddy-pay
description: >-
  Implements and debugs Daddy Pay Next.js admin features — BFF API routes,
  auth/middleware, shop/report/dashboard pages, token refresh. Use when working
  in Daddy-Pay/my-app, admin panel, API_URL proxy, getData, middleware, or 502
  header issues.
---

# Daddy Pay Admin

Full workflows: [SKILL.md](../../../docs/SKILL.md). Architecture: [DESIGN.md](../../../docs/DESIGN.md).

## Quick start

1. Identify layer: middleware / `app/api` BFF / `(appAuth)` page / Server Action / Redux.
2. Copy nearest existing file in that layer.
3. Auth: cookie `token` → `Authorization: Bearer` → `API_URL/api/v1/admin/...`.
4. Never use `x-user-data` for full user payload.

## New BFF route

1. Clone similar `src/app/api/**/route.ts`.
2. `cookies()` → 401 if no token.
3. axios to backend → `createResponseWithHeaders` on success.
4. axios 401 → `handleTokenExpiration()`.
5. Client calls `/api/...` with `withCredentials: true` if needed.

## New page

1. `src/app/(appAuth)/<name>/page.tsx`.
2. Menu: `layout.tsx` `menuItems` + `role`.
3. Data: existing hooks or `/api/...`; user from Redux (`getData` in navbar).

## Auth debug order

middleware `/me` → cookie `token` → API route headers → `getData()` → `AxiosInterceptorProvider`.

## Done checklist

- [ ] Auth matches siblings
- [ ] No secrets / no oversized headers
- [ ] `npm run lint` if substantial change
