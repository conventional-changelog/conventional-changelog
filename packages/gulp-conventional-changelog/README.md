# gulp-conventional-changelog [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url] [![Coverage Status][coverage-image]][coverage-url]

> Generate a changelog using [conventional-changelog](https://github.com/conventional-changelog/conventional-changelog)

*Issues with the output should be reported on the `conventional-changelog` [issue tracker](https://github.com/conventional-changelog/conventional-changelog/issues).*

Checkout the [gulp official recipe](https://github.com/gulpjs/gulp/blob/master/docs/recipes/automate-release-workflow.md) to automate releases with gulp and gulp-conventional-changelog.


## Install

```
$ npm install --save-dev gulp-conventional-changelog
```


## Usage

```js
import gulp from 'gulp';
import conventionalChangelog from 'gulp-conventional-changelog';

gulp.task('changelog', function () {
  return gulp.src('CHANGELOG.md')
    .pipe(conventionalChangelog({
      // conventional-changelog options go here
      preset: 'angular'
    }, {
      // context goes here
    }, {
      // git-raw-commits options go here
    }, {
      // conventional-commits-parser options go here
    }, {
      // conventional-changelog-writer options go here
    }))
    .pipe(gulp.dest('./'));
});
```

### streaming mode

```js
gulp.task('changelog', function () {
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
gulp.task('changelog', function () {
  return gulp.src('CHANGELOG.md')
    .pipe(conventionalChangelog({
      preset: 'angular'
    }))
    .pipe(gulp.dest('./'));
});
```

**Note:** If your `options.releaseCount` is `0` (regenerate all changelog from previous releases) you can just use [conventional-changelog](https://github.com/conventional-changelog/conventional-changelog) directly or not to read the file at all.

```js
import gulp from 'gulp';
import conventionalChangelog from 'conventional-changelog';
import fs from 'fs';

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
import gulp from 'gulp';
import conventionalChangelog from 'gulp-conventional-changelog';

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

See the [conventional-changelog](https://github.com/conventional-changelog/conventional-changelog) docs.

There are some changes:

### changelogOpts

#### warn

If the cli contains flag `--verbose` it is `fancyLog`.


## License

MIT © [Steve Mao](https://github.com/stevemao)


[npm-image]: https://badge.fury.io/js/gulp-conventional-changelog.svg
[npm-url]: https://npmjs.org/package/gulp-conventional-changelog
[travis-image]: https://travis-ci.org/conventional-changelog/gulp-conventional-changelog.svg?branch=master
[travis-url]: https://travis-ci.org/conventional-changelog/gulp-conventional-changelog
[daviddm-image]: https://david-dm.org/conventional-changelog/gulp-conventional-changelog.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/conventional-changelog/gulp-conventional-changelog
[coverage-image]: https://coveralls.io/repos/github/conventional-changelog/conventional-changelog/badge.svg?branch=master
[coverage-url]: https://coveralls.io/github/conventional-changelog/conventional-changelog?branch=master
