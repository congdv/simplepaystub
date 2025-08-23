Agent instructions for the paystub project

Purpose
-------
This document provides a small, actionable onboarding checklist and set of conventions for an automated coding agent (or a human reviewer) to follow before making edits in this repository. Read this file first on each new session.

Quick checklist (read in order)
-------------------------------
1. Read this file fully.
2. Inspect `package.json` to learn the scripts and package manager used.
3. Install dependencies (prefer project's package manager). If `pnpm` is available run `pnpm install`; otherwise use `npm install`.
4. Run a TypeScript check: `npx -y tsc --noEmit` (or `pnpm tsc --noEmit` / `npm run tsc --noEmit` if available).
5. Run the dev server (optional for UI work): `pnpm dev` (or `npm run dev`).
6. Make minimal changes, run `npx -y tsc --noEmit` again, and fix any type errors introduced.
7. If you edit files, prefer small, focused patches and include tests or a short smoke check when practical.

Project overview
----------------
- Framework: Next.js (app router). Layouts and pages live under `src/app/`.
- UI: Tailwind CSS and shadcn ui.
- Paystub templates and preview components are under `src/components/templates/` and `src/components/paystub-preview.tsx`.
- Forms use `react-hook-form` and types/schemas rely on Zod under `src/schemas.ts` and `src/types.ts`.
- Supabase client code (if present) is under `src/lib/supabase/`.

Key files and locations
-----------------------
- `src/app/(auth)/sign-up/page.tsx` — sign-up page and auth flows.
- `src/components/paystub-preview.tsx` — preview component used in the UI. This now contains a template selector.
- `src/components/templates/` — multiple templates. Look for `PayStubTemplate.tsx` (classic) and `PayStubTemplateImage.tsx` (image style).
- `src/schemas.ts` and `src/types.ts` — canonical data shapes. Use these to avoid type errors.
- `package.json` — scripts and dependencies.

Conventions and rules for the agent
----------------------------------
- Always run TypeScript typecheck after edits: `npx -y tsc --noEmit`.
- Prefer the repository's package manager. The project likely uses `npm` for package manager.
- When editing files in this workspace use the repository tools to apply patches (the edit API) rather than editing files by hand outside the repo tooling.
- Keep diffs small and focused. Do not reformat unrelated files.
- When you add or change public behavior, include a small test or visual smoke check if feasible.
- Avoid hard-coding secrets or credentials. Do not make external network calls unless the user asks and provides credentials.

Common commands
---------------
Run dependency install (preferred):

```bash
npm install
```


Run TypeScript check:

```bash
npx -y tsc --noEmit
```

Start dev server (Next.js):

```bash
npm run dev
```

Run lint / format (if configured):

```bash
npm lint
npm format
```

How to add a new template or change templates
--------------------------------------------
1. Inspect `src/components/templates` and `src/components/paystub-preview.tsx`.
2. If adding a new template component, follow existing patterns (props accept `PayStubType`).
3. Update `paystub-preview.tsx` to expose template selection controls if needed.
4. Run `npx -y tsc --noEmit` to ensure no type errors.
5. Preview in the running dev server to validate layout visually.

Testing and validation
----------------------
- Type-checking (`tsc`) is the primary automated gate.
- There are no unit tests defined by default in the repo; if you add tests, include instructions and run them before finishing.

When to ask the user
--------------------
Ask for clarification when:
- The requested change affects authentication, payments, or external services and credentials are required.
- The user wants a UI design change but hasn't provided the target behavior or a clear visual spec.
- A change would be large or risky (significant refactor, database migrations, or security-affecting code).

Recommended development flow
----------------------------
1. Create a small branch for the change.
2. Make minimal edits and run `npx -y tsc --noEmit` until green.
3. Run the dev server and verify the change visually if applicable.
4. Push the branch and open a PR with a short summary and the checklist of what you tested.

Contact / context
-----------------
If something in the repo is unclear, mention the file and line-range you inspected and ask a targeted question. The repo owner can be contacted through the user session that opened this workspace.

Notes
-----
- This file is intentionally concise. Keep it updated with any new conventions.
- If you need to run commands in CI or add tasks to `package.json`, prefer non-destructive changes and include a fallback.

---
Generated: August 23, 2025
