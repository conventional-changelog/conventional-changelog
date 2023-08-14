# conventional-changelog-ember

[![NPM version][npm]][npm-url]
[![Node version][node]][node-url]
[![Dependencies status][deps]][deps-url]
[![Build status][build]][build-url]
[![Coverage status][coverage]][coverage-url]

[npm]: https://img.shields.io/npm/v/conventional-changelog-ember.svg
[npm-url]: https://npmjs.com/package/conventional-changelog-ember

[node]: https://img.shields.io/node/v/conventional-changelog-ember.svg
[node-url]: https://nodejs.org

[deps]: https://img.shields.io/librariesio/release/npm/conventional-changelog-ember
[deps-url]: https://libraries.io/npm/conventional-changelog-ember/tree

[build]: https://img.shields.io/github/actions/workflow/status/conventional-changelog/conventional-changelog/ci.yaml?branch=master
[build-url]: https://github.com/conventional-changelog/conventional-changelog/actions

[coverage]: https://coveralls.io/repos/github/conventional-changelog/conventional-changelog/badge.svg?branch=master
[coverage-url]: https://coveralls.io/github/conventional-changelog/conventional-changelog?branch=master

[conventional-changelog](https://github.com/conventional-changelog/conventional-changelog) [ember](https://github.com/emberjs/ember.js) preset.

**Issues with the convention itself should be reported on the Ember issue tracker.**

## Install

```bash
# yarn
yarn add -D conventional-changelog-ember
# pnpm
pnpm add -D conventional-changelog-ember
# npm
npm i -D conventional-changelog-ember
```

## Ember Convention

Please use an appropriate commit prefix.
If your pull request fixes an issue specify it in the commit message. Some examples:

  ```
  [DOC beta] Update CONTRIBUTING.md for commit prefixes
  [FEATURE query-params-new] Message
  [BUGFIX beta] Message
  [SECURITY CVE-111-1111] Message
  ```

## Commit Tagging

All commits should be tagged. Tags are denoted by square brackets (`[]`) and come at the start of the commit message.

`Tag` should not be confused with git tag.
`Message` should not be confused with git commit message.

### Bug Fixes

In general bug fixes are pulled into the beta branch. As such, the prefix is: `[BUGFIX beta]`. If a bug fix is a serious regression that requires a new patch release, `[BUGFIX release]` can be used instead.

For bugs related to canary features, follow the prefixing rules for features.

### Cleanup

Cleanup commits are for removing deprecated functionality and should be tagged
as `[CLEANUP beta]`.

### Features

All additions and fixes for features in canary should be tagged as `[FEATURE name]` where name is the same as the flag for that feature.

### Documentation

Documentation commits are tagged as `[DOC channel]` where channel is `canary`,
`beta`, or `release`. If no release is provided `canary` is assumed. The channel should be the most stable release that this documentation change applies to.

### Security

Security commits will be tagged as `[SECURITY cve]`. Please do not submit security related PRs without coordinating with the security team. See the [Security Policy](http://emberjs.com/security/) for more information.

### Other

In general almost all commits should fall into one of these categories. In the cases where they don't please submit your PR untagged. An Ember contributor will let you know if tagging is required.

Based on https://github.com/emberjs/ember.js/blob/master/CONTRIBUTING.md
