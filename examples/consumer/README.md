# Consumer smoke test

A bare Vite + React app that consumes `@bemayker/mantsu-design-system` the way the four
Mantsu frontends will: through the package `exports`, with the Tailwind preset as the only
source of tokens. It exists to catch the failures a Storybook build cannot see, because
Storybook renders from `src/` and never crosses the package boundary:

- an entry point missing from the `exports` map,
- a type that does not survive the `.d.ts` bundle,
- a utility class that the preset does not generate in a foreign Tailwind build,
- a second copy of React (which would break hooks).

There is deliberately no hand-written token in this app: if the preset is incomplete, the
page renders unstyled and the failure is visible.

## Running it against the published package

```bash
npm install                     # needs a GitHub Packages token, see the root README
npm run build
```

## Running it against your working copy

Faster while iterating, and what CI does, so no publish is needed to prove the contract:

```bash
cd ../..            # repo root
npm run build       # produces dist/
npm pack            # produces bemayker-mantsu-design-system-<version>.tgz
cd examples/consumer
npm install ../../bemayker-mantsu-design-system-*.tgz
npm run build
```

Installing the tarball is the honest test: it is byte-for-byte what `npm publish` uploads,
so a file missing from `files` fails here rather than in an app.
