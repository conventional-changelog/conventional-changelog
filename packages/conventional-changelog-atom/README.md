# conventional-changelog-atom

[![NPM version][npm]][npm-url]
[![Node version][node]][node-url]
[![Dependencies status][deps]][deps-url]
[![Build status][build]][build-url]
[![Coverage status][coverage]][coverage-url]

[npm]: https://img.shields.io/npm/v/conventional-changelog-atom.svg
[npm-url]: https://npmjs.com/package/conventional-changelog-atom

[node]: https://img.shields.io/node/v/conventional-changelog-atom.svg
[node-url]: https://nodejs.org

[deps]: https://img.shields.io/librariesio/release/npm/conventional-changelog-atom
[deps-url]: https://libraries.io/npm/conventional-changelog-atom/tree

[build]: https://img.shields.io/github/actions/workflow/status/conventional-changelog/conventional-changelog/ci.yaml?branch=master
[build-url]: https://github.com/conventional-changelog/conventional-changelog/actions

[coverage]: https://coveralls.io/repos/github/conventional-changelog/conventional-changelog/badge.svg?branch=master
[coverage-url]: https://coveralls.io/github/conventional-changelog/conventional-changelog?branch=master

[conventional-changelog](https://github.com/conventional-changelog/conventional-changelog) [atom](https://github.com/atom/atom) preset.

**Issues with the convention itself should be reported on the Atom issue tracker.**

## Install

```bash
# yarn
yarn add -D conventional-changelog-atom
# pnpm
pnpm add -D conventional-changelog-atom
# npm
npm i -D conventional-changelog-atom
```

## Atom Convention

### Git Commit Messages

* Use the present tense ("Add feature" not "Added feature")
* Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
* Limit the first line to 72 characters or less
* Reference issues and pull requests liberally
* Consider starting the commit message with an applicable emoji:
    * :art: `:art:` when improving the format/structure of the code
    * :racehorse: `:racehorse:` when improving performance
    * :non-potable_water: `:non-potable_water:` when plugging memory leaks
    * :memo: `:memo:` when writing docs
    * :penguin: `:penguin:` when fixing something on Linux
    * :apple: `:apple:` when fixing something on Mac OS
    * :checkered_flag: `:checkered_flag:` when fixing something on Windows
    * :bug: `:bug:` when fixing a bug
    * :fire: `:fire:` when removing code or files
    * :green_heart: `:green_heart:` when fixing the CI build
    * :white_check_mark: `:white_check_mark:` when adding tests
    * :lock: `:lock:` when dealing with security
    * :arrow_up: `:arrow_up:` when upgrading dependencies
    * :arrow_down: `:arrow_down:` when downgrading dependencies
    * :shirt: `:shirt:` when removing linter warnings

Based on https://github.com/atom/atom/blob/master/CONTRIBUTING.md#git-commit-messages
