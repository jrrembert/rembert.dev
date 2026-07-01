# AGENTS.md

## Project Instructions
This repository is in the docs-and-issues phase for the Personal Board application. Do not add application code until a future development chat starts a specific Linear implementation issue.

Before coding:
- Read `SPEC.md`.
- Read `ARCH.md`.
- Confirm the Linear issue being implemented.
- Keep changes scoped to that issue.

## Branching And Merge Rules
All implementation work intended to ship must become reachable from
`origin/main`. A pull request merged into another feature branch is not shipped
until that feature branch, or a later branch containing it, is merged into
`main`.

Before starting work:
- Create implementation branches from the current `origin/main` unless the task
  intentionally uses a stacked PR.
- If using stacked PRs, write the stack order in each PR body and set each PR
  base to the previous branch in the stack.
- Keep one Linear issue per branch unless the issue explicitly requires a
  coupled change.

When merging stacked PRs:
- Merge from the bottom of the stack upward.
- After each lower PR merges, retarget the next PR to `main` or confirm GitHub
  can rebase it cleanly onto the newly merged base.
- Do not mark a Linear implementation issue done just because its PR merged into
  a non-main branch. Mark it done only after its commit is reachable from
  `origin/main`, or after a main-targeting integration PR containing it is open
  and clearly tracked.

Before deleting branches or cleaning worktrees:
- Run `git fetch origin`.
- Confirm every important branch tip is reachable from `origin/main` with
  `git merge-base --is-ancestor <branch-or-sha> origin/main`.
- If a branch tip is not reachable from `origin/main`, either merge/retarget the
  PR chain first or create and push a protected recovery branch at that tip.
- Check `git worktree list` before deleting or renaming branches. Git worktrees
  can keep branches checked out outside the current directory.
- Never delete local or remote feature branches that contain unmerged work unless
  the user explicitly confirms the commits are intentionally abandoned.

After merging:
- Run `git fetch origin` and verify the expected commits are ancestors of
  `origin/main`.
- If a merged Linear issue appears done but its code is not in `origin/main`,
  treat that as a blocking repository-state problem and recover the branch
  before continuing new feature work.

## Commands
Use the project commands exactly as documented in `SPEC.md` and `README.md`.
In local Codex sessions, `rtk` may be used as an optional wrapper for shell
commands when available; it is not a project dependency or contributor
requirement.

Project command examples:

```bash
git status
bun run test
bun run build
```

The planned application commands in `SPEC.md` are not expected to work until the scaffold issue is implemented.

## Development Rules
- Use test-driven development for behavior changes.
- Write failing tests before implementing new logic.
- Prefer small domain services with typed inputs and explicit dependencies.
- Preserve non-enumeration for all public archive login, magic-link, and unsubscribe interfaces.
- Never expose whether an email address is subscribed through public UI, response bodies, status codes, or obvious timing differences.
- Use fake Gmail clients in tests.
- Never send real Gmail messages from tests or automated local checks.
- Keep shared application constants in root-level `constants.ts`.

## Security Boundaries
Never commit:
- OAuth client secrets.
- Gmail refresh tokens or access tokens.
- Database URLs.
- Encryption keys.
- Real subscriber data.
- Production environment values.

Ask before:
- Adding a new external provider.
- Changing from Gmail API to another email sender.
- Changing from Neon Postgres to another database provider.
- Adding public subscribe, scheduled sending, local asset uploads, analytics, or multi-owner support.

Git Commit Standards

Use clear, focused commits. Each commit should represent one complete logical change, leave the repository in a working state, and be easy to review or revert independently.

Commit Message Format

Prefer this format:

<type>(<scope>): <imperative summary>
<optional body explaining why the change was needed, important implementation details, risks, migrations, or follow-ups>
<optional footer with issue links or breaking-change notes>

Examples:

fix(auth): reject expired login tokens
feat(payments): add ACH retry handling
docs(readme): document local setup
test(checkout): cover empty cart checkout
refactor(cart): simplify total calculation
chore(deps): update eslint config

Write the summary in imperative mood, as if completing:

When applied, this commit will...

Good:

Add rate limit headers to API responses
Fix checkout crash on empty cart
Remove unused billing migration

Avoid vague or mixed-purpose messages:

fix stuff
updates
changes
WIP
bugfix
fix login bug, rename user table, update navbar styling, add tests

Commit Scope and Content

Each commit should do one coherent thing. Atomic does not mean tiny; it means focused and complete.

A good commit:

- Does one thing
- Can be reviewed independently
- Can be reverted without undoing unrelated work
- Leaves the codebase working
- Has a clear message

Prefer separate commits for unrelated work:

fix(auth): reject expired login tokens
refactor(db): rename user table to accounts
style(nav): adjust navbar spacing
test(auth): cover expired token login failure

When practical, split cleanup, fixes, features, dependency updates, generated files, and formatting into separate commits.

A useful test:

Could this commit be explained in one sentence without using "and"?

If not, split it.

If changes must be coupled because of tooling or dependency constraints, make that clear in the commit message.

Message Body Guidelines

The first line should be short, specific, and readable in Git history.

For non-trivial changes, add a body that explains why the change was made, not just what files changed. The diff already shows what changed.

Include context when relevant:

- Problem being solved
- Reason this approach was chosen
- Tradeoffs or risks
- Migration notes
- Breaking changes
- Related issues or tickets
