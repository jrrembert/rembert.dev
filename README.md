# rembert.dev

A Next.js site that centers `ryan-kicks-moose.svg` at `/`.

## Routing

`rembert.dev` is the gateway. Next.js rewrites forward `/board` and `/board/*`
to `personal-board-eight.vercel.app`, and `/test` to the independent
`rembert-test` project. Both child apps keep their own deployments.

The board's existing `/vc-ap-e198da` asset prefix is forwarded to the same board
origin. Keeping this prefix preserves JavaScript/CSS URLs emitted by existing
board deployments and cached pages. Coordinate any future prefix change with
the child app before updating the gateway.

The `rembert-test` child app in `apps/test` serves a hello message at `/test`.
Its JavaScript and CSS use `/test-assets` to avoid collisions with the default
app. The gateway proxies these paths using the same Next.js multi-zone approach
as the board. The test app and gateway share the root Bun workspace and lockfile.

To try the routing locally, run these commands in separate terminals:

```bash
bun install --frozen-lockfile
TEST_APP_ORIGIN=http://localhost:3001 bun run dev
bun run dev:test
```

Open <http://localhost:3000/test>. `/` serves the main site, and `/board` uses
the board's production deployment unless `BOARD_APP_ORIGIN` overrides it.

The Vercel project `rembert-test` uses this repository with root directory
`apps/test` and source files outside the root directory enabled. Deploy the child
app before promoting the default app's new routing config. The default app uses
`https://rembert-test.vercel.app` unless `TEST_APP_ORIGIN` overrides it.

See [the preview and verification workflow](docs/preview-workflow.md) for local
composition, protected previews, board flow tests, and deployment cutover.

The one-app `microfrontends.json` is a cutover manifest for the pre-existing
Vercel group. It sends every request to the gateway; it no longer assigns any
path to a child project. Keep it until all live gateway deployments use
rewrites and the old group is safely detached. No managed routing SDK is needed
by this gateway.

Validate the child app with:

```bash
bun run --cwd apps/test typecheck
bun run --cwd apps/test build
```
