# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Start here

The actual app lives in `my-app/` (this repo root is just a wrapper — README + one doc). Read before making non-trivial changes:
- @my-app/AGENTS.md — entry point, states the one hard rule up front
- @my-app/docs/DESIGN.md — architecture, auth sequence, routing, UI design system, state management
- @my-app/docs/RULE.md — coding standards, layer-by-layer allowed/forbidden content, naming, BFF route pattern, i18n rules
- @my-app/docs/SKILL.md — step-by-step workflows (new BFF route, new page, extend feature, auth debugging, 502 fix)
- @docs/MACHINE-STATUS-OPERATION-TIME.md — machine-status derivation logic (see gotcha below)

## The one non-negotiable rule

New features under `(appAuth)` must be split: page → ViewModel → service → components (Header/Filter/Table/Modal). Never inline logic in `page.tsx` or a single `*View.tsx`.

## Commands (run from `my-app/`)

- Dev: `npm run dev` (`next dev --turbopack`)
- Build: `npm run build`
- Lint: `npm run lint` (no `--fix`)
- Test: `npm test` (Jest + React Testing Library, via `next/jest`). Config: `jest.config.js`. Co-locate `*.test.tsx` next to the component.

## Non-obvious gotchas

- This app is a pure BFF — it owns no business data. Every feature proxies to the `Daddy-Pay-API` backend (sibling repo) via `API_URL`, prefix `/api/v1/admin/`.
- Never put full user JSON in a custom response header (e.g. `x-user-data`) — previously caused 502s from nginx/ALB header-size limits. User data loads via `getData()` in `src/app/actions.ts` (Server Action hitting `/admin/me`).
- Role checks in the UI (`menuItems[].role` in `(appAuth)/layout.tsx`) are NOT a security boundary — the backend must enforce access control.
- Every new/changed user-facing string must be added to `languageDefault.json` and referenced via `lang['key']` — never hardcode UI text.
- Machine-status logic bifurcates by machine type: "เก้าอี้นวดไฟฟ้าหยอดเหรียญ" (coin massage chairs) uses the latest transaction by branchId+shopManagementName and ignores `machine.status`; every other machine type uses `machine.status` + countdown. See @docs/MACHINE-STATUS-OPERATION-TIME.md.
- The `xlsx` import is aliased to a fork (`npm:@e965/xlsx@0.20.3`) in package.json — don't "fix" this import to the real `xlsx` package.
- `@dnd-kit` is only used for drag-and-drop ordering in program management (`shop-management/program/[keyId]/page.tsx`, `components/Table/SortableRow.tsx`).

## Deploy

Push to `main` triggers `.github/workflows/deploy.yml`: rsync `my-app/` to the GCP VM, `npm install && npm run build`, then `pm2 restart web --update-env`. `dev` is a pure development branch with no auto-deploy.

## Git

Commit only when explicitly asked. No force-push to main/master, no `--no-verify`, unless explicitly asked.
