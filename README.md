# rembert.dev

A single-page site that centers `ryan-kicks-moose.svg` at `/`.

## Development

Use Bun 1.3.11 (pinned in `package.json`) and install the committed dependency
graph before starting the development server:

```bash
bun install --frozen-lockfile
```

`bun.lock` is the authoritative install lockfile. `package-lock.json` is kept
as matching metadata for GitHub's dependency graph and Dependabot alerts. When
updating dependencies with Bun, regenerate that metadata with
`npm install --package-lock-only --ignore-scripts --no-audit --no-fund` and run
`bun run test` to check that the resolved package versions match.

Dependency lifecycle scripts are disabled through `trustedDependencies: []`;
the prebuilt Next.js and Sharp packages work without them.

Run the Next.js development server:

```bash
bun run dev
```

Then open the local URL printed by Next.js, usually <http://localhost:3000/>.

## Microfrontends

This repository is the default Vercel microfrontend app for `rembert.dev`.
Requests that do not match a child app route are served by this project, so `/`
resolves here.

The `personal-board` Vercel project is configured as a child app at `/board` in
`microfrontends.json`:

```text
/board
/board/*
```

The application keys in `microfrontends.json` must match the Vercel project
names in the microfrontends group.

## Tests

```bash
bun run test
```

## Build

```bash
bun run build
```
