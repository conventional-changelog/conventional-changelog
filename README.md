#  [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url] [![Coverage Status][coveralls-image]][coveralls-url]

> Generate a changelog from git metadata, using the AngularJS commit conventions


## Install

```sh
$ npm install conventional-changelog
```

- [Synopsis of Conventions in CONVENTIONS.md](https://github.com/ajoslin/conventional-changelog/blob/master/CONVENTIONS.md)
- [Full Convention Spec on Google Docs](https://docs.google.com/document/d/1QrDFcIiPjSLDn3EL15IJygNPiHORgU1_OOAqWjiDU5Y/)

Adapted from code originally written by @vojtajina and @btford in [grunt-conventional-changelog](https://github.com/btford/grunt-conventional-changelog).


## Example output

- https://github.com/ajoslin/conventional-changelog/blob/master/CHANGELOG.md
- https://github.com/karma-runner/karma/blob/master/CHANGELOG.md


## Roadmap

- Make it return a stream
- Add a proper command line interface
- Add configurable subjects & sections
- Split up this repo into smaller modules [#22](https://github.com/ajoslin/conventional-changelog/issues/22)


## Documentation

Simple usage:

```js
require('conventional-changelog')({
  repository: 'https://github.com/joyent/node',
  version: require('./package.json').version
}, function(err, log) {
  console.log('Here is your changelog!', log);
});
```

#### `changelog(options, callback)`

By default, calls the callback with a string containing a changelog from the previous tag to HEAD, using pkg.version, prepended to existing CHANGELOG.md (if it exists).

`callback` is the second parameter, and takes two parameters: `(err, log)`. `log` is a string containing the newly generated changelog, and `err` is either an error or null.

`options` is the first parameter, an object.  The following fields are available:

##### The Most Important Options

* `version` `{string}` - The version to be written to the changelog. For example, `{version: "1.0.1"}`. Defaults to the version found in `package.json`. See `pkg` to configure the path of package.json.

* `subtitle` `{string}` - A string to display after the version title in the changelog. For example, it will show '## 1.0.0 "Super Version"' if codename '"Super Version"' is given. By default, it's blank.

* `repository` `{string}` - If this is provided, allows issues and commit hashes to be linked to the actual commit.  Usually used with github repositories.  For example, `{repository: 'http://github.com/joyent/node'}`. Defaults to "normalized" `repository.url` found in `package.json`. See `pkg` to configure the path of package.json.

* `pkg` `{string}` - The path of `package.json`. Defaults to `./package.json`.

* `from` `{string}` - Which commit the changelog should start at. By default, uses previous tag, or if no previous tag the first commit.

* `to` `{string}` - Which commit the changelog should end at.  By default, uses HEAD.

* `file` `{string}` - Which file to read the current changelog from and prepend the new changelog's contents to.  By default, uses `'CHANGELOG.md'`.

##### The "I really want to get crazy" Options

* `versionText` `{function(version, subtitle)}` - What to use for the title of a major version in the changelog. Defaults to `'## ' + version + ' ' + subtitle`.

* `patchVersionText` `{function(version, subtitle)}` - What to use for the title of a patch version in the changelog. Defaults to `'### ' + version + ' ' + subtitle`.

* `commitLink` `{function(commitHash)}` - If repository is provided, this function will be used to link to commits. By default, returns a github commit link based on options.repository: `opts.repository + '/commit/' + hash`.

* `issueLink` `{function(issueId)}` - If repository is provided, this function will be used to link to issues.  By default, returns a github issue link based on options.repository: `opts.repository + '/issues/' + id`.

* `log` `{function()}` - What logging function to use. For example, `{log: grunt.log.ok}`. By default, uses `console.log`.

* `warn` `{function()}` - What warn function to use. For example, `{warn: grunt.log.writeln}`. By default, uses `console.warn`.


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
