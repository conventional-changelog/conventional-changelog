# Standard CHANGELOG

[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url] [![Coverage Status][coverage-image]][coverage-url]

> An opinionated approach to CHANGELOG generation using angular commit conventions.

## Quick Start

```sh
$ npm install -g standard-changelog
$ cd my-project
$ standard-changelog
```

The above generates a changelog based on commits since the last semver tag that match the pattern of a "Feature", "Fix", "Performance Improvement" or "Breaking Changes".

**your first release:**

If you're using this tool for the first time and want to generate new content in CHANGELOG.md, you can run:

```sh
$ standard-changelog --first-release
```

**advanced topics:**

All available command line parameters can be listed using [CLI](#cli) : `standard-changelog --help`.

## Programmatic Usage

```sh
$ npm install --save standard-changelog
```

```js
import standardChangelog from 'standard-changelog';

standardChangelog()
  .pipe(process.stdout); // or any writable stream
```

## CLI

```sh
$ npm install -g standard-changelog
$ standard-changelog --help
```

## API

See the [conventional-changelog](https://github.com/conventional-changelog/conventional-changelog) docs with the angular preset.

## License

MIT

[npm-image]: https://badge.fury.io/js/standard-changelog.svg
[npm-url]: https://npmjs.org/package/standard-changelog
[travis-image]: https://travis-ci.org/conventional-changelog/standard-changelog.svg?branch=master
[travis-url]: https://travis-ci.org/conventional-changelog/standard-changelog
[daviddm-image]: https://david-dm.org/conventional-changelog/standard-changelog.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/conventional-changelog/standard-changelog
[coverage-image]: https://coveralls.io/repos/github/conventional-changelog/conventional-changelog/badge.svg?branch=master
[coverage-url]: https://coveralls.io/github/conventional-changelog/conventional-changelog?branch=master
