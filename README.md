# rembert.dev

A single-page site that centers `ryan-kicks-moose.svg` at `/`.

## Development

Run the local server with Bun:

```bash
bun run dev
```

Then open <http://localhost:3000/>.

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
