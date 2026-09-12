# Changelog

All notable changes to `@bemayker/mantsu-design-system`.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and this
package follows [semantic versioning](https://semver.org/). See "Versioning" in the README
for what counts as breaking.

## [1.0.0] - 2026-09-12

First published version. The repo was source-only before this; apps took vendored copies.

### Added

- The repo is a publishable npm package, `@bemayker/mantsu-design-system`, on GitHub
  Packages (NAV-13, founder decision of 2026-09-12, reversing option A of `86cb41584`
  for new components).
- Build with tsup: ESM, CJS and type declarations for four entry points (`.`, `./tokens`,
  `./tailwind-preset`, `./icons`), plus `./styles.css`.
- Tailwind preset (`src/tailwind-preset.ts`), so a consuming app declares no tokens of its
  own. This repo's own `tailwind.config.ts` consumes the same preset.
- Vitest, with a package-contract suite and component render smoke tests. The repo had no
  tests before.
- A consumer smoke test app in `examples/consumer/`, run in CI against the packed tarball.
- `.github/workflows/publish.yml` (tag-driven publish) and `.github/workflows/ci.yml`
  (typecheck, test, build, consumer smoke test on every pull request).
- The suite manifest contract (NAV-4): `docs/suite-manifest.md` as the normative
  document, `docs/suite-manifest.schema.json` for producer validation,
  `docs/examples/` with the three cases, and `parseManifest` plus the manifest types in
  `src/components/SuiteNav/manifest.ts`, exported from the package root. A test asserts
  the document, the schema, the parser and the examples still agree.

### Changed

- `react` and `react-dom` moved from `dependencies` to `peerDependencies` (`^18.3`).
- `tailwind.config.js` became `tailwind.config.ts` and now derives its theme from the
  preset rather than re-declaring token values.
- The webfont and root font-family moved from `src/styles/globals.css` into
  `src/styles/package.css`, the file published as `./styles.css`.

### Not changed

- The six vendored copies in the apps (`dsTree`, `dsTable`, `dsColorPicker`, `dsDropdown`,
  `dsSwitch`, `DataTable`) stay vendored. Migrating them is a separate story.
