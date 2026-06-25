---
name: conventional-commit-message
description: Generate high-quality Conventional Commit messages for repositories using conventional-changelog-conventionalcommits.
license: MIT
compatibility:
  - Claude Code
  - Codex
  - Cursor
  - Gemini CLI
  - GitHub Copilot
  - Windsurf
  - Cline
  - Roo Code
  - Goose
  - Continue
  - OpenCode
  - Amp
  - universal
metadata:
  author: dangreen
  tags:
    - conventional-commits
    - conventional-changelog
    - commit-message
    - changelog
    - release
    - monorepo
---

# Conventional Commit Message

Use this skill when writing, amending, reviewing, or suggesting commit messages
for repositories that use the `conventional-changelog-conventionalcommits`
preset or compatible Conventional Commits release tooling.

## Commit Shape

Use this header format:

```text
type(scope)!: subject
```

Rules:

- `scope` is optional.
- `!` means breaking change and must only be used intentionally.
- Keep the subject concise, changelog-ready, and lower-case unless a proper noun
  or identifier requires casing.
- Do not end the subject with a period.
- Prefer one commit per coherent change. If one diff contains unrelated release
  visible changes, recommend splitting it.
- Write the subject so it reads well as a bullet in a generated changelog. Avoid
  vague implementation notes like `add some feature`, `update stuff`, or
  `fix issue`. Prefer user-facing outcomes such as `support custom scopes`,
  `preserve prerelease tags`, or `require Node.js 22`.
- Active verb phrases are usually better than passive sentences. Prefer
  `support custom scopes` over `custom scopes were added` unless passive voice
  is clearly more natural for the project.

For breaking changes, include a footer when the impact is known:

```text
feat(parser)!: remove legacy token fallback

BREAKING CHANGE: custom token fallbacks are no longer applied during parsing.
```

The preset recognizes `BREAKING CHANGE` and `BREAKING-CHANGE`.

## Type Selection

Default visible types:

- `feat`: user-facing feature; appears under `Features`; bumps minor.
- `feature`: accepted alias for `feat`; prefer `feat` unless matching existing
  project style.
- `fix`: bug fix or correctness fix; appears under `Bug Fixes`; bumps patch.
- `perf`: performance improvement; appears under `Performance Improvements`;
  bumps patch.
- `revert`: revert commit; appears under `Reverts`; bumps patch.

Default hidden types:

- `docs`: documentation-only change.
- `style`: formatting, whitespace, punctuation, or style-only change with no
  behavior change.
- `chore`: general maintenance that should not be in changelog and should not
  bump, used only when no more specific hidden type fits.
- `refactor`: code change that intentionally preserves behavior/API.
- `test`: tests only.
- `build`: build system, packaging, dependency metadata, generated build setup.
- `ci`: CI workflow or automation-only change.

Treat hidden types as no-changelog and no-bump intent. If a code change clearly
must not affect released behavior or API, use a hidden type instead of `fix` or
`feat`, even when source files changed.

Do not use `chore` as a catch-all for every hidden change. Prefer the hidden
type that describes the change most precisely: `build` for package manager,
build tooling, dependency metadata, generated build setup, and workspace
configuration; `ci` for CI-only automation; `test` for tests; `docs` for
documentation; `refactor` for behavior-preserving code restructuring; and
`style` for formatting-only changes.

Do not add `!`, `BREAKING CHANGE`, or `Release-As` to a hidden commit unless the
release impact is intentional. Those signals override the hidden/no-bump intent.

## Impact Heuristics

Choose the type by release impact, not by file path:

- Public behavior added: `feat`.
- Public behavior corrected: `fix`.
- Runtime speed/memory improvement without behavior change: `perf`.
- Internal rewrite with preserved behavior: `refactor`.
- Dependency lockfile/package-manager maintenance, build tooling, generated
  build setup, or workspace package-manager configuration with no shipped
  behavior change: `build`, unless local style strongly prefers another hidden
  type.
- CI-only workflow edits: `ci`.
- Tests added or adjusted without product code impact: `test`.
- Docs/readme/examples prose only: `docs`.
- General housekeeping that does not fit the more specific hidden types:
  `chore`.

When unsure whether a source-code change is user-visible, inspect tests and
public API usage. If the change is defensive cleanup, migration plumbing,
renaming private helpers, lint fixes, or type-only restructuring, prefer a
hidden type.

