# Mantsu Design System — Claude Code project notes

This repo is the Mantsu design system: React components + tokens + Storybook,
the single source of truth for Mantsu MES UI (see DESIGN-SYSTEM.md).

Since 2026-09-12 (NAV-13) it is also a **publishable npm package**,
`@bemayker/mantsu-design-system` on GitHub Packages. Apps install it; they do not copy
from it. See README.md for consumer setup and the release procedure.

## Common commands
- `npm install` — install deps
- `npm run storybook` — dev server on :6006
- `npm run build-storybook` — static build
- `npm run typecheck` — `tsc --noEmit`
- `npm test` — Vitest (package contract + render smoke tests)
- `npm run build` — tsup → `dist/` (ESM, CJS, types) plus `dist/styles.css`

## When asked to commit and push
1. `npm run typecheck`, `npm test` and `npm run build` must pass.
2. Stage everything except node_modules / storybook-static / dist / *.tgz (see .gitignore).
3. Commit with a clear message, then push to the current branch.

## Editing rules
- Token values (colors, type scale, shadows, gradient) come from Figma
  (file kN9ZMAZ7NrhNp0iu8gpzEC). Do not hand-edit them; regenerate from Figma.
- `src/tailwind-preset.ts` mirrors `src/tokens/tokens.ts` and is the only place the
  Tailwind theme is declared. `tailwind.config.ts` consumes it, and a test asserts the two
  agree. Never re-declare a colour in `tailwind.config.ts`.
- New components go in src/components + a story in src/stories, exported via
  src/components/index.ts. A new public entry point also needs an `exports` entry in
  package.json, a tsup entry, and a line in the README's entry-point table.
- A change requested by a consuming app lands HERE first, with a story that demonstrates
  it; the app then bumps the installed version. Never only in the app.
- Six pre-existing vendored copies remain in the apps. VENDORING.md governs those and
  nothing else; do not vendor anything new.
- Releasing is tag-driven: bump `version`, add a CHANGELOG entry, merge, then push a
  `v<version>` tag. The publish workflow refuses a tag that disagrees with package.json.
