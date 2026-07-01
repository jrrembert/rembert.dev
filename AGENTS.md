# AGENTS.md

## Project Instructions
- This repository contains the source for `rembert.dev`.
- Keep changes scoped to the user request.
- Do not add application scaffolding, new services, or external providers unless
  the user asks for them explicitly.

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
- Keep one focused task per branch unless the work explicitly requires coupled
  changes.

When merging stacked PRs:
- Merge from the bottom of the stack upward.
- After each lower PR merges, retarget the next PR to `main` or confirm GitHub
  can rebase it cleanly onto the newly merged base.
- Do not treat work as shipped just because its PR merged into a non-main
  branch. Treat it as shipped only after its commit is reachable from
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
- If merged work appears done but its code is not in `origin/main`, treat that
  as a blocking repository-state problem and recover the branch before
  continuing new feature work.

## Commands
- Use commands documented in this repository.
- There is currently no project build or test command documented.
- For documentation-only changes, inspect the diff before committing.
- In local Codex sessions, `rtk` may be used as an optional shell-command
  wrapper when available; it is not a project dependency.

## Development Rules
- Use test-driven development for behavior changes.
- Write failing tests before implementing new logic.
- Prefer small domain services with typed inputs and explicit dependencies.
- Keep shared application constants in root-level `constants.ts`.
- Preserve unrelated user changes. Do not overwrite or revert them without
  explicit confirmation.

## Security Boundaries
Never commit:
- API keys or access tokens.
- OAuth client secrets.
- Database URLs.
- Encryption keys.
- Real private user data.
- Production environment values.

Ask before:
- Adding a new external provider.
- Changing the database provider.
- Adding scheduled jobs, local asset uploads, analytics, or multi-owner support.

## Git Commit Standards
Use clear, focused commits. Each commit should represent one complete logical
change, leave the repository in a working state, and be easy to review or revert
independently.

### Commit Message Format
Prefer this format:

```text
<type>(<scope>): <imperative summary>

<optional body explaining why the change was needed, important implementation details, risks, migrations, or follow-ups>

<optional footer with issue links or breaking-change notes>
```

Examples:

```text
fix(site): correct homepage asset path
feat(site): add project index page
docs(readme): document local setup
test(site): cover navigation rendering
refactor(styles): simplify layout spacing
chore(deps): update eslint config
```

Write the summary in imperative mood, as if completing:

```text
When applied, this commit will...
```

Good:

```text
Add image preload hints to the homepage
Fix homepage asset loading
Remove unused style rule
```

Avoid vague or mixed-purpose messages:

```text
fix stuff
updates
changes
WIP
bugfix
fix homepage bug, rename component, update navbar styling, add tests
```

### Commit Scope And Content
Each commit should do one coherent thing. Atomic does not mean tiny; it means
focused and complete.

A good commit:
- Does one thing.
- Can be reviewed independently.
- Can be reverted without undoing unrelated work.
- Leaves the codebase working.
- Has a clear message.

Prefer separate commits for unrelated work:

```text
fix(site): correct homepage asset path
refactor(styles): rename shared spacing token
style(nav): adjust navbar spacing
test(site): cover homepage rendering
```

When practical, split cleanup, fixes, features, dependency updates, generated
files, and formatting into separate commits.

A useful test:

```text
Could this commit be explained in one sentence without using "and"?
```

If not, split it.

If changes must be coupled because of tooling or dependency constraints, make
that clear in the commit message.

### Message Body Guidelines
The first line should be short, specific, and readable in Git history.

For non-trivial changes, add a body that explains why the change was made, not
just what files changed. The diff already shows what changed.

Include context when relevant:
- Problem being solved.
- Reason this approach was chosen.
- Tradeoffs or risks.
- Migration notes.
- Breaking changes.
- Related issues or tickets.
