#  [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url] [![Coverage Status][coverall-image]][coverall-url]

> Get raw git commits out of your repository using git-log(1)


Adapted from code originally written by @ajoslin in [conventional-changelog](https://github.com/ajoslin/conventional-changelog).


## Install

```sh
$ npm install --save git-raw-commits
```


## Usage

### Use a callback

```js
var gitRawCommits = require('git-raw-commits');

gitRawCommits(options, callback);
```

### Use as a through stream

```js
var gitRawCommits = require('git-raw-commits');

gitRawCommits(options)
  .pipe(...);
```


## API

### gitRawCommits([options], [callback])

Returns a through stream. Stream is split to break on each commit.

#### options

Type: `object`

Please check the available options at http://git-scm.com/docs/git-log.

*NOTE*: for `<revision range>` we can also use `<from>..<to>` pattern, where:

#### from

Type: `string` Default: your latest tag if any; your first commit if no tags found.

#### to

Type: `string` Default: `'HEAD'`

#### callback(err, commits)

##### commits

Type: `array`

An array of raw commits.


## CLI

```sh
$ npm install --global git-raw-commits
```

```sh
$ git-raw-commits --help

  Usage,
    git-raw-commits [<git-log(1)-options>]

  Example
    git-raw-commits --grep unicorn -E --from HEAD~2 --to HEAD^
```


## License

MIT © [Steve Mao](https://github.com/stevemao)


[npm-image]: https://badge.fury.io/js/git-raw-commits.svg
[npm-url]: https://npmjs.org/package/git-raw-commits
[travis-image]: https://travis-ci.org/stevemao/git-raw-commits.svg?branch=master
[travis-url]: https://travis-ci.org/stevemao/git-raw-commits
[daviddm-image]: https://david-dm.org/stevemao/git-raw-commits.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/stevemao/git-raw-commits
[coverall-image]: https://coveralls.io/repos/stevemao/git-raw-commits/badge.svg
[coverall-url]: https://coveralls.io/r/stevemao/git-raw-commits
