#  [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url] [![Coverage Status][coveralls-image]][coveralls-url]

> Generate a changelog from git metadata

You are probably looking for the [cli](https://github.com/stevemao/conventional-changelog-cli) module. Or use one of the plugins if you are already using the tool:  [grunt](https://github.com/btford/grunt-conventional-changelog)/[gulp](https://github.com/stevemao/gulp-conventional-changelog)/[atom](https://github.com/stevemao/atom-conventional-changelog).


## Usage

```sh
$ npm install --save conventional-changelog
```

```js
var conventionalChangelog = require('conventional-changelog');

conventionalChangelog({
  preset: 'angular'
})
  .pipe(process.stdout); // or any writable stream
```


## API

### conventionalChangelog([options, [context, [gitRawCommitsOpts, [parserOpts, [writerOpts]]]]])

Returns a readable stream.

#### options

See the [conventional-changelog-core](https://github.com/stevemao/conventional-changelog-core) docs. The API is the same with the following changes or additions:

##### preset

Type: `string` Possible values: `'angular', 'atom', 'codemirror', 'ember', 'eslint', 'express', 'jquery', 'jscs', 'jshint'`

It's recommended to use a preset so you don't have to define everything yourself. `options.config` will be set to this value.


## [Notes for parent modules](https://github.com/stevemao/conventional-changelog-core#notes-for-parent-modules)


## Related

- [conventional-github-releaser](https://github.com/stevemao/conventional-github-releaser) - Make a new GitHub release from git metadata
- [conventional-recommended-bump](https://github.com/stevemao/conventional-recommended-bump) - Get a recommended version bump based on conventional commits
- [conventional-commits-detector](https://github.com/stevemao/conventional-commits-detector) - Detect what commit message convention your repository is using
- [commitizen](https://github.com/commitizen/cz-cli) - Simple commit conventions for internet citizens.
- [angular-precommit](https://github.com/ajoslin/angular-precommit) - Pre commit with angular conventions


## License

MIT


[npm-image]: https://badge.fury.io/js/conventional-changelog.svg
[npm-url]: https://npmjs.org/package/conventional-changelog
[travis-image]: https://travis-ci.org/ajoslin/conventional-changelog.svg?branch=master
[travis-url]: https://travis-ci.org/ajoslin/conventional-changelog
[daviddm-image]: https://david-dm.org/ajoslin/conventional-changelog.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/ajoslin/conventional-changelog
[coveralls-image]: https://coveralls.io/repos/ajoslin/conventional-changelog/badge.svg
[coveralls-url]: https://coveralls.io/r/ajoslin/conventional-changelog
