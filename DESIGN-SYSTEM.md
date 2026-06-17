# Mantsu Design System — Cursor reference

Compact, authoritative reference for AI codegen. When building Mantsu UI, use
these tokens and components. Do not invent colors or font sizes — use the
Tailwind utilities below, which map 1:1 to the Figma design system.

## Font
Lato. Weights: Regular 400, Medium 500, Bold 700.

## Color utilities (Tailwind)
| Utility | Hex | Role |
|---|---|---|
| `midnight` | #00193f | Primary navy, sidebar, headings |
| `atlantic` | #092755 | Navy hover |
| `horizon` / `primary-blue` | #155799 | Primary action, active nav, links |
| `sky-mist` | #bcddff | Light accent |
| `frost` | #eef6f8 | App background, subtle fills |
| `selected-blue` | #eff6ff | Selected row/item background |
| `primary-neutral` | #0f172a | Near-black text |
| `primary-orange` | #ff5640 | Orange accent |
| `slate-950..50` | #0c1222 → #f8fafc | Neutral text/borders |
| `info` #3588db / `info-bg` #eff6ff | | Status |
| `success` #10b981 / `success-bg` #f0fdf4 | | Status |
| `warning` #f59e0b / `warning-bg` #fff7ed | | Status |
| `error` #f43f5e / `error-bg` #fff1f2 | | Status |
| `bg-primary-gradient` | magenta→coral 135deg | Signature CTA ("New") |

## Type utilities
`text-h1` 36/40 bold · `text-h2` 24/32 bold · `text-h3` 20/28 bold · `text-h4` 18 bold ·
`text-body-lg` 16 bold · `text-body-emphasis` 16 medium · `text-body` 16 regular ·
`text-body-sm-emphasis` 14 bold · `text-body-sm` 14 regular ·
`text-body-xs-emphasis` 12 bold · `text-body-xs` 12 regular

## Shadows
`shadow-mantsu-sm` · `shadow-mantsu-md` · `shadow-mantsu-lg`

## Radii
`rounded-sm` 4px · `rounded-md` 8px · `rounded-lg` 12px

## Components (import from `src/components`)
- **Button** `variant: default|secondary|outline|link|gradient`, `size: sm|default|lg`, `iconOnly`
- **Input** `label, hint, error, leadingIcon`
- **Switch / Checkbox / Radio** controlled or uncontrolled, `disabled`, `indeterminate` (checkbox)
- **Badge** `status: info|success|warning|error|neutral`, `dot`
- **Tag** `onRemove`
- **Card** / **MetricCard** `label, value, delta, deltaDirection`
- **OptionCard** `title, description, selected, onSelect`
- **Table<T>** `columns, data, emptyState` (+ **EmptyState**)
- **Tabs** `items, value/defaultValue, onChange`
- **Breadcrumbs** `items`
- **Sidebar** navy nav `items, activeId`; **TopNavBar** `title, left, right`
- **Tree** hierarchical (Site→Building→Floor→Zone→Equipment) `nodes, selectedId`
- **Modal** / **SideDrawer** `open, onClose, title, footer`
- **Toast** `variant, title, description`
- **Tooltip** `content, side`
- **ProgressBar** `value, showLabel`; **PieChart** `data`; **GaugeChart** `value, label`

## Conventions
- App background is `frost`; surfaces are `white` with `border-slate-200` and `shadow-mantsu-sm`.
- Primary actions use `Button variant="default"` (navy); the gradient button is reserved for the main create/"New" action.
- Selected states use `selected-blue` bg + `primary-blue` text.
