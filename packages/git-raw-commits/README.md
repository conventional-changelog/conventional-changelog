#  [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-url]][daviddm-image]

> Get raw git commits out of your repository using git-log(1)


Adapted from code originally written by @ajoslin in [conventional-changelog](https://github.com/ajoslin/conventional-changelog).


## Install

```sh
$ npm install --save git-raw-commits
```


## Usage

```js
var gitRawCommits = require('git-raw-commits');

gitRawCommits(options, callback);
```


## API

### gitRawCommits([options], callback)

#### options

Type: `object`

Please check the available options at http://git-scm.com/docs/git-log.

*NOTE*: for `<revision range>` we can also use `<from>..<to>` pattern, where:

#### from

Type: `string` defaults to your latest tag

If you have no tag it will ignore `to` and get the whole commits

#### to

Type: `string` defaults to 'HEAD'

Only used if `from` is truthy

#### callback(err, commits)

##### commits

Type: `array`

An array of raw commits


## CLI

```sh
$ npm install --global git-raw-commits
```

```
$ git-raw-commits --help

  Usage,
    git-raw-commits <git-log options>

  Example
    git-raw-commits --grep unicorn -E --from HEAD~2 --to HEAD^
```


## License

MIT © [Steve Mao](https://github.com/stevemao)


[npm-url]: https://npmjs.org/package/git-raw-commits
[npm-image]: https://badge.fury.io/js/git-raw-commits.svg
[travis-url]: https://travis-ci.org/stevemao/git-raw-commits
[travis-image]: https://travis-ci.org/stevemao/git-raw-commits.svg?branch=master
[daviddm-url]: https://david-dm.org/stevemao/git-raw-commits.svg?theme=shields.io
[daviddm-image]: https://david-dm.org/stevemao/git-raw-commits
