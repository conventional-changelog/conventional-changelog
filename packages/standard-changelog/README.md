#  [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url] [![Coverage Status][coveralls-image]][coveralls-url]

> Generate a changelog from git metadata with [angular commit convention](https://github.com/stevemao/conventional-changelog-angular/blob/master/convention.md)


## Quick start

```sh
$ npm install -g standard-changelog
$ cd my-project
$ standard-changelog CHANGELOG.md -w
```

This will *not* overwrite any previous changelog. The above generates a changelog based on commits since the last semver tag that match the pattern of a "Feature", "Fix", "Performance Improvement" or "Breaking Changes".

If you first time use this tool and want to generate all previous changelog, you could do

```sh
$ standard-changelog -i CHANGELOG.md -w -r 0
```

This *will* overwrite any previous changelog if exist.

All available command line parameters can be listed using [CLI](#cli) : `standard-changelog --help`.

**Hint:** You can alias your command or add it to your package.json. EG: `"changelog": "standard-changelog -i CHANGELOG.md -w -r 0"`.


## [Recommended workflow](https://github.com/stevemao/conventional-changelog-cli#recommended-workflow)


## Programmatic usage

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

### standardChangelog([options, [context, [gitRawCommitsOpts, [parserOpts, [writerOpts]]]]])

Returns a readable stream.

#### options

See the [standard-changelog-core](https://github.com/stevemao/standard-changelog-core) docs with the angular preset.


## [Notes for parent modules](https://github.com/stevemao/standard-changelog-core#notes-for-parent-modules)


## Related

- [conventional-changelog](https://github.com/ajoslin/conventional-changelog) - Generate a changelog from git metadata
- [conventional-github-releaser](https://github.com/stevemao/conventional-github-releaser) - Make a new GitHub release from git metadata
- [conventional-recommended-bump](https://github.com/stevemao/conventional-recommended-bump) - Get a recommended version bump based on conventional commits
- [conventional-commits-detector](https://github.com/stevemao/conventional-commits-detector) - Detect what commit message convention your repository is using
- [commitizen](https://github.com/commitizen/cz-cli) - Simple commit conventions for internet citizens.
- [angular-precommit](https://github.com/ajoslin/angular-precommit) - Pre commit with angular conventions


## License

MIT


[npm-image]: https://badge.fury.io/js/standard-changelog.svg
[npm-url]: https://npmjs.org/package/standard-changelog
[travis-image]: https://travis-ci.org/stevemao/standard-changelog.svg?branch=master
[travis-url]: https://travis-ci.org/stevemao/standard-changelog
[daviddm-image]: https://david-dm.org/stevemao/standard-changelog.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/stevemao/standard-changelog
[coveralls-image]: https://coveralls.io/repos/stevemao/standard-changelog/badge.svg
[coveralls-url]: https://coveralls.io/r/stevemao/standard-changelog
