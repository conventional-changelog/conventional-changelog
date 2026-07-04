# conventional-changelog

[![ESM-only package][package]][package-url]
[![NPM version][npm]][npm-url]
[![Node version][node]][node-url]
[![Dependencies status][deps]][deps-url]
[![Install size][size]][size-url]
[![Build status][build]][build-url]
[![Coverage status][coverage]][coverage-url]

[package]: https://img.shields.io/badge/package-ESM--only-ffe536.svg
[package-url]: https://nodejs.org/api/esm.html

[npm]: https://img.shields.io/npm/v/conventional-changelog.svg
[npm-url]: https://npmjs.com/package/conventional-changelog

[node]: https://img.shields.io/node/v/conventional-changelog.svg
[node-url]: https://nodejs.org

[deps]: https://img.shields.io/librariesio/release/npm/conventional-changelog
[deps-url]: https://libraries.io/npm/conventional-changelog

[size]: https://packagephobia.com/badge?p=conventional-changelog
[size-url]: https://packagephobia.com/result?p=conventional-changelog

[build]: https://img.shields.io/github/actions/workflow/status/conventional-changelog/conventional-changelog/tests.yaml?branch=master
[build-url]: https://github.com/conventional-changelog/conventional-changelog/actions

[coverage]: https://coveralls.io/repos/github/conventional-changelog/conventional-changelog/badge.svg?branch=master
[coverage-url]: https://coveralls.io/github/conventional-changelog/conventional-changelog?branch=master

Generate a changelog from git metadata.

*[Changelog?](https://speakerdeck.com/stevemao/compose-a-changelog)*

> [!NOTE]
> You don't have to use the angular commit convention. For the best result of the tool to tokenize your commit and produce flexible output, it's recommended to use a commit convention.

## Install

Install `conventional-changelog` along with the preset you want to use, for example `angular`:

```bash
# pnpm
pnpm add conventional-changelog conventional-changelog-angular
# yarn
yarn add conventional-changelog conventional-changelog-angular
# npm
npm i conventional-changelog conventional-changelog-angular
```

## Usage

Pass the preset name with `-p`:

```sh
conventional-changelog -p angular
```

This will *not* overwrite any previous changelogs. The above generates a changelog based on commits since the last semver tag that matches the pattern of "Feature", "Fix", "Performance Improvement" or "Breaking Changes".

All available command line parameters can be listed using CLI: `conventional-changelog --help`.

JS API is also available:

```js
import { ConventionalChangelog } from 'conventional-changelog'

const generator = new ConventionalChangelog()
  .readPackage()
  .loadPreset('angular')

generator
  .writeStream()
  .pipe(process.stdout)
```

## Documentation

For comprehensive guides, CLI options, and API reference, visit the [documentation website](https://conventional-changelog.js.org/conventional-changelog/).

## License

MIT
