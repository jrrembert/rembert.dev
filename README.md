# rembert.dev

A Next.js site that centers `ryan-kicks-moose.svg` at `/`.

## Routing

`rembert.dev` is the default app. `microfrontends.json` routes `/board` and
`/board/*` to the `personal-board` Vercel project.

The `rembert-test` child app in `apps/test` serves a hello message at `/test`.
Its JavaScript and CSS use `/test-assets` to avoid collisions with the default
app. Both apps share the root Bun workspace and lockfile.

To try the routing locally, run these commands in separate terminals:

```bash
bun install --frozen-lockfile
bun run dev
bun run dev:test
bun run dev:proxy
```

Open <http://localhost:3024/test> through the proxy. `/` serves the main site,
and `/board` uses the existing remote fallback.

The Vercel project `rembert-test` must use this repository with root directory
`apps/test`, include source files outside the root directory, and belong to the
same microfrontends group as `rembert.dev`. Set its default route to `/test`.
Deploy the child app before promoting the default app's new routing config.

Validate the child app with:

```bash
bun run --cwd apps/test typecheck
bun run --cwd apps/test build
```
