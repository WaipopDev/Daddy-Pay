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
