#  [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url] [![Coverage Status][coveralls-image]][coveralls-url]

> Generate a changelog from git metadata

[Synopsis of Conventions](conventions)


## Quick start

```sh
$ npm install -g conventional-changelog
$ cd my-project
$ conventional-changelog -p angular -i CHANGELOG.md -w
```

This will *not* overwrite any previous changelog. The above generates a changelog based on commits since the last semver tag that match the pattern of a "Feature", "Fix", "Performance Improvement" or "Breaking Changes".

If you first time use this tool and want to generate all previous changelog, you could do

```sh
$ conventional-changelog -p angular -i CHANGELOG.md -w -r 0
```

This *will* overwrite any previous changelog if exist.

All available command line parameters can be listed using [CLI](#cli) : `conventional-changelog --help`.

**Hint:** You can alias your command or add it to your package.json. EG: `"changelog": "conventional-changelog -p angular -i CHANGELOG.md -w -r 0"`.

Or use one of the plugins if you are already using the tool:  [grunt](https://github.com/btford/grunt-conventional-changelog)/[gulp](https://github.com/stevemao/gulp-conventional-changelog)/[atom](https://github.com/stevemao/atom-conventional-changelog)


## Recommended workflow

1. Make changes
2. Commit those changes
3. Make sure Travis turns green
4. Bump version in `package.json`
5. `conventionalChangelog`
6. Commit `package.json` and `CHANGELOG.md` files
7. Tag
8. Push

The reason why you should commit and tag after `conventionalChangelog` is that the CHANGELOG should be included in the new release, hence `gitRawCommitsOpts.from` defaults to the latest semver tag.

Please use this [gist](https://gist.github.com/stevemao/280ef22ee861323993a0) to make a release or change it to your needs.


## Example output

- https://github.com/ajoslin/conventional-changelog/blob/master/CHANGELOG.md
- https://github.com/karma-runner/karma/blob/master/CHANGELOG.md
- https://github.com/btford/grunt-conventional-changelog/blob/master/CHANGELOG.md


## Why

- Used by AngularJS and related projects.
- Ignoring reverted commits, templating with [handlebars.js](https://github.com/wycats/handlebars.js) and links to references, etc. Open an [issue](../../issues/new) if you want more reasonable features.
- Intelligently setup defaults but you can still modify them to your needs.
- Fully configurable. There are [many presets](presets) that you can use if you just want to use the same conventions. But it is also possible to configure if you want to go down to the nth degree.
- Everything internally or externally is pluggable.
- High performant. It doesn't spawn any extra child process to fetch data.
- A lot of tests and actively maintained.


## Programmatic usage

```sh
$ npm install --save conventional-changelog
```

```js
var conventionalChangelog = require('conventional-changelog');

conventionalChangelog({
  preset: 'angular'
})
  .pipe(process.stdout); // or any writable stream
```


## API

### conventionalChangelog([options, [context, [gitRawCommitsOpts, [parserOpts, [writerOpts]]]]])

Returns a readable stream.

#### options

##### preset

Type: `string` [Possible values](presets)

It's recommended to use a preset so you don't have to define everything yourself. The preset values can be overwritten.

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

#### writerOpts

See the [conventional-changelog-writer](https://github.com/stevemao/conventional-changelog-writer) docs. There are some defaults:

##### reverse

Default: same as `options.append`.

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


## Related

- [conventional-github-releaser](https://github.com/stevemao/conventional-github-releaser) - Make a new GitHub release from git metadata
- [conventional-recommended-bump](https://github.com/stevemao/conventional-recommended-bump) - Get a recommended version bump based on conventional commits
- [conventional-commits-detector](https://github.com/stevemao/conventional-commits-detector) - Detect what commit message convention your repository is using
- [commitizen](https://github.com/commitizen/cz-cli) - Simple commit conventions for internet citizens.
- [angular-precommit](https://github.com/ajoslin/angular-precommit) - Pre commit with angular conventions


## License

MIT


[npm-image]: https://badge.fury.io/js/conventional-changelog.svg
[npm-url]: https://npmjs.org/package/conventional-changelog
[travis-image]: https://travis-ci.org/ajoslin/conventional-changelog.svg?branch=master
[travis-url]: https://travis-ci.org/ajoslin/conventional-changelog
[daviddm-image]: https://david-dm.org/ajoslin/conventional-changelog.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/ajoslin/conventional-changelog
[coveralls-image]: https://coveralls.io/repos/ajoslin/conventional-changelog/badge.svg
[coveralls-url]: https://coveralls.io/r/ajoslin/conventional-changelog
