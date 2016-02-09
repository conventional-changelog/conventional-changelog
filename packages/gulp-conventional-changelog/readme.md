# gulp-conventional-changelog [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url] [![Coverage Status][coveralls-image]][coveralls-url]

> Generate a changelog using [conventional-changelog](https://github.com/ajoslin/conventional-changelog)

*Issues with the output should be reported on the `conventional-changelog` [issue tracker](https://github.com/ajoslin/conventional-changelog/issues).*

Checkout the [gulp official recipe](https://github.com/gulpjs/gulp/blob/master/docs/recipes/automate-release-workflow.md) to automate releases with gulp and gulp-conventional-changelog.


## Install

```
$ npm install --save-dev gulp-conventional-changelog
```


## Usage

### streaming mode

```js
var gulp = require('gulp');
var conventionalChangelog = require('gulp-conventional-changelog');

gulp.task('default', function () {
  return gulp.src('CHANGELOG.md', {
    buffer: false
  })
    .pipe(conventionalChangelog({
      preset: 'angular'
    }))
    .pipe(gulp.dest('./'));
});
```

### buffer mode

```js
var gulp = require('gulp');
var conventionalChangelog = require('gulp-conventional-changelog');

gulp.task('default', function () {
  return gulp.src('CHANGELOG.md')
    .pipe(conventionalChangelog({
      preset: 'angular'
    }))
    .pipe(gulp.dest('./'));
});
```

**Note:** If your `options.releaseCount` is `0` (regenerate all changelog from previous releases) you can just use [conventional-changelog](https://github.com/ajoslin/conventional-changelog) directly or not to read the file at all.

```js
var gulp = require('gulp');
var conventionalChangelog = require('conventional-changelog');
var fs = require('fs');

gulp.task('default', function () {
  return conventionalChangelog({
    preset: 'angular',
    releaseCount: 0
  })
    .pipe(fs.createWriteStream('CHANGELOG.md'));
});
```

Or

```js
var gulp = require('gulp');
var conventionalChangelog = require('gulp-conventional-changelog');

gulp.task('default', function () {
  return gulp.src('CHANGELOG.md', {
    read: false
  })
    .pipe(conventionalChangelog({
      preset: 'angular',
      releaseCount: 0
    }))
    .pipe(gulp.dest('./'));
});
```


## API

See the [conventional-changelog](https://github.com/ajoslin/conventional-changelog) docs.

There are some changes:

### changelogOpts

#### warn

If the cli contains flag `--verbose` it is `gutil.log`.


## License

MIT © [Steve Mao](https://github.com/stevemao)


[npm-image]: https://badge.fury.io/js/gulp-conventional-changelog.svg
[npm-url]: https://npmjs.org/package/gulp-conventional-changelog
[travis-image]: https://travis-ci.org/stevemao/gulp-conventional-changelog.svg?branch=master
[travis-url]: https://travis-ci.org/stevemao/gulp-conventional-changelog
[daviddm-image]: https://david-dm.org/stevemao/gulp-conventional-changelog.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/stevemao/gulp-conventional-changelog
[coveralls-image]: https://coveralls.io/repos/github/stevemao/gulp-conventional-changelog/badge.svg
[coveralls-url]: https://coveralls.io/r/stevemao/gulp-conventional-changelog
