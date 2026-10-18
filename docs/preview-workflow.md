# Preview and routing verification

The gateway owns path routing for both independently deployed child apps:

| Paths | Default upstream |
| --- | --- |
| `/board`, `/board/*`, `/vc-ap-e198da/*` | `https://personal-board-eight.vercel.app` |
| `/test`, `/test/*`, `/test-assets/*` | `https://rembert-test.vercel.app` |

`BOARD_APP_ORIGIN` and `TEST_APP_ORIGIN` override these origins at gateway build
or dev-server startup. Supply an origin without a path or trailing slash.
Updating an override requires restarting development or rebuilding a deployment.
The existing board package still emits `/vc-ap-e198da`; the gateway preserves
that prefix rather than requiring a coordinated child release.

## Hosted previews

Each project builds its own Git preview. A gateway preview uses the stable
production child origins by default. It does **not** automatically select child
previews by branch name or commit. Verify a child-only change on that child's
preview; verify routing on the gateway preview. Keep private account or
subscriber mutations out of these hosted smoke checks.

For a composed preview against an upstream that is already accessible, set the
appropriate origin override for the gateway's Preview environment, scoped to
the test branch, then redeploy that gateway preview. Record the exact gateway
and child deployment URLs/commits in the PR. Remove temporary overrides afterward.

An origin override alone does not authenticate a gateway request to a protected
child preview. Do not turn off deployment protection or put access secrets in a
rewrite URL. Use the local composition below for joint changes unless a separate,
scoped upstream-authentication arrangement has been explicitly configured.

To inspect a protected gateway preview with existing credentials, link the
intended project explicitly and use its short-lived development identity:

```bash
bunx vercel link --project rembert.dev --scope joseph-remberts-projects --yes
bunx vercel env run --project rembert.dev --scope joseph-remberts-projects -- \
  bun /absolute/path/to/your-preview-check.mjs
```

The check should read `VERCEL_OIDC_TOKEN` from its environment and send it as
`x-vercel-trusted-oidc-idp-token` only to the intended gateway preview origin.
Never print or commit the token. A child preview needs that child's own project
identity. This requires no shareable access link and does not weaken protection.

## Local board composition and existing flow suite

Use a clean `personal-board` checkout with its locked dependencies and generated
Prisma client (`bun install --frozen-lockfile`, then `bun run db:generate`). Its
existing browser fixtures use an in-memory archive repository and fake Gmail.
Subscriber administration still uses Prisma, so the complete suite also needs
an isolated local test database. No real Google/Gmail credentials are required.

From the board checkout, create a temporary localhost-only Postgres container
and apply the schema to its synthetic database only:

```bash
docker run --name rembert-board-routing-verification-db --rm -d \
  -p 127.0.0.1:54320:5432 --tmpfs /var/lib/postgresql/data:rw \
  -e POSTGRES_USER=personal_board -e POSTGRES_PASSWORD=personal_board \
  -e POSTGRES_DB=personal_board postgres:17-alpine
docker exec rembert-board-routing-verification-db pg_isready -U personal_board
DATABASE_URL='postgresql://personal_board:personal_board@localhost:54320/personal_board?schema=public' \
  bun run db:migrate:deploy
```

Port 54320 must be free; do not reuse an existing database that contains user
data. Wait for `pg_isready` to report that it accepts connections before applying
migrations. Stop the temporary container when done:
`docker stop rembert-board-routing-verification-db`. Its data is discarded.

In the board checkout, start the child on port 3102 with synthetic test settings:

```bash
DATABASE_URL='postgresql://personal_board:personal_board@localhost:54320/personal_board?schema=public' \
NEXTAUTH_SECRET=playwright-local-nextauth-secret \
NEXTAUTH_URL=http://localhost:3101/board/api/auth \
OWNER_EMAIL=owner@example.com \
PERSONAL_BOARD_ENABLE_TEST_ARCHIVE_FIXTURES=1 \
MFE_DISABLE_LOCAL_PROXY_REWRITE=1 \
node node_modules/next/dist/bin/next dev --webpack --hostname 127.0.0.1 --port 3102
```

In the gateway checkout, start the gateway on the origin expected by the board's
existing browser tests:

```bash
BOARD_APP_ORIGIN=http://127.0.0.1:3102 bun run dev --port 3101
```

In another board terminal, install its test browser if needed, then run:

```bash
bunx --no-install playwright install chromium
bun run test:e2e --workers=1 --grep-invert 'standalone child routes outside /board'
```

The suite reuses the gateway at `http://localhost:3101/board/home`. All page,
API, cookie, and Server Action requests go through gateway rewrites. Reset and
fake-email endpoints stay local and are disabled in production. The excluded
test expects the standalone child's `/` to return 404; the gateway deliberately
serves its own homepage there. Verify `/` returns the gateway homepage and
`/admin/login`, `/home`, `/privacy`, and `/terms` remain 404 separately.

Run the unfiltered suite directly against the child on port 3101 first as a
baseline. The composed suite covers subscriber/owner access guards, archive
browsing, logout, unsubscribe/resubscribe and fresh magic-link login, email
change/session invalidation, subscriber administration, sprint publication,
fake email sending, and delivery-health controls. It does not perform real
Google consent or send real messages. Check Google provider/callback URLs and
CSRF/session endpoints separately; a full live owner OAuth round trip requires
an authorized owner browser and registered callback origin.

## Cutover and rollback

Merge the `/test` foundation PR before this stacked board migration. Verify the
gateway preview's public board pages, redirect guards, auth metadata, logo, and
every referenced board JavaScript/CSS asset before merging. Keep the board's
existing application-authentication settings and production deployment intact.

The committed one-app `microfrontends.json` overrides the old group mapping so
all child requests reach gateway rewrites. Keep the existing group registered
during review and rollout. Detaching the old group is a later production cleanup
after all active gateway domains use the new deployment; do not delete the
group during preview verification. The child's SDK can remain to preserve its
current asset prefix without controlling the gateway's routing.

Rollback the gateway deployment to restore its prior managed `/board` routing.
Keep the child production domain and asset prefix stable so both gateway
versions can coexist during rollout and rollback.
