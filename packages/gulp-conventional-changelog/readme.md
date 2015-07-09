# gulp-conventional-changelog [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url] [![Coverage Status][coveralls-image]][coveralls-url]

> Generate a changelog using [conventional-changelog](https://github.com/stevemao/conventional-changelog)

*Issues with the output should be reported on the conventional-changelog [issue tracker](https://github.com/stevemao/conventional-changelog/issues).*


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


## API

See the [conventional-changelog](https://github.com/ajoslin/conventional-changelog) docs.


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
