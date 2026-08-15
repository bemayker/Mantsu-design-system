# Vendoring a component into a Mantsu app

**This repo is source-only, not a publishable package.** `package.json` is
`"private": true` with no `main`, no `module`, no `exports`, no `files` and no build
script: there is nothing to `npm install`. So an app that needs a component here takes a
**vendored copy**, and this file is the process for doing that the same way every time.

Founder decision, 2026-07-14, recorded in
`mantsu-core/frontend/src/components/shared/dsTable/VENDORED.md`, and re-affirmed as
"option A" on 2026-08-14 (ClickUp `86cb41584`) after weighing the alternative of making
this repo publishable. That alternative is not rejected forever — it is a cross-repo
infrastructure project (build, `exports` map, Tailwind preset, versioning, migrating three
consumers), and it did not block the apps that needed components now.

This document exists because the convention was being reinvented per app. It is lifted
from `mantsu-downtimes/frontend/src/components/shared/VENDORED.md`, the most complete of
the three, and generalised.

## The rule that matters most

**A gap in a component is fixed HERE first, then re-vendored.** Never only in the copy.

Vendoring is a distribution mechanism, not a licence to fork. A local-only fix means the
next app to vendor the same component inherits the original bug, and the one after that
fixes it a third way. If you cannot fix it upstream in the same session, still fix it
upstream *first* in a story, and mark the local patch as a numbered divergence that
retires when the fix lands.

`mantsu-downtimes`' ADR-002 states the same rule from the consuming side: *"If that
component lacks something needed here, fix it in the design system and raise a story,
never fork it locally."*

## The process

1. **Copy** the component's source file(s) verbatim into
   `frontend/src/components/shared/<component>/` in the consuming app. Mirror
   `mantsu-core`'s `dsTable/` naming so the three apps stay recognisable to each other.
   Copy its dependencies too (a component that renders `Checkbox` needs `Checkbox`).
2. **Record provenance** in a `VENDORED.md` inside that subdirectory:
   - the upstream path,
   - **the upstream commit SHA**, not just a date — a date cannot be diffed,
   - a numbered list of every divergence from upstream, each carrying the reason and,
     where one exists, the upstream story that would retire it.
3. **Mark every divergence in the code too**, with a comment naming the same number and
   the work item (`// DT-FND-1 extension (divergence 3)`). A `VENDORED.md` that lists
   divergences the code does not mark is a list that goes stale silently.
4. **Adapt only the minimum**: the local `cn`/classname helper import, `data-testid` hooks,
   and prop extensions the feature genuinely needs. Do **not** restyle or "improve" a
   component while vendoring it. A divergence no acceptance criterion asked for is a
   re-sync cost for no benefit.
5. **Re-sync** by diffing the vendored file against current upstream and re-applying the
   numbered list. When a divergence exists because of an upstream gap that has since been
   fixed, delete the divergence rather than re-applying it — that is the whole point of
   numbering them.

## What belongs upstream and what does not

| | Upstream (here) | In the app's copy |
|---|---|---|
| Visual and interaction behaviour | ✅ | ❌ |
| Accessibility (roles, keyboard, focus) | ✅ | ❌ |
| A prop the component genuinely lacks | ✅ | ❌ |
| Semantics that only one domain has | ❌ | ✅ |
| `data-testid` hooks | ❌ | ✅ |
| Local import paths and helpers | ❌ | ✅ |

The middle row is where judgement is needed. "Only one app needs it" is not a reason to
keep it local; "only one app's *domain* can define it" is. A tree that can mark a node
archived is general. What *archived* means for a downtime reason is not.

## Storybook is part of the fix

An upstream change lands with a story that demonstrates it. That is the only place a
reviewer here can see the behaviour, since this repo has no consuming app to run it in —
and it is what stops the next consumer from vendoring a component whose new prop is
undocumented.

## Known consumers

| App | Vendored | Notes |
|---|---|---|
| `mantsu-core` | `dsTable/` | the first, and where the 2026-07-14 decision is recorded |
| `mantsu-lists` | — | |
| `mantsu-downtimes` | `dsTree/` (`Tree`, `Checkbox`) | ADR-010; keeps the fullest divergence ledger |

Add a row when you vendor something. Three apps quietly holding copies nobody has listed
is the state this file exists to prevent.
