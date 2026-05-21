# Daddy Pay — Agent Skill

Use this skill when implementing or debugging features in the Daddy Pay admin app.

**Canonical copy for Cursor**: `.cursor/skills/daddy-pay/SKILL.md` (repo root)

**Project copy**: `docs/SKILL.md`

---

## When to apply

- Adding or changing a protected page under `(appAuth)`
- Creating or editing BFF routes under `src/app/api/`
- Auth, token refresh, middleware, or `getData()` issues
- Shop / user / report / dashboard features
- 502 or header-size problems involving user payload

---

## Workflow: New BFF API endpoint

1. Find a similar route in `src/app/api/` (same HTTP method and auth pattern).
2. Create `src/app/api/<feature>/route.ts` (or `[id]/route.ts`).
3. Read `token` from `cookies()`; return 401 if missing.
4. Proxy to `{API_URL}/api/v1/admin/<path>` with `Authorization: Bearer ${token}`.
5. Return `createResponseWithHeaders(data, axiosResponse)` on success.
6. On axios 401 → `handleTokenExpiration()`.
7. Add constant in `src/constants/` if the path is reused from client.
8. Client: axios to `/api/<feature>` with `withCredentials: true` when needed.
9. Run `npm run lint`.

---

## Workflow: New protected page

1. Add thin page: `src/app/(appAuth)/<feature>/page.tsx` (hook + View only).
2. Create `hooks/use<Feature>ViewModel.ts` — all state and actions.
3. Create `services/<feature>Service.ts` — API calls used by the ViewModel.
4. Create `components/<Feature>/` — follow [DESIGN.md UI design system](./DESIGN.md#ui-design-system-required):
   - `<Feature>View.tsx` — compose only; `<main className="bg-white p-2 md:p-4">` + `ErrorBoundary`.
   - Sub-components: Header, Filter, Table, Modal (separate files — not one bloated View).
   - Reuse `TableComponent`, `FormGroup/*`, `Modals/ModalAction*`; Bootstrap + Tailwind + Font Awesome.
   - Status columns: formatters in `utils/` + `text-success` / `text-danger`.
   - Export via `index.ts`. Copy from nearest: `ShopInfo/`, `ShopManagementTransaction/`, `LanguageSettings/`.
5. Add `types/`, `constants/`, `utils/*Validation.ts` as needed.
6. If menu entry needed: update `menuItems` in `(appAuth)/layout.tsx` with `role` array.
7. UI strings: `lang['key']` + entries in `languageDefault.json`.
8. For user/shop context: Redux `user` slice (loaded in `AdminNavbar` via `getData()`).
9. Do **not** add new UI libraries; reuse shared components under `src/components/`.
10. Confirm middleware matcher does not block the path.

**References:**

- Tabs + modals: `language-settings` + `components/LanguageSettings/`
- List + filter + table: `shop-info` + `components/ShopInfo/`, `components/ShopManagementTransaction/`

---

## Workflow: Extend existing feature

1. Prefer extending ViewModel + service + component — **not** growing `page.tsx`.
2. New API: BFF route + service function + ViewModel handler.
3. New UI block: new component under `components/<Feature>/`, wire in `*View.tsx`.
4. Add `languageDefault.json` keys for any new labels.

---

## Workflow: Auth / user session bug

1. Check browser has `token` cookie (httpOnly — use Network tab on `/api/*` responses).
2. Trace middleware: `src/middleware.ts` → `/admin/me`, cache hit/miss, `X-New-Token`.
3. Server Actions: `src/app/actions.ts` → `getData()` uses cookie + fetch, not headers.
4. API route: `forwardHeaders` / cookie update in `headerUtils.ts`.
5. Client expiry: `AxiosInterceptorProvider`, `x-token-expired` header.
6. **Never** reintroduce large `x-user-data` header; use API fetch instead.

---

## Workflow: Fix 502 / oversized headers

1. Confirm no code sets `x-user-data` with full user JSON (see `middleware.ts`).
2. If user payload must be shared server-side, use cookie + `/admin/me` or narrow fields only.
3. Infrastructure workaround (nginx `large_client_header_buffers`) is last resort — document in PR if used.

---

## Workflow: Report or dashboard data

1. Constants: `src/constants/report.ts` or `dashboard.ts`.
2. BFF: `src/app/api/report/*` or `src/app/api/dashboard/*`.
3. Hooks: `useReportData`, `useDashboardData` — extend instead of inline fetch in page.
4. Charts: Chart.js via `react-chartjs-2` in `components/Dashboard/`.

---

## Workflow: Shop / program management

1. List pages: `(appAuth)/shop-management`, `shop-info`, `program-info`.
2. APIs: `src/app/api/shop-management/`, `shop-info/`, `program-info/`.
3. DnD ordering: `@dnd-kit` in program pages — follow `SortableRow.tsx` patterns.
4. Types: `shopInfoType.ts`, validators in `utils/shopInfoUtils.ts`.

---

## Checklist before claiming done

- [ ] Token/auth path consistent with sibling routes
- [ ] No secrets or `.env` committed
- [ ] No full user blob in HTTP headers
- [ ] Feature split: page thin → ViewModel → service → View (if feature work)
- [ ] View composes sub-components (Header/Filter/Table/Modal files — not one bloated View)
- [ ] UI matches DESIGN: `TableComponent`, `FormGroup/*`, Bootstrap+Tailwind+FA icons, status formatters
- [ ] New UI strings in `languageDefault.json`
- [ ] `npm run lint` passes (run when changes are substantial)
- [ ] User asked for commit → follow `RULE.md` git section only then

---

## References

- Architecture: [DESIGN.md](./DESIGN.md)
- Standards: [RULE.md](./RULE.md)
- Entry point: [AGENTS.md](./AGENTS.md)
