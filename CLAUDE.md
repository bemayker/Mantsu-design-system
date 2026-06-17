# Mantsu Design System — Claude Code project notes

This repo is the Mantsu design system: React components + tokens + Storybook,
the single source of truth for Mantsu MES UI (see DESIGN-SYSTEM.md).

## Common commands
- `npm install` — install deps
- `npm run storybook` — dev server on :6006
- `npm run build-storybook` — static build
- `npm run typecheck` — `tsc --noEmit`

## When asked to commit and push
1. `npm run typecheck` must pass.
2. Stage everything except node_modules / storybook-static (see .gitignore).
3. Commit with a clear message, then push to the current branch.

Example:
```bash
npm run typecheck && git add -A && git commit -m "Add Mantsu design system: tokens, 23 components, Storybook" && git push
```

## Editing rules
- Token values (colors, type scale, shadows, gradient) come from Figma
  (file kN9ZMAZ7NrhNp0iu8gpzEC). Do not hand-edit them; regenerate from Figma.
- Tailwind theme in tailwind.config.js mirrors src/tokens/tokens.ts — keep them in sync.
- New components go in src/components + a story in src/stories, exported via src/components/index.ts.
