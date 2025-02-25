# Conventional Changelog

[![Build status][build]][build-url]
[![Coverage status][coverage]][coverage-url]

[build]: https://img.shields.io/github/actions/workflow/status/conventional-changelog/conventional-changelog/tests.yaml?branch=master
[build-url]: https://github.com/conventional-changelog/conventional-changelog/actions

[coverage]: https://coveralls.io/repos/github/conventional-changelog/conventional-changelog/badge.svg?branch=master
[coverage-url]: https://coveralls.io/github/conventional-changelog/conventional-changelog?branch=master

Generate a CHANGELOG from git metadata.

## Getting started

The original `conventional-changelog` package repo can be found in [packages/conventional-changelog](packages/conventional-changelog).

It's recommended you use the high level [commit-and-tag-version](https://github.com/absolute-version/commit-and-tag-version) library, which is a drop-in replacement for npm's `version` command, handling automated version bumping, tagging and CHANGELOG generation.

Alternatively, if you'd like to move towards completely automating your release process as an output from CI/CD, consider using [semantic-release](https://github.com/semantic-release/semantic-release).

## Modules Important to Conventional Changelog Ecosystem

- [conventional-changelog](https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog) - the full-featured command line interface
- [standard-changelog](https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/standard-changelog) - command line interface for the angular commit format
- [conventional-recommended-bump](https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-recommended-bump) - get a recommended version bump based on conventional commits
- [commitizen](https://github.com/commitizen/cz-cli) - simple commit conventions for internet citizens.
- [commitlint](https://github.com/conventional-changelog/commitlint) - lint commit messages

## All Packages

| Package | Version | Dependencies |
|---------|---------|--------------|
| [`conventional-changelog`](packages/conventional-changelog#readme) | [![NPM version][conventional-changelog-npm]][conventional-changelog-npm-url] | [![Dependencies status][conventional-changelog-deps]][conventional-changelog-deps-url] |
| [`conventional-changelog-angular`](packages/conventional-changelog-angular#readme) | [![NPM version][conventional-changelog-angular-npm]][conventional-changelog-angular-npm-url] | [![Dependencies status][conventional-changelog-angular-deps]][conventional-changelog-angular-deps-url] |
| [`conventional-changelog-atom`](packages/conventional-changelog-atom#readme) | [![NPM version][conventional-changelog-atom-npm]][conventional-changelog-atom-npm-url] | [![Dependencies status][conventional-changelog-atom-deps]][conventional-changelog-atom-deps-url] |
| [`conventional-changelog-codemirror`](packages/conventional-changelog-codemirror#readme) | [![NPM version][conventional-changelog-codemirror-npm]][conventional-changelog-codemirror-npm-url] | [![Dependencies status][conventional-changelog-codemirror-deps]][conventional-changelog-codemirror-deps-url] |
| [`conventional-changelog-conventionalcommits`](packages/conventional-changelog-conventionalcommits#readme) | [![NPM version][conventional-changelog-conventionalcommits-npm]][conventional-changelog-conventionalcommits-npm-url] | [![Dependencies status][conventional-changelog-conventionalcommits-deps]][conventional-changelog-conventionalcommits-deps-url] |
| [`conventional-changelog-ember`](packages/conventional-changelog-ember#readme) | [![NPM version][conventional-changelog-ember-npm]][conventional-changelog-ember-npm-url] | [![Dependencies status][conventional-changelog-ember-deps]][conventional-changelog-ember-deps-url] |
| [`conventional-changelog-eslint`](packages/conventional-changelog-eslint#readme) | [![NPM version][conventional-changelog-eslint-npm]][conventional-changelog-eslint-npm-url] | [![Dependencies status][conventional-changelog-eslint-deps]][conventional-changelog-eslint-deps-url] |
| [`conventional-changelog-express`](packages/conventional-changelog-express#readme) | [![NPM version][conventional-changelog-express-npm]][conventional-changelog-express-npm-url] | [![Dependencies status][conventional-changelog-express-deps]][conventional-changelog-express-deps-url] |
| [`conventional-changelog-jquery`](packages/conventional-changelog-jquery#readme) | [![NPM version][conventional-changelog-jquery-npm]][conventional-changelog-jquery-npm-url] | [![Dependencies status][conventional-changelog-jquery-deps]][conventional-changelog-jquery-deps-url] |
| [`conventional-changelog-jshint`](packages/conventional-changelog-jshint#readme) | [![NPM version][conventional-changelog-jshint-npm]][conventional-changelog-jshint-npm-url] | [![Dependencies status][conventional-changelog-jshint-deps]][conventional-changelog-jshint-deps-url] |
| [`conventional-changelog-preset-loader`](packages/conventional-changelog-preset-loader#readme) | [![NPM version][conventional-changelog-preset-loader-npm]][conventional-changelog-preset-loader-npm-url] | [![Dependencies status][conventional-changelog-preset-loader-deps]][conventional-changelog-preset-loader-deps-url] |
| [`conventional-changelog-writer`](packages/conventional-changelog-writer#readme) | [![NPM version][conventional-changelog-writer-npm]][conventional-changelog-writer-npm-url] | [![Dependencies status][conventional-changelog-writer-deps]][conventional-changelog-writer-deps-url] |
| [`conventional-commits-filter`](packages/conventional-commits-filter#readme) | [![NPM version][conventional-commits-filter-npm]][conventional-commits-filter-npm-url] | [![Dependencies status][conventional-commits-filter-deps]][conventional-commits-filter-deps-url] |
| [`conventional-commits-parser`](packages/conventional-commits-parser#readme) | [![NPM version][conventional-commits-parser-npm]][conventional-commits-parser-npm-url] | [![Dependencies status][conventional-commits-parser-deps]][conventional-commits-parser-deps-url] |
| [`conventional-recommended-bump`](packages/conventional-recommended-bump#readme) | [![NPM version][conventional-recommended-bump-npm]][conventional-recommended-bump-npm-url] | [![Dependencies status][conventional-recommended-bump-deps]][conventional-recommended-bump-deps-url] |
| [`@conventional-changelog/git-client`](packages/git-client#readme) | [![NPM version][git-client-npm]][git-client-npm-url] | [![Dependencies status][git-client-deps]][git-client-deps-url] |
| [`standard-changelog`](packages/standard-changelog#readme) | [![NPM version][standard-changelog-npm]][standard-changelog-npm-url] | [![Dependencies status][standard-changelog-deps]][standard-changelog-deps-url] |

<!-- conventional-changelog -->

[conventional-changelog-npm]: https://img.shields.io/npm/v/conventional-changelog.svg
[conventional-changelog-npm-url]: https://www.npmjs.com/package/conventional-changelog

[conventional-changelog-deps]: https://img.shields.io/librariesio/release/npm/conventional-changelog
[conventional-changelog-deps-url]: https://libraries.io/npm/conventional-changelog/tree

<!-- conventional-changelog-angular -->

[conventional-changelog-angular-npm]: https://img.shields.io/npm/v/conventional-changelog-angular.svg
[conventional-changelog-angular-npm-url]: https://www.npmjs.com/package/conventional-changelog-angular

[conventional-changelog-angular-deps]: https://img.shields.io/librariesio/release/npm/conventional-changelog-angular
[conventional-changelog-angular-deps-url]: https://libraries.io/npm/conventional-changelog-angular/tree

<!-- conventional-changelog-atom -->

[conventional-changelog-atom-npm]: https://img.shields.io/npm/v/conventional-changelog-atom.svg
[conventional-changelog-atom-npm-url]: https://www.npmjs.com/package/conventional-changelog-atom

[conventional-changelog-atom-deps]: https://img.shields.io/librariesio/release/npm/conventional-changelog-atom
[conventional-changelog-atom-deps-url]: https://libraries.io/npm/conventional-changelog-atom/tree

<!-- conventional-changelog-codemirror -->

[conventional-changelog-codemirror-npm]: https://img.shields.io/npm/v/conventional-changelog-codemirror.svg
[conventional-changelog-codemirror-npm-url]: https://www.npmjs.com/package/conventional-changelog-codemirror

[conventional-changelog-codemirror-deps]: https://img.shields.io/librariesio/release/npm/conventional-changelog-codemirror
[conventional-changelog-codemirror-deps-url]: https://libraries.io/npm/conventional-changelog-codemirror/tree

<!-- conventional-changelog-conventionalcommits -->

[conventional-changelog-conventionalcommits-npm]: https://img.shields.io/npm/v/conventional-changelog-conventionalcommits.svg
[conventional-changelog-conventionalcommits-npm-url]: https://www.npmjs.com/package/conventional-changelog-conventionalcommits

[conventional-changelog-conventionalcommits-deps]: https://img.shields.io/librariesio/release/npm/conventional-changelog-conventionalcommits
[conventional-changelog-conventionalcommits-deps-url]: https://libraries.io/npm/conventional-changelog-conventionalcommits/tree

<!-- conventional-changelog-ember -->

[conventional-changelog-ember-npm]: https://img.shields.io/npm/v/conventional-changelog-ember.svg
[conventional-changelog-ember-npm-url]: https://www.npmjs.com/package/conventional-changelog-ember

[conventional-changelog-ember-deps]: https://img.shields.io/librariesio/release/npm/conventional-changelog-ember
[conventional-changelog-ember-deps-url]: https://libraries.io/npm/conventional-changelog-ember/tree

<!-- conventional-changelog-eslint -->

[conventional-changelog-eslint-npm]: https://img.shields.io/npm/v/conventional-changelog-eslint.svg
[conventional-changelog-eslint-npm-url]: https://www.npmjs.com/package/conventional-changelog-eslint

[conventional-changelog-eslint-deps]: https://img.shields.io/librariesio/release/npm/conventional-changelog-eslint
[conventional-changelog-eslint-deps-url]: https://libraries.io/npm/conventional-changelog-eslint/tree

<!-- conventional-changelog-express -->

[conventional-changelog-express-npm]: https://img.shields.io/npm/v/conventional-changelog-express.svg
[conventional-changelog-express-npm-url]: https://www.npmjs.com/package/conventional-changelog-express

[conventional-changelog-express-deps]: https://img.shields.io/librariesio/release/npm/conventional-changelog-express
[conventional-changelog-express-deps-url]: https://libraries.io/npm/conventional-changelog-express/tree

<!-- conventional-changelog-jquery -->

[conventional-changelog-jquery-npm]: https://img.shields.io/npm/v/conventional-changelog-jquery.svg
[conventional-changelog-jquery-npm-url]: https://www.npmjs.com/package/conventional-changelog-jquery

[conventional-changelog-jquery-deps]: https://img.shields.io/librariesio/release/npm/conventional-changelog-jquery
[conventional-changelog-jquery-deps-url]: https://libraries.io/npm/conventional-changelog-jquery/tree

<!-- conventional-changelog-jshint -->

[conventional-changelog-jshint-npm]: https://img.shields.io/npm/v/conventional-changelog-jshint.svg
[conventional-changelog-jshint-npm-url]: https://www.npmjs.com/package/conventional-changelog-jshint

[conventional-changelog-jshint-deps]: https://img.shields.io/librariesio/release/npm/conventional-changelog-jshint
[conventional-changelog-jshint-deps-url]: https://libraries.io/npm/conventional-changelog-jshint/tree

<!-- conventional-changelog-preset-loader -->

[conventional-changelog-preset-loader-npm]: https://img.shields.io/npm/v/conventional-changelog-preset-loader.svg
[conventional-changelog-preset-loader-npm-url]: https://www.npmjs.com/package/conventional-changelog-preset-loader

[conventional-changelog-preset-loader-deps]: https://img.shields.io/librariesio/release/npm/conventional-changelog-preset-loader
[conventional-changelog-preset-loader-deps-url]: https://libraries.io/npm/conventional-changelog-preset-loader/tree

<!-- conventional-changelog-writer -->

[conventional-changelog-writer-npm]: https://img.shields.io/npm/v/conventional-changelog-writer.svg
[conventional-changelog-writer-npm-url]: https://www.npmjs.com/package/conventional-changelog-writer

[conventional-changelog-writer-deps]: https://img.shields.io/librariesio/release/npm/conventional-changelog-writer
[conventional-changelog-writer-deps-url]: https://libraries.io/npm/conventional-changelog-writer/tree

<!-- conventional-commits-filter -->

[conventional-commits-filter-npm]: https://img.shields.io/npm/v/conventional-commits-filter.svg
[conventional-commits-filter-npm-url]: https://www.npmjs.com/package/conventional-commits-filter

[conventional-commits-filter-deps]: https://img.shields.io/librariesio/release/npm/conventional-commits-filter
[conventional-commits-filter-deps-url]: https://libraries.io/npm/conventional-commits-filter/tree

<!-- conventional-commits-parser -->

[conventional-commits-parser-npm]: https://img.shields.io/npm/v/conventional-commits-parser.svg
[conventional-commits-parser-npm-url]: https://www.npmjs.com/package/conventional-commits-parser

[conventional-commits-parser-deps]: https://img.shields.io/librariesio/release/npm/conventional-commits-parser
[conventional-commits-parser-deps-url]: https://libraries.io/npm/conventional-commits-parser/tree

<!-- conventional-recommended-bump -->

[conventional-recommended-bump-npm]: https://img.shields.io/npm/v/conventional-recommended-bump.svg
[conventional-recommended-bump-npm-url]: https://www.npmjs.com/package/conventional-recommended-bump

[conventional-recommended-bump-deps]: https://img.shields.io/librariesio/release/npm/conventional-recommended-bump
[conventional-recommended-bump-deps-url]: https://libraries.io/npm/conventional-recommended-bump/tree

<!-- git-client -->

[git-client-npm]: https://img.shields.io/npm/v/@conventional-changelog/git-client
[git-client-npm-url]: https://www.npmjs.com/package/@conventional-changelog/git-client

[git-client-deps]: https://img.shields.io/librariesio/release/npm/@conventional-changelog/git-client
[git-client-deps-url]: https://libraries.io/npm/@conventional-changelog/git-client/tree

<!-- standard-changelog -->

[standard-changelog-npm]: https://img.shields.io/npm/v/standard-changelog
[standard-changelog-npm-url]: https://www.npmjs.com/package/standard-changelog

[standard-changelog-deps]: https://img.shields.io/librariesio/release/npm/standard-changelog
[standard-changelog-deps-url]: https://libraries.io/npm/standard-changelog/tree

## Node Support Policy

We only support [Long-Term Support](https://github.com/nodejs/Release) versions of Node.

We specifically limit our support to LTS versions of Node, not because this package won't work on other versions, but because we have a limited amount of time, and supporting LTS offers the greatest return on that investment.

It's possible this package will work correctly on newer versions of Node. It may even be possible to use this package on older versions of Node, though that's more unlikely as we'll make every effort to take advantage of features available in the oldest LTS version we support.

As each Node LTS version reaches its end-of-life we will remove that version from the `node` `engines` property of our package's `package.json` file. Removing a Node version is considered a breaking change and will entail the publishing of a new major version of this package. We will not accept any requests to support an end-of-life version of Node. Any merge requests or issues supporting an end-of-life version of Node will be closed.

We will accept code that allows this package to run on newer, non-LTS, versions of Node. Furthermore, we will attempt to ensure our own changes work on the latest version of Node. To help in that commitment, our continuous integration setup runs against all LTS versions of Node in addition the most recent Node release; called _current_.

JavaScript package managers should allow you to install this package with any version of Node, with, at most, a warning if your version of Node does not fall within the range specified by our `node` `engines` property. If you encounter issues installing this package, please report the issue to your package manager.
