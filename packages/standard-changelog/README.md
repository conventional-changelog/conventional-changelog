# Standard CHANGELOG

[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url] [![Coverage Status][coveralls-image]][coveralls-url]

> An opinionated approach to package publishing and CHANGELOG generation using the workflow outlined in [conventional-changelog-cli](hhttps://github.com/conventional-changelog/conventional-changelog-cli#recommended-workflow)

_how does it work?_

1. when you land commits on `master`, select the _Squash and Merge_ option.
2. add a title and body that follows the [conventional-changelog conventions](https://github.com/stevemao/conventional-changelog-angular/blob/master/convention.md).
3. when you're ready to release to npm:
  1. checkout `master`.
  2. run `standard-changelog`.
  3. ~~push and publish: `git push --tags; git push origin master; npm publish`.~~

_`standard-changelog` handles the following:_

1. ~~bumping the version in package.json.~~
2. generating an updated CHANGELOG.md.
3. ~~commiting your _package.json_ and _CHANGELOG.md_.~~
4. ~~tagging a new release.~~

## Quick Start

```sh
$ npm install -g standard-changelog
$ cd my-project
$ standard-changelog
```

_or_

```sh
$ npm install standard-changelog --save-dev
$ cd my-project
```

_add the following to your **package.json:**_

```json
{
  "script": {
    "release": "standard-changelog"
  }
}
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
var standardChangelog = require('standard-changelog');

standardChangelog()
  .pipe(process.stdout); // or any writable stream
```

## CLI

```sh
$ npm install -g standard-changelog
$ standard-changelog --help
```

## API

See the [conventional-changelog](https://github.com/ajoslin/conventional-changelog) docs with the angular preset.

## Related

- [conventional-changelog](https://github.com/conventional-changelog/conventional-changelog) - Generate a changelog from git metadata
- [conventional-github-releaser](https://github.com/conventional-changelog/conventional-github-releaser) - Make a new GitHub release from git metadata
- [conventional-recommended-bump](https://github.com/conventional-changelog/conventional-recommended-bump) - Get a recommended version bump based on conventional commits
- [conventional-commits-detector](https://github.com/conventional-changelog/conventional-commits-detector) - Detect what commit message convention your repository is using
- [commitizen](https://github.com/commitizen/cz-cli) - Simple commit conventions for internet citizens.
- [angular-precommit](https://github.com/ajoslin/angular-precommit) - Pre commit with angular conventions

## License

MIT

[npm-image]: https://badge.fury.io/js/standard-changelog.svg
[npm-url]: https://npmjs.org/package/standard-changelog
[travis-image]: https://travis-ci.org/conventional-changelog/standard-changelog.svg?branch=master
[travis-url]: https://travis-ci.org/conventional-changelog/standard-changelog
[daviddm-image]: https://david-dm.org/conventional-changelog/standard-changelog.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/conventional-changelog/standard-changelog
[coveralls-image]: https://coveralls.io/repos/conventional-changelog/standard-changelog/badge.svg
[coveralls-url]: https://coveralls.io/r/conventional-changelog/standard-changelog
