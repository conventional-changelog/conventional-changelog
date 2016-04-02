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
  preset: 'angular'
}, function(err, releaseAs) {
  console.log(releaseAs);
  //=> 'major'
});
```

```sh
$ npm install --global conventional-recommended-bump
$ conventional-recommended-bump --help
```


## API

### conventionalRecommendedBump(options, [parserOpts], [callback])

#### options

##### ignoreReverted

Type: `boolean` Default: `true`

If `true`, reverted commits will be ignored.

##### preset

Type: `string` Possible values: `'angular'`

A set of options of a popular project.

##### whatBump

Type: `function`

A function that takes parsed commits as argument.

Return an object including `level` and `reason`. level is a `number` indicating what bump it should be and `reason` is the reason of such release.

For backward compatibility, it could return a `number` indicating what bump it should be.

###### whatBump(commits)

####### commits

Type: `array`

An array of parsed commits. The commits are from last semver tag to `HEAD` and is parsed by [conventional-commits-parser](https://github.com/stevemao/conventional-commits-parser).

If it returns `0` it will be a `major` bump. If `1`, `minor` bump. If `2`, `patch`.

#### parserOpts

See the [conventional-commits-parser](https://github.com/stevemao/conventional-commits-parser) docs.

#### callback

Type: `function`

##### callback(error, object)

###### object

object includes what's returned by `whatBump` and

####### releaseAs

Type: `string` Possible values: `'major'`, `'minor'` and `'patch'`

The value of what it should release as.


## Related

- [conventional-github-releaser](https://github.com/stevemao/conventional-github-releaser) - Make a new GitHub release from git metadata
- [conventional-changelog](https://github.com/stevemao/conventional-changelog-cli) - Generate a changelog from git metadata
- [conventional-commits-detector](https://github.com/stevemao/conventional-commits-detector) - Detect what commit message convention your repository is using
- [semantic-release](https://github.com/semantic-release/semantic-release) - fully automated package publishing


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
