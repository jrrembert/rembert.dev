# rembert.dev

A Next.js site that centers `ryan-kicks-moose.svg` at `/`.

## Development

Use Bun 1.3.11:

```bash
bun install --frozen-lockfile
bun run dev
```

Open the local URL printed by Next.js, usually <http://localhost:3000/>.

## Checks

```bash
bun run test
bun run typecheck
bun run build
```

## Microfrontends

`rembert.dev` is the default app. `microfrontends.json` routes `/board` and
`/board/*` to the `personal-board` Vercel project. Application keys must match
the Vercel project names in the microfrontends group.
