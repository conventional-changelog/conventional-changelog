# conventional-changelog-conventionalcommits

[![ESM-only package][package]][package-url]
[![NPM version][npm]][npm-url]
[![Node version][node]][node-url]
[![Dependencies status][deps]][deps-url]
[![Install size][size]][size-url]
[![Build status][build]][build-url]
[![Coverage status][coverage]][coverage-url]

[package]: https://img.shields.io/badge/package-ESM--only-ffe536.svg
[package-url]: https://nodejs.org/api/esm.html

[npm]: https://img.shields.io/npm/v/conventional-changelog-conventionalcommits.svg
[npm-url]: https://npmjs.com/package/conventional-changelog-conventionalcommits

[node]: https://img.shields.io/node/v/conventional-changelog-conventionalcommits.svg
[node-url]: https://nodejs.org

[deps]: https://img.shields.io/librariesio/release/npm/conventional-changelog-conventionalcommits
[deps-url]: https://libraries.io/npm/conventional-changelog-conventionalcommits

[size]: https://packagephobia.com/badge?p=conventional-changelog-conventionalcommits
[size-url]: https://packagephobia.com/result?p=conventional-changelog-conventionalcommits

[build]: https://img.shields.io/github/actions/workflow/status/conventional-changelog/conventional-changelog/tests.yaml?branch=master
[build-url]: https://github.com/conventional-changelog/conventional-changelog/actions

[coverage]: https://coveralls.io/repos/github/conventional-changelog/conventional-changelog/badge.svg?branch=master
[coverage-url]: https://coveralls.io/github/conventional-changelog/conventional-changelog?branch=master

A concrete implementation of the specification described at [conventionalcommits.org](https://conventionalcommits.org/) for automated CHANGELOG generation and version management.

## Install

```bash
# yarn
yarn add -D conventional-changelog-conventionalcommits
# pnpm
pnpm add -D conventional-changelog-conventionalcommits
# npm
npm i -D conventional-changelog-conventionalcommits
```

## Indirect Usage (as preset)

Use the [Conventional Changelog CLI Usage](https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog#usage) with the `-p conventionalcommits` option.

## Direct Usage (as a base preset so you can customize it)

If you want to use this package directly and pass options, you can use the [Conventional Changelog CLI Usage](https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog#usage) and with the `--config` or `-n` parameter, pass a js config that looks like this:

```js
import createPreset from 'conventional-changelog-conventionalcommits'

const config = createPreset({
  issuePrefixes: ['TEST-'],
  formatIssueUrl: (_context, reference) => `https://myBugTracker.com/${reference.prefix}${reference.issue}`
})
// do something with the config
```

or json config like that:

```json
{
  "options": {
    "preset": {
      "name": "conventionalcommits",
      "issuePrefixes": ["TEST-"]
    }
  }
}
```

This last json config way passes the `preset` object to the `conventional-changelog-preset-loader` package, that in turn, passes this same `preset` object as the config for the `conventional-changelog-conventionalcommits`.

See [conventional-changelog-config-spec](https://github.com/conventional-changelog/conventional-changelog-config-spec) for available configuration options.

## Specific Options

| Option | Description |
|--------|-------------|
| ignoreCommits | Regular expression to match and exclude raw commits before parsing. |
| issuePrefixes | Array of issue prefixes parsed as issue references. Defaults to `['#']`. |
| types | Array of commit type objects defining sections, release effects, and optional scope-specific type handling. Default value is available via the `DEFAULT_COMMIT_TYPES` export. |
| scope | String or array of scope names to filter commits. Only commits with matching scopes will be included. When `scopeOnly` is `false` (default), commits without any scope are also included. |
| scopeOnly | When `true` and `scope` is specified, excludes commits that have no scope. When `false` (default), includes both scoped and unscooped commits when filtering by scope. |
| preMajor | When `true`, breaking changes and features are downgraded by one semver level before the first major release. |
| formatIssueUrl | Function that formats issue reference URLs. Receives `(context, reference)`. |
| formatCommitUrl | Function that formats commit URLs. Receives `(context, commit)`. |
| formatCompareUrl | Function that formats release comparison URLs. Receives `(context)`. |
| formatUserUrl | Function that formats user mention URLs. Receives `(context, user)`. |

Each item in `types` can define an `effect`:

| Effect | Changelog | Version bump |
|--------|-----------|--------------|
| `bump` | Included | Included |
| `changelog` | Included | Ignored |
| `hidden` | Hidden | Ignored |

`effect` defaults to `bump` when omitted. Breaking changes always trigger a major bump and are included in the changelog regardless of the type effect.
