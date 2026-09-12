# Suite manifest examples

Three payloads that together cover the shapes a consumer has to handle. Each is validated
in CI against `../suite-manifest.schema.json` and pushed through `parseManifest`, so an
example that stops matching the contract fails the build rather than misleading a reader.

| File | Case |
|---|---|
| `manifest-full-landscape.json` | All five apps, served by Downtimes, with phase-2 `nav` on the four that have a frontend |
| `manifest-lists-standalone.json` | Lists installed without Core: `source: "fallback"`, no `suite`, one app |
| `manifest-core-only.json` | Core with no optional apps installed: `source: "core"`, `suite` present |

The URLs are the test environment's (`*.10.10.10.4.nip.io`). They are illustrative: the
whole point of the manifest is that a frontend never knows them at build time.

`manifest-lists-standalone.json` is the one to read twice. Lists installed without Core is
a supported installation, and it produces exactly the payload an outage produces. Neither
the relay nor the rail distinguishes them, which is why there is one code path and not two.
