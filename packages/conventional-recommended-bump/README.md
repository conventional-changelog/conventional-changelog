#  [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url] [![Coverage Status][coverall-image]][coverall-url]

> Get a recommended version bump based on conventional commits.

Got the idea from https://github.com/conventional-changelog/conventional-changelog/pull/29

## Install

```bash
npm install conventional-recommended-bump
```

## Usage

```javascript
const conventionalRecommendedBump = require(`conventional-recommended-bump`);

conventionalRecommendedBump({
  preset: `angular`
}, (error, recommendation) => {
  console.log(recommendation.releaseType); // 'major'
});
```

```bash
npm install --global conventional-recommended-bump
conventional-recommended-bump --help
```

## API

```javascript
conventionalRecommendedBump(options, [parserOpts,] callback);
```

`parserOpts` is optional.

In the case you don't want to provide `parserOpts`, then `callback` must be provided as the second argument.

#### options

`options` is an object with the following properties:

* ignoreReverted
* preset
* config
* whatBump

##### ignoreReverted

**Type:** `boolean` **Default:** `true`

If `true`, reverted commits will be ignored.

##### preset

**Type:** `string`

It's recommended to use a preset so you don't have to define everything yourself.

The value is passed to [`conventional-changelog-preset-loader`](https://www.npmjs.com/package/conventional-changelog-preset-loader).

##### config

**Type:** `object`

This should serve as default values for other arguments of `conventional-recommended-bump` so you don't need to rewrite the same or similar config across your projects.

**NOTE:** `config` option will be overwritten by the value loaded by `conventional-changelog-preset-loader` if the `preset` options is set.

##### whatBump

**Type:** `function`

A function that takes parsed commits as an argument.

```javascript
whatBump(commits) {};
```

`commits` is an array of all commits from last semver tag to `HEAD` as parsed by [conventional-commits-parser](https://github.com/conventional-changelog/conventional-commits-parser)

This should return an object including but not limited to `level` and `reason`. `level` is a `number` indicating what bump it should be and `reason` is the reason of such release.

##### tagPrefix

**Type:** `string`

Specify a prefix for the git tag that will be taken into account during the comparison.

For instance if your version tag is prefixed by `version/` instead of `v` you would specifying `--tagPrefix=version/` using the CLI, or `version/` as the value of the `tagPrefix` option.

##### lernaPackage

**Type:** `string`

Specify the name of a package in a [Lerna](https://lernajs.io/)-managed repository. The package name will be used when fetching all changes to a package since the last time that package was released.

For instance if your project contained a package named `conventional-changelog`, you could have only commits that have happened since the last release of `conventional-changelog` was tagged by specifying `--lernaPackage=conventional-changelog` using the CLI, or `conventional-changelog` as the value of the `lernaPackage` option.

#### parserOpts

**Type:** `object`

See the [conventional-commits-parser](https://github.com/conventional-changelog/conventional-commits-parser) documentation for available options.

#### callback

**Type:** `function`

```javascript
callback(error, recommendation) {};
```

`recommendation` is an `object` with a single property, `releaseType`.

`releaseType` is a `string`: Possible values: `major`, `minor` and `patch`, or `undefined` if `whatBump` does not return sa valid `level` property, or the `level` property is not set by `whatBump`.

## License

MIT © [Steve Mao](https://github.com/stevemao)

[npm-image]: https://badge.fury.io/js/conventional-recommended-bump.svg
[npm-url]: https://npmjs.org/package/conventional-recommended-bump
[travis-image]: https://travis-ci.org/conventional-changelog/conventional-recommended-bump.svg?branch=master
[travis-url]: https://travis-ci.org/conventional-changelog/conventional-recommended-bump
[daviddm-image]: https://david-dm.org/conventional-changelog/conventional-recommended-bump.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/conventional-changelog/conventional-recommended-bump
[coverall-image]: https://coveralls.io/repos/conventional-changelog/conventional-recommended-bump/badge.svg
[coverall-url]: https://coveralls.io/r/conventional-changelog/conventional-recommended-bump
