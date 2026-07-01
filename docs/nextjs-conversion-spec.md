# Spec: Next.js Conversion

## Objective
Convert `rembert.dev` from a custom Bun HTTP server to a minimal Next.js app while preserving the current homepage behavior: `/` displays the `ryan-kicks-moose.svg` image centered on a white page.

## Tech Stack
- Next.js App Router
- React
- TypeScript
- Bun for dependency installation and `bun test`

## Commands
- Dev: `bun run dev`
- Build: `bun run build`
- Start: `bun run start`
- Test: `bun run test`
- Type check: `bun run typecheck`

## Project Structure
- `app/` contains the Next.js route, layout, and CSS.
- `public/` contains static assets served from the site root.
- `constants.ts` keeps shared site constants.
- `index.test.ts` verifies the migrated homepage contract.

## Code Style
```tsx
import Image from "next/image";

export default function Home() {
  return <Image src="/asset.svg" alt="Descriptive text" width={99} height={97} />;
}
```

Use typed exports, framework primitives, and small files. Keep static styling in CSS modules or global CSS instead of inline style blocks.

## Testing Strategy
Use `bun test` for repository-level contract tests, `bun run typecheck` for TypeScript validation, and `bun run build` for Next.js production verification.

## Boundaries
- Always: preserve the existing homepage visual behavior and static image path.
- Ask first: adding external services, analytics, or deployment providers.
- Never: commit secrets, `node_modules`, or environment values.

## Success Criteria
- `/` is implemented by the Next.js App Router.
- The homepage image remains centered and uses the existing alt text.
- `ryan-kicks-moose.svg` is served from `public/ryan-kicks-moose.svg`.
- The old custom Bun server and `index.html` are no longer the app entrypoint.
- Tests, type checking, and production build pass.
