# AGENTS.md

## Project Scope
- This repository contains the source for `rembert.dev`.
- Keep changes scoped to the user request.
- Do not add application scaffolding, new services, or external providers unless
  the user asks for them explicitly.

## Workflow
- Start shippable work from the current `origin/main` unless the user requests a
  different base.
- Use one focused branch and pull request per task.
- Check `git status` before editing, staging, committing, or deleting files.
- Preserve unrelated user changes. Do not overwrite or revert them without
  explicit confirmation.

## Commands
- Use commands documented in this repository.
- There is currently no project build or test command documented.
- For documentation-only changes, inspect the diff before committing.
- In local Codex sessions, `rtk` may be used as an optional shell-command
  wrapper when available; it is not a project dependency.

## Security Boundaries
Never commit:
- API keys or access tokens.
- OAuth client secrets.
- Database URLs.
- Encryption keys.
- Real private user data.
- Production environment values.

## Commit Standards
- Use clear, focused commits.
- Each commit should represent one complete logical change and leave the
  repository in a working state.
- Prefer this message format:

```text
<type>(<scope>): <imperative summary>
```

Examples:

```text
docs(agents): simplify repository instructions
fix(site): correct homepage asset path
chore(repo): update ignore rules
```

Write summaries in imperative mood, as if completing:

```text
When applied, this commit will...
```

Avoid vague messages such as `updates`, `changes`, `WIP`, or `fix stuff`.
