# Mantsu Design System

React component library + design tokens for the Mantsu MES UI, extracted from
the Figma Design System (`kN9ZMAZ7NrhNp0iu8gpzEC`). Built with Storybook 8,
Tailwind CSS, and TypeScript.

This repo exists to be the **single source of truth** for the design system —
for the team (a browsable component catalogue) and for AI codegen (Cursor),
which gets precise tokens and typed component props instead of a large Figma file.

## Getting started

```bash
npm install
npm run storybook      # dev server on :6006
npm run build-storybook
npm run typecheck
```

## Structure

```
src/
  tokens/tokens.ts        # canonical design tokens (colors, type, spacing, shadows)
  components/             # 23 React components, token-driven via Tailwind
  stories/                # Storybook stories, grouped by category
  styles/globals.css      # Tailwind entry + Lato font
tailwind.config.js        # Tailwind theme wired to the tokens
DESIGN-SYSTEM.md          # compact reference for Cursor / codegen
```

## Tokens

Colors, the Lato type scale, shadows, and the primary gradient are extracted
verbatim from Figma. Tailwind utility classes map 1:1 to them
(e.g. `bg-midnight`, `text-h2`, `bg-primary-gradient`, `shadow-mantsu-lg`).
See `DESIGN-SYSTEM.md` for the full table.

## Components

Form: Button, Input, Switch, Checkbox, Radio
Data display: Badge, Tag, Card, MetricCard, OptionCard, Table, EmptyState
Navigation: Tabs, Breadcrumbs, Sidebar, TopNavBar, Tree
Feedback: Modal, SideDrawer, Toast, Tooltip
Charts: PieChart, GaugeChart, ProgressBar

## Note on accuracy

Tokens are 100% Figma-accurate (pulled from Figma styles via the plugin API).
Component markup follows the design-system conventions; refine individual
components against their Figma frames as needed — the variant axes (e.g. Button:
Default / Secondary / Outline / Link / Gradient × Default / Hover / Disabled)
match the Figma component sets.
