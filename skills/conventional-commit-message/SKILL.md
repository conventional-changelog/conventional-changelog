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

Use the Conventional Commits 1.0.0 message structure:

```text
<type>[optional scope][optional !]: <description>

[optional body]

[optional footer(s)]
```

Rules:

- `type` is required and is followed by an optional parenthesized `scope`, an
  optional `!`, and `: `.
- `description` is required immediately after `: `. Keep it concise,
  changelog-ready, and lower-case unless a proper noun or identifier requires
  casing. Do not end it with a period.
- `scope` is optional and should name a section of the codebase.
- A longer body is optional, starts one blank line after the description, and is
  free-form.
- Footers are optional, start one blank line after the body or description, and
  each use either `Token: value` or `Token #value`.
- Footer tokens use hyphens instead of spaces, such as `Reviewed-by`, except
  for `BREAKING CHANGE`. `BREAKING-CHANGE` is synonymous with `BREAKING CHANGE`.
- Footer values may contain spaces and newlines. A footer value ends when the
  next valid footer token and separator is observed.
- Conventional Commit units are not case-sensitive, except `BREAKING CHANGE`,
  which must be uppercase when used as that footer token.
- Prefer one commit per coherent change. If one diff contains unrelated release
  visible changes, recommend splitting it.
- Write the description so it reads well as a bullet in a generated changelog.
  Avoid vague implementation notes like `add some feature`, `update stuff`, or
  `fix issue`. Prefer user-facing outcomes such as `support custom scopes`,
  `preserve prerelease tags`, or `require Node.js 22`.
- Active verb phrases are usually better than passive sentences. Prefer
  `support custom scopes` over `custom scopes were added` unless passive voice
  is clearly more natural for the project.

Breaking changes are indicated by `!` immediately before `:` in the header or by
a breaking-change footer. Use the footer when the impact is known:

```text
feat(parser)!: remove legacy token fallback

BREAKING CHANGE: custom token fallbacks are no longer applied during parsing.
```

If `!` is used and no breaking-change footer is provided, the description is
used to describe the breaking change.

## Type Selection

Default visible types:

- `feat`: user-facing feature; appears under `Features`; bumps minor. Use this
  when a commit adds a new feature.
- `feature`: accepted alias for `feat`; prefer `feat` unless matching existing
  project style.
- `fix`: bug fix or correctness fix; appears under `Bug Fixes`; bumps patch.
  Use this when a commit represents a bug fix.
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

Types other than `feat` and `fix` are allowed by the Conventional Commits
specification, but the spec gives them no implicit SemVer effect unless they
include a breaking-change marker. This repository's preset assigns additional
visibility and bump behavior through its configured commit types.

Do not use `chore` as a catch-all for every hidden change. Prefer the hidden
type that describes the change most precisely: `build` for package manager,
build tooling, dependency metadata, generated build setup, and workspace
configuration; `ci` for CI-only automation; `test` for tests; `docs` for
documentation; `refactor` for behavior-preserving code restructuring; and
`style` for formatting-only changes.

Do not add `!`, `BREAKING CHANGE`, or `Release-As` to a hidden commit unless the
release impact is intentional. Those signals override the hidden/no-bump intent.

Before choosing a hidden type, first ask whether the diff changes the public
contract of any published package, even if the changed files are metadata,
configuration, tests, generated files, or CI. Public contract includes supported
runtime and platform versions, package exports, CLI behavior, config presets,
peer dependency requirements, generated output, documented APIs, and default
behavior. If the public contract becomes stricter, removes previously supported
usage, or changes user-visible behavior, use a visible type. If previously
supported usage no longer works, use `!` and a `BREAKING CHANGE` footer.

Common red flags for release-visible or breaking impact:

- Raising minimum runtime, platform, browser, or engine support.
- Removing, renaming, or narrowing package exports, entry points, CLI flags,
  options, config presets, or documented APIs.
- Tightening peer dependency ranges or required external tools.
- Changing generated output, defaults, validation rules, parsing behavior, or
  lint/config rules that consumers receive.

## Impact Heuristics

Choose the type by release impact, not by file path:

- Public behavior added: `feat`.
- Public behavior corrected: `fix`.
- Runtime speed/memory improvement without behavior change: `perf`.
- Public contract made stricter or previously supported usage removed:
  `feat!` or `fix!` with a `BREAKING CHANGE` footer. Example: raising
  `engines.node` to Node.js 22 should use a subject like `require Node.js 22`.
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
- If commitlint or local tooling supports multiple scopes and one coherent
  release-visible change affects several published packages, use all affected
  package scopes instead of collapsing the change to one package.
- Prefer the repository's accepted multiple-scope separator. If local config
  enables multiple scopes but does not make the separator obvious, validate a
  comma-separated scope list with commitlint before using it.
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
7. If the work is explicitly tied to an issue, PR, bug report, or user-provided
   tracker URL, include the relevant reference in the commit body/footer.
   For fixes that should close the issue, use a closing footer such as
   `Fixes #123.`. For non-closing context, use a non-closing reference such as
   `Refs #123.`.
8. If commitlint is configured and the CLI is available, validate the candidate
   before presenting it to the user.

Validate with the local installed commitlint binary first when possible. Prefer
`./node_modules/.bin/commitlint` over package-manager runners because it avoids
package manager environment, sandbox, and registry behavior while still using
the repository's installed version and config.

```bash
echo 'type(scope): subject' | ./node_modules/.bin/commitlint
```

Use package-manager runners only as fallback when the local binary is missing
and running them is acceptable in the current environment:

```bash
echo 'type(scope): subject' | pnpm commitlint
echo 'type(scope): subject' | npm exec commitlint
echo 'type(scope): subject' | npx commitlint
```

Use the actual candidate message in place of the example. For multi-line
messages, use `printf` or another command that preserves the full message
exactly:

```bash
printf '%s\n\n%s\n' 'feat(parser)!: remove legacy token fallback' 'BREAKING CHANGE: custom token fallbacks are no longer applied.' | ./node_modules/.bin/commitlint
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

For coherent changes affecting multiple packages in a monorepo, use multiple
scopes when supported by the repository:

```text
fix(package-a,package-b): preserve compare links

Fixes #123.
```

## Examples

Visible release entries:

```text
feat(writer): support scoped package links
feat!: require Node.js 22
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
test(git-client): cover lightweight tags
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
