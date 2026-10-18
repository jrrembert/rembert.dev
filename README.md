# rembert.dev

A Next.js site that centers `ryan-kicks-moose.svg` at `/`.

## Routing

`rembert.dev` is the default app. `microfrontends.json` routes `/board` and
`/board/*` to the `personal-board` Vercel project.

The `rembert-test` child app in `apps/test` serves a hello message at `/test`.
Its JavaScript and CSS use `/test-assets` to avoid collisions with the default
app. The default app proxies these paths using Next.js multi-zone rewrites;
the child deploys independently without joining the Vercel-managed group, which
is already at its two-project Hobby limit. Both apps share the root Bun workspace
and lockfile.

To try the routing locally, run these commands in separate terminals:

```bash
bun install --frozen-lockfile
TEST_APP_ORIGIN=http://localhost:3001 bun run dev
bun run dev:test
bun run dev:proxy
```

Open <http://localhost:3024/test> through the proxy. `/` serves the main site,
and `/board` uses the existing remote fallback.

The Vercel project `rembert-test` uses this repository with root directory
`apps/test` and source files outside the root directory enabled. Deploy the child
app before promoting the default app's new routing config. The default app uses
`https://rembert-test.vercel.app` unless `TEST_APP_ORIGIN` overrides it, which
also allows testing against a child preview deployment.

Validate the child app with:

```bash
bun run --cwd apps/test typecheck
bun run --cwd apps/test build
```
