#  [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url] [![Coverage Status][coverall-image]][coverall-url]

> Get a recommended version bump based on conventional commits

Got the idea from https://github.com/ajoslin/conventional-changelog/pull/29

## Install

```sh
$ npm install --save conventional-recommended-bump
```


## Usage

```js
var conventionalRecommendedBump = require('conventional-recommended-bump');

conventionalRecommendedBump({
  conventionalRecommendedBump({
    preset: 'angular'
  }, function(err, releaseAs) {
    console.log(releaseAs);
  });
});
```

```sh
$ npm install --global conventional-recommended-bump
$ conventional-recommended-bump --help

  Get a recommended version bump based on conventional commits

  Usage
    conventional-recommended-bump

  Example
    conventional-recommended-bump
  Options
    -p, --preset                   Name of the preset you want to use
    -h, --header-pattern           Regex to match header pattern
    -c, --header-correspondence    Comma separated parts used to define what capturing group of headerPattern captures what
    -r, --reference-actions        Comma separated keywords that used to reference issues
    -i, --issue-prefixes           Comma separated prefixes of an issue
    -n, --note-keywords            Comma separated keywords for important notes
    -f, --field-pattern            Regex to match other fields
    -v, --verbose                  Verbose output
```


## API

### conventionalRecommendedBump([options, [parserOpts]], [callback])

#### options

##### preset

Type: `string` Possible values: `'angular'`

A set of options of a popular project.

##### whatBump

Type: `function`

A function that takes parsed commits as argument and returns a number indicating what bump it should be.

###### whatBump(commits)

####### commits

Type: `array`

An array of parsed commits. The commits are from last semver tag to `HEAD` and is parsed by [conventional-commits-parser](https://github.com/stevemao/conventional-commits-parser).

If it returns `0` it will be a `major` bump. If `1`, `minor` bump. If `2`, `patch`.

#### parserOpts

See the [conventional-commits-parser](https://github.com/stevemao/conventional-commits-parser) docs.

#### callback

Type: `function`

##### callback(error, releaseAs)

###### releaseAs

Type: `string` Possible values: `'major'`, `'minor'` and `'patch'`

The value of what it should release as. If it cannot decide this is an empty string.


## Related

- [conventional-changelog](https://github.com/ajoslin/conventional-changelog) - Generate a changelog from git metadata


## License

MIT © [Steve Mao](https://github.com/stevemao)


[npm-image]: https://badge.fury.io/js/conventional-recommended-bump.svg
[npm-url]: https://npmjs.org/package/conventional-recommended-bump
[travis-image]: https://travis-ci.org/stevemao/conventional-recommended-bump.svg?branch=master
[travis-url]: https://travis-ci.org/stevemao/conventional-recommended-bump
[daviddm-image]: https://david-dm.org/stevemao/conventional-recommended-bump.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/stevemao/conventional-recommended-bump
[coverall-image]: https://coveralls.io/repos/stevemao/conventional-recommended-bump/badge.svg
[coverall-url]: https://coveralls.io/r/stevemao/conventional-recommended-bump
