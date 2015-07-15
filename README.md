#  [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url] [![Coverage Status][coveralls-image]][coveralls-url]

> Generate a changelog from git metadata


## Why

- Used by AngularJS and related projects.
- Everything internally or externally is Pluggable.
- High performant. It doesn't spawn any extra child process to fetch data.
- Fully configurable. There are several presets that you can use if you just want to use the same conventions. But it is also possible to configure if you want to go down to the nth degree.
- Task runner integrations: [grunt](https://github.com/btford/grunt-conventional-changelog)/[gulp](https://github.com/stevemao/gulp-conventional-changelog).
- Actively maintained.


## Install

```sh
$ npm install conventional-changelog
```

Adapted from code originally written by @vojtajina and @btford in [grunt-conventional-changelog](https://github.com/btford/grunt-conventional-changelog).

*Note:* As 0.1.x this module is rewritten and so the API is not backward compatible. If you are still using 0.0.x please checkout the README in your downloaded package or dig through the old tags.

*Note:* As the next release is still under development and we would like you to help test pre-release features, you can install by typing

```sh
$ npm install conventional-changelog@next
```

[Synopsis of Conventions](conventions)

## Example output

- https://github.com/ajoslin/conventional-changelog/blob/master/CHANGELOG.md
- https://github.com/karma-runner/karma/blob/master/CHANGELOG.md
- https://github.com/btford/grunt-conventional-changelog/blob/master/CHANGELOG.md


## Usage

```js
var conventionalChangelog = require('conventional-changelog');

conventionalChangelog({
  preset: 'angular'
})
  .pipe(process.stdout);
```


## API

### conventionalChangelog([options, [context, [gitRawCommitsOpts, [parserOpts, [writerOpts]]]]])

Returns a readable stream.

#### options

##### preset

Type: `string` Possible values: `'angular'`, `'jquery'`, `'jshint'`

A set of options of a popular project so you don't have to define everything in options, context, gitRawCommitsOpts, parserOpts or writerOpts manually. The preset values can be overwritten.

##### pkg

Type: `string` Default: `'package.json'`

The location of your "package.json".

##### append

Type: `boolean` Default: `false`

Should the log be appended.

##### allBlocks

Type: `boolean` Default: `false`

Set to `true` if you want to generate all blocks of the log. `false` if you just want to generate the current one.

##### warn

Type: `function` Default: `function() {}`

A warn function. EG: `grunt.verbose.writeln`

##### transform

Type: `object` Default: `through.obj()`

A transform stream that applies after the parser and before the writer.

#### context

See the [conventional-changelog-writer](https://github.com/stevemao/conventional-changelog-writer) docs. There are some defaults:

##### host

Default: normalized host found in `package.json`.

##### version

Default: version found in `package.json`.

##### owner

Default: extracted from normalized `package.json` `repository.url` field.

##### repository

Default: extracted from normalized `package.json` `repository.url` field.

#### gitRawCommitsOpts

See the [git-raw-commits](https://github.com/stevemao/git-raw-commits) docs. There are some defaults:

##### format

Default: `'%B%n-hash-%n%H%n-gitTags-%n%d%n-committerDate-%n%ci'`

##### from

Default: latest semver tag if `options.allBlocks` is `false`.

##### reverse

Default: only `true` if `options.append` is truthy.

#### parserOpts

See the [conventional-commits-parser](https://github.com/stevemao/conventional-commits-parser) docs.

#### writerOpts

See the [conventional-changelog-writer](https://github.com/stevemao/conventional-changelog-writer) docs. There are some defaults:

##### reverse

Default: same as `options.append`.

### CLI

```sh
$ npm install -g conventional-changelog
```

```sh
$ conventional-changelog --help

  Generate a changelog from git metadata

  Usage
    conventional-changelog

  Example
    conventional-changelog -i CHANGELOG.md --overwrite

  Options
    -i, --infile              Read the CHANGELOG from this file
    -o, --outfile             Write the CHANGELOG to this file. If unspecified, it prints to stdout
    -w, --overwrite           Overwrite the infile
    -p, --preset              Name of the preset you want to use
    -k, --pkg                 A filepath of where your package.json is located
    -a, --append              Should the generated block be appended
    -b, --all-blocks          Generate all blocks
    -v, --verbose             Verbose output
    -c, --context             A filepath of a javascript that is used to define template variables
    --git-raw-commits-opts    A filepath of a javascript that is used to define git-raw-commits options
    --parser-opts             A filepath of a javascript that is used to define conventional-commits-parser options
    --writer-opts             A filepath of a javascript that is used to define conventional-changelog-writer options
```


## Related

- [conventional-github-releaser](https://github.com/stevemao/conventional-github-releaser) - Make a new GitHub release from git metadata
- [conventional-recommended-bump](https://github.com/stevemao/conventional-recommended-bump) - Get a recommended version bump based on conventional commits


## License

BSD


[npm-image]: https://badge.fury.io/js/conventional-changelog.svg
[npm-url]: https://npmjs.org/package/conventional-changelog
[travis-image]: https://travis-ci.org/ajoslin/conventional-changelog.svg?branch=master
[travis-url]: https://travis-ci.org/ajoslin/conventional-changelog
[daviddm-image]: https://david-dm.org/ajoslin/conventional-changelog.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/ajoslin/conventional-changelog
[coveralls-image]: https://coveralls.io/repos/ajoslin/conventional-changelog/badge.svg
[coveralls-url]: https://coveralls.io/r/ajoslin/conventional-changelog
