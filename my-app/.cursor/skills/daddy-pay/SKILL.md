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

## New / changed feature (structure)

1. Thin `page.tsx` → `use<Feature>ViewModel` → `<Feature>View vm={vm} />`.
2. `services/<feature>Service.ts` for API; ViewModel for state/handlers (no JSX).
3. `components/<Feature>/` — split UI blocks (required):
   - `<Feature>View.tsx` — compose only, map `lang` → props
   - `<Feature>Header.tsx` / `<Feature>Toolbar.tsx` — back, title, actions
   - `<Feature>Filter.tsx` — date/search filters
   - `<Feature>Table.tsx` — table rows
   - `<Feature>*Modal.tsx` — modals when needed
4. References: `LanguageSettings/` (tabs+modals), `ShopManagementTransaction/` (header+filter+table).
5. New strings → `languageDefault.json`. Menu: `layout.tsx` `menuItems` + `role`.

## Auth debug order

middleware `/me` → cookie `token` → API route headers → `getData()` → `AxiosInterceptorProvider`.

## Done checklist

- [ ] Auth matches siblings
- [ ] No secrets / no oversized headers
- [ ] page → ViewModel → service → View (no monolithic page)
- [ ] View composes sub-components (Header/Filter/Table/Modal), not one 100+ line file
- [ ] `npm run lint` if substantial change
