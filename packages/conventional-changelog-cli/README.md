# conventional-changelog-cli [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url] [![Coverage percentage][coveralls-image]][coveralls-url]
> Generate a changelog from git metadata


## Quick start

```sh
$ npm install -g conventional-changelog-cli
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
- Intelligently setup defaults but yet fully configurable with presets of popular projects.
- Everything internally or externally is pluggable.
- A lot of tests and actively maintained.


## Related

- [conventional-github-releaser](https://github.com/stevemao/conventional-github-releaser) - Make a new GitHub release from git metadata
- [conventional-recommended-bump](https://github.com/stevemao/conventional-recommended-bump) - Get a recommended version bump based on conventional commits
- [conventional-commits-detector](https://github.com/stevemao/conventional-commits-detector) - Detect what commit message convention your repository is using
- [commitizen](https://github.com/commitizen/cz-cli) - Simple commit conventions for internet citizens.
- [angular-precommit](https://github.com/ajoslin/angular-precommit) - Pre commit with angular conventions


## License

MIT © [Steve Mao]()


[npm-image]: https://badge.fury.io/js/conventional-changelog-cli.svg
[npm-url]: https://npmjs.org/package/conventional-changelog-cli
[travis-image]: https://travis-ci.org/stevemao/conventional-changelog-cli.svg?branch=master
[travis-url]: https://travis-ci.org/stevemao/conventional-changelog-cli
[daviddm-image]: https://david-dm.org/stevemao/conventional-changelog-cli.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/stevemao/conventional-changelog-cli
[coveralls-image]: https://coveralls.io/repos/stevemao/conventional-changelog-cli/badge.svg
[coveralls-url]: https://coveralls.io/r/stevemao/conventional-changelog-cli
