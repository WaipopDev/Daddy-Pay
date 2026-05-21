# Daddy Pay — Project Rules

Rules for humans and AI agents working in this repository.

## General

- **Minimize scope**: Only change what the task requires.
- **Match conventions**: Copy patterns from neighboring files (imports, error handling, naming).
- **Language**: UI strings often come from Redux `lang` slice / API; code comments may be Thai or English.
- **No secrets in git**: Never commit `.env`, tokens, or credentials.

## TypeScript & React

- Use **functional components**; `'use client'` only when hooks, Redux, or browser APIs are needed.
- Protected pages live under `src/app/(appAuth)/`.
- Prefer existing **hooks** (`useShopData`, `useReportData`, `useDashboardData`, …) over duplicating fetch logic in pages.
- Types go in `src/types/`; shared constants in `src/constants/`.
- Use `@/` path alias for imports from `src/`.

## Feature structure (page / ViewModel / Service / View)

**Required** when adding or materially changing a feature under `(appAuth)`.

### Layer rules

| File | Allowed content |
|------|-----------------|
| `app/(appAuth)/<feature>/page.tsx` | Import hook + `<Feature>View vm={vm} />` only (~10–20 lines) |
| `hooks/use<Feature>ViewModel.ts` | State, effects, handlers, validation calls, modal dispatch — **no JSX** |
| `services/<feature>Service.ts` | `axios` to `/api/...` only — **no React** |
| `components/<Feature>/<Feature>View.tsx` | Compose sub-components; map `lang` → label props — **no axios** |
| `components/<Feature>/<Feature>*.tsx` | Presentational UI (header, filter, table, modals) — props + callbacks only |
| `components/<Feature>/index.ts` | Re-export public components |

### Sub-components (required)

**Do not** put header, filters, tables, or modals inline in `<Feature>View.tsx` when they are separate UI blocks.

Split into dedicated files under `components/<Feature>/`:

| UI block | Example file |
|----------|----------------|
| Toolbar / back / title | `LanguageSettingsToolbar.tsx`, `ShopManagementTransactionHeader.tsx` |
| Filters / search form | `ShopManagementTransactionFilter.tsx` |
| Data table | `LanguageTranslationsTable.tsx`, `ShopManagementTransactionTable.tsx` |
| Modals | `LanguageAddModal.tsx`, `LanguageEditModal.tsx` |

`<Feature>View.tsx` should read like a layout file: import sub-components, pass `lang` labels and `vm` callbacks.

**Reference implementations:**

- Complex (tabs + modals): `language-settings` → `components/LanguageSettings/`
- List + filter + table: `shop-management/transaction/[id]` → `components/ShopManagementTransaction/`

### Naming

| Layer | Pattern | Example |
|-------|---------|---------|
| ViewModel hook | `use<Feature>ViewModel` | `useShopManagementTransactionViewModel` |
| Service | `<feature>Service.ts` | `shopManagementTransactionService.ts` |
| Root view | `<Feature>View.tsx` | `ShopManagementTransactionView.tsx` |
| Sub-component | `<Feature><Purpose>.tsx` | `ShopManagementTransactionTable.tsx` |

### Forbidden

| Layer | Do not |
|-------|--------|
| `page.tsx` | `axios`, `useState`, `useEffect`, business logic, large JSX |
| `*View.tsx` | `axios`, fetch, validation logic, table row mapping for whole page in one file |
| Sub-components | `axios`, Redux dispatch, `useParams` (keep in ViewModel) |
| ViewModel | JSX / `return <...>` |
| Service | React hooks, UI strings |

### Quick checklist (feature work)

- [ ] `page.tsx` is thin (hook + View only)
- [ ] API calls live in `services/<feature>Service.ts`
- [ ] State/handlers in `use<Feature>ViewModel.ts`
- [ ] `<Feature>View.tsx` composes sub-components (not one 100+ line file)
- [ ] Each major UI block has its own file under `components/<Feature>/`
- [ ] New strings in `languageDefault.json`

## API routes (BFF)

Pattern for proxy routes:

```typescript
import { cookies } from 'next/headers';
import axios, { AxiosError } from 'axios';
import { handleTokenExpiration } from '@/utils/serverErrorHandler';
import { createResponseWithHeaders } from '@/utils/headerUtils';

export async function GET() {
  const token = (await cookies()).get('token')?.value;
  if (!token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  try {
    const response = await axios.get(`${process.env.API_URL}/api/v1/admin/...`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return createResponseWithHeaders(response.data, response);
  } catch (error) {
    const err = error as AxiosError;
    if (err.response?.status === 401) {
      return handleTokenExpiration();
    }
    // map status + message from err.response?.data
  }
}
```

- Always check `token` before calling backend.
- Forward token refresh via `createResponseWithHeaders` / `forwardHeaders`.
- On 401, use `handleTokenExpiration()` for consistent logout behavior.

## Client HTTP

- Call **Next BFF** paths (`/api/...`), not `API_URL` directly from the browser.
- Use `withCredentials: true` when cookies must be sent.
- Global axios behavior: `src/utils/AxiosInterceptorProvider.tsx`.

## Authentication

| Do | Don't |
|----|--------|
| Store session in httpOnly `token` cookie | Put large JWT/user JSON in custom headers |
| Load user in Server Actions via cookie + `/admin/me` | Encode full `userData` in `x-user-data` (502 risk) |
| Let middleware validate token on page navigations | Bypass middleware for protected UI routes |
| Clear `token` on logout / token expiry | Log passwords or tokens |

## Middleware

- Matcher excludes `api`, `_next/static`, `_next/image`, static images.
- Public paths: `/login`, `/logout`.
- LRU cache key: `user-data-${token}`; invalidate on token refresh and login page hit.

## Redux

- User profile: `userSlice` — hydrated from `getData()` in `AdminNavbar`.
- Language: `langSlice`.
- Modals: `modalSlice`.
- Use `useAppDispatch` / `useAppSelector` from `@/store/hook`.

## Internationalization (lang)

- Protected UI loads strings from Redux `lang` via `useAppSelector(state => state.lang)`.
- Default keys live in **`languageDefault.json`** at project root; `StoreProvider` dispatches them on startup.
- **Every new or changed user-facing string** in `(appAuth)` (and shared components they use) must:
  1. Use `lang['your_key']` in code — no hardcoded labels, buttons, alerts, or table headers.
  2. Add the same key and English default to **`languageDefault.json`**.
- Menu/sidebar: use `key` in `layout.tsx` `menuItems`; display via `lang[item.key]` in `Sidebar` / `HeaderBar`.
- Naming: `menu_*`, `page_*`, `button_*`, `global_*`, `validation_*`, `filter_*`.

## UI

- Tables: `components/Table/Table.tsx`, `CustomPagination.tsx`.
- Forms: `components/FormGroup/*`, validate with `utils/validateRequiredFields.ts`.
- Modals: `ModalForm`, `ModalAlert`, `ModalActionDelete`.
- Styling: Bootstrap components + Tailwind utility classes (e.g. layout in `(appAuth)/layout.tsx`).

## File uploads

- Use `FormData` in API routes; append files to backend `FormData` (see `src/app/api/shop-info/route.ts`).

## Errors

- Server routes: `serverErrorHandler.ts`, `handleTokenExpiration`.
- Client: `errorHandler.ts`, `useErrorHandler` in store.

## Git

- Commit only when the user explicitly asks.
- No `git push --force` to main/master unless explicitly requested.

## Lint & build

After non-trivial changes:

```bash
npm run lint
npm run build   # when user asks for verification or before release
```
