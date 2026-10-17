# AGENTS.md

## Project And Scope

- This repository contains the Next.js source for `rembert.dev`; use Bun.
- Keep changes scoped to the user request and preserve unrelated user changes.
  Do not overwrite or revert them without explicit confirmation.
- Do not add application scaffolding, new services, or external providers unless
  explicitly requested. Ask before adding scheduled jobs, local asset uploads,
  or analytics unless the request already authorizes them.
- Never commit credentials, secrets, private user data, or production
  environment values.

## Commands

- Development: `bun run dev`
- Tests: `bun run test`
- Type checking: `bun run typecheck`
- Production build: `bun run build`
- For documentation-only changes, inspect the diff before committing.

## Development

- For behavior changes, write a failing test before implementing the change.
- Keep shared application constants in root-level `constants.ts`.

## Branches And Integration

- Create implementation branches from freshly fetched `origin/main`, except
  for intentional stacked PRs. Keep one focused task per branch.
- Treat work as integrated only after its changes reach `origin/main`.
  An open integration PR tracks pending work; it does not complete integration.
- For stacked PRs, base each PR on the preceding branch and merge bottom-up.
  After each merge, retarget the next PR to `main` and resolve any conflicts
  or changes introduced by squash or rebase merges before continuing.
- After merging, fetch origin and verify the resulting merge, squash, or
  rebased commit is reachable from `origin/main` and contains the intended changes.
  If expected changes are missing, preserve the source branch and resolve the
  integration problem before starting new feature work.
- Before deleting or renaming branches or cleaning worktrees, fetch origin
  and check `git worktree list`. Verify all work being removed is integrated into
  `origin/main`; original commit ancestry alone is insufficient after squash
  or rebase merges. Keep branches or worktrees intact if verification is uncertain.
- Never delete local or remote branches containing unmerged work unless the user
  explicitly confirms it is intentionally abandoned.

## Pull Requests

- Use `.github/PULL_REQUEST_TEMPLATE.md` for every PR, including CLI/API creation.
  Fill Summary, Verification, and Review notes with task-specific details;
  explain skipped verification and write "None" when there are no review notes.
- For stacked PRs, list the merge order and each PR's base in every PR body.
  Remove the Stack section for unstacked PRs.
- For issues specified for closure, add one line per issue: `Closes #123`,
  `Closes owner/repo#123`, or `Closes TEAM-123` for Linear. Remove the Issues
  section when none was specified.
- Put GitHub closing lines in the PR targeting `main`; closing keywords require
  the default branch. Verify Linear status after merge because it depends on
  integration and workflow automation settings.

## Commits

- Keep commits focused, independently reviewable, and working. Include the
  implementation and its tests together; separate unrelated changes.
- Prefer `<type>(<scope>): <imperative summary>`,
  e.g. `fix(site): correct homepage asset path`.
- For non-trivial changes, explain the reason and material tradeoffs in the body.