## Scope Selection

Before choosing a scope, inspect the repository:

```bash
git diff --staged --name-only
git diff --name-only
rg --files -g '*commitlint*' -g '.commitlintrc*' -g 'commitlint.config.*'
rg --files -g 'package.json'
```

Use staged changes first. If nothing is staged, use the working tree diff.

If the project uses commitlint, read its config before choosing a message. The
config may define allowed types, allowed scopes, required casing, max lengths,
and other local formatting rules. Common locations include `.commitlintrc`,
`.commitlintrc.json`, `.commitlintrc.yaml`, `.commitlintrc.yml`,
`.commitlintrc.js`, `.commitlintrc.cjs`, `.commitlintrc.mjs`,
`.commitlintrc.ts`, `commitlint.config.js`, `commitlint.config.cjs`,
`commitlint.config.mjs`, and `commitlint.config.ts`.

Single-repo projects:

- Usually omit the scope.
- Use a scope only when the project already has clear scopes such as `cli`,
  `docs`, `deps`, `release`, or subsystem names.

Monorepos:

- Prefer the affected package name as scope.
- Derive package scopes from workspace package names, existing commitlint
  `scope-enum`, or recent commits.
- If package names are npm-scoped, follow the repo's existing convention:
  either the full package name or the unscoped package segment.
- If one package changed, use that package scope.
- If several packages changed for one shared reason, use a shared scope such as
  `deps`, `dev-deps`, or `release` when that scope adds useful meaning.
- For monorepo-wide release-impacting changes that touch many packages, prefer
  omitting the scope unless the repo requires one. Release tooling usually uses
  the changed packages, not a `global` scope, to decide which packages are
  affected.
- If several packages changed for different reasons, first try to describe the
  common intent honestly. If the only honest message would be vague or hide
  release impact, then suggest separate commits.

For dependency-only work:

- Use `deps` for runtime dependency updates when that is an accepted scope.
- Use `dev-deps` for development-only tooling dependency updates when that is an
  accepted scope.

## Message Construction Workflow

1. Inspect changed files and diff summary.
2. Identify the released behavior impact.
3. Choose visible vs hidden type.
4. Choose the narrowest valid scope.
5. Write the subject as a changelog bullet from the user's perspective when
   visible, or from the maintenance intent when hidden.
6. Add body/footer only when needed for breaking changes, issue closure,
   release-as, or important context.
7. If commitlint is configured and the CLI is available, validate the candidate
   before presenting it to the user.

Validate with the repository package manager when possible:

```bash
echo 'type(scope): subject' | pnpm commitlint
echo 'type(scope): subject' | npm exec commitlint
echo 'type(scope): subject' | npx commitlint
```

Use the actual candidate message in place of the example. For multi-line
messages, use `printf` or another command that preserves the full message
exactly:

```bash
printf '%s\n\n%s\n' 'feat(parser)!: remove legacy token fallback' 'BREAKING CHANGE: custom token fallbacks are no longer applied.' | pnpm commitlint
```

If commitlint fails, adjust the type, scope, case, or subject length and
validate again. If commitlint is configured but the CLI cannot be run in the
current environment, tell the user.

Use issue references naturally:

```text
fix(parser): handle empty commit body refs #123
```

Use closing keywords only when the commit should close an issue:

```text
fix(cli): preserve prerelease tag when appending changelog

Fixes #123.
```

## Examples

Visible release entries:

```text
feat(writer): support scoped package links
fix(parser): keep issue references from multiline footers
perf(git-client): avoid duplicate tag lookups
revert: feat(writer): support scoped package links
```

Hidden no-bump entries:

```text
refactor(conventional-changelog): simplify context defaults
test(writer): cover empty reference groups
docs(conventionalcommits): clarify hidden commit types
build(dev-deps): update oxlint
ci: use node 22 in tests
chore(release): prepare package metadata
```

Monorepo package scopes:

```text
fix(conventional-changelog-writer): preserve reference order
refactor(conventional-commits-parser): split token normalization
test(git-semver-tags): cover lightweight tags
```

## Output Style

When the user asks for a commit message, output only the recommended message
unless they ask for explanation or alternatives. For uncertain impact, provide
two concise options and explain the release consequence:

```text
fix(parser): handle empty commit body
```

or, if no release bump is intended:

```text
refactor(parser): handle empty commit body defensively
```
