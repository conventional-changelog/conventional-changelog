#  [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url] [![Coverage Status][coveralls-image]][coveralls-url]

> [conventional-changelog](https://github.com/ajoslin/conventional-changelog) core

You are probably looking for the [cli](https://github.com/stevemao/conventional-changelog-cli) module. Or use one of the plugins if you are already using the tool:  [grunt](https://github.com/btford/grunt-conventional-changelog)/[gulp](https://github.com/stevemao/gulp-conventional-changelog)/[atom](https://github.com/stevemao/atom-conventional-changelog).


## Usage

```sh
$ npm install --save conventional-changelog-core
```

```js
var conventionalChangelogCore = require('conventional-changelog-core');

conventionalChangelogCore()
  .pipe(process.stdout); // or any writable stream
```


## API

### conventionalChangelogCore([options, [context, [gitRawCommitsOpts, [parserOpts, [writerOpts]]]]])

Returns a readable stream.

#### options

##### config

Type: `object`, `promise` or `function`

If this is an object, it is the config object. The config object should include context, gitRawCommitsOpts, parserOpts and writerOpts.
If this is a promise, it should resolve with the config.
If this is a function, it expects a node style callback with the config object.
The config values can be overwritten.

##### pkg

Type: `object`

###### path

Type: `string` Default: [closest package.json](https://github.com/sindresorhus/read-pkg-up).

The location of your "package.json".

###### transform

Type: `function` Default: pass through.

A function that takes `package.json` data as the argument and returns the modified data. Note this is performed before normalizing package.json data. Useful when you need to add a leading 'v' to your version or modify your repository url, etc.

##### append

Type: `boolean` Default: `false`

Should the log be appended to existing data.

##### releaseCount

Type: `number` Default: `1`

How many releases of changelog you want to generate. It counts from the upcoming release. Useful when you forgot to generate any previous changelog. Set to `0` to regenerate all.

##### warn

Type: `function` Default: `function() {}`

A warn function. EG: `grunt.verbose.writeln`

##### transform

Type: `function` Default: get the version (without leading 'v') from tag and format date.

###### function(commit, cb)

A transform function that applies after the parser and before the writer.

This is the place to modify the parsed commits.

####### commit

The commit from conventional-commits-parser.

####### cb

Callback when you are done.

####### this

`this` arg of through2.

#### context

See the [conventional-changelog-writer](https://github.com/stevemao/conventional-changelog-writer) docs. There are some defaults or changes:

##### host

Default: normalized host found in `package.json`.

##### version

Default: version found in `package.json`.

##### owner

Default: extracted from normalized `package.json` `repository.url` field.

##### repository

Default: extracted from normalized `package.json` `repository.url` field.

##### gitSemverTags

Type: `array`

All git semver tags found in the repository. You can't overwrite this value.

##### previousTag

Type: `string` Default: previous tag or the first commit hash if no previous tag.

##### currentTag

Type: `string` Default: current tag or `'v'` + version if no current tag.

##### packageData

Type: `object`

Your `package.json` data. You can't overwrite this value.

##### linkCompare

Type: `boolean` Default: `true` if `previousTag` and `currentTag` are truthy.

Should link to the page that compares current tag with previous tag?

#### gitRawCommitsOpts

See the [git-raw-commits](https://github.com/stevemao/git-raw-commits) docs. There are some defaults:

##### format

Default: `'%B%n-hash-%n%H%n-gitTags-%n%d%n-committerDate-%n%ci'`

##### from

Default: based on `options.releaseCount`.

##### reverse

Default: only `true` if `options.append` is truthy.

#### parserOpts

See the [conventional-commits-parser](https://github.com/stevemao/conventional-commits-parser) docs.

##### warn

Default: `options.warn`

#### writerOpts

See the [conventional-changelog-writer](https://github.com/stevemao/conventional-changelog-writer) docs. There are some defaults:

##### reverse

Default: `options.append`

### CLI

```sh
$ npm install --global conventional-changelog
$ conventional-changelog --help # for more details
```


## Notes for parent modules

This module has options `append` and `releaseCount`. However, it doesn't read your previous changelog. Reasons being:

1. The old logs is just to be appended or prepended to the newly generated logs, which is a very simple thing that could be done in the parent module.
2. We want it to be very flexible for the parent module. You could create a readable stream from the file or you could just read the file.
3. We want the duty of this module to be very minimum.

So, when you build a parent module, you need to read the old logs and append or prepend to them based on `options.append`. However, if `options.releaseCount` is `0` you need to ignore any previous logs.

Arguments passed to `conventionalChangelog` will be mutated.


## License

MIT


[npm-image]: https://badge.fury.io/js/conventional-changelog-core.svg
[npm-url]: https://npmjs.org/package/conventional-changelog-core
[travis-image]: https://travis-ci.org/stevemao/conventional-changelog-core.svg?branch=master
[travis-url]: https://travis-ci.org/stevemao/conventional-changelog-core
[daviddm-image]: https://david-dm.org/stevemao/conventional-changelog-core.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/stevemao/conventional-changelog-core
[coveralls-image]: https://coveralls.io/repos/stevemao/conventional-changelog-core/badge.svg
[coveralls-url]: https://coveralls.io/r/stevemao/conventional-changelog-core
