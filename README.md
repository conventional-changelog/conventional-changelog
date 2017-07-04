# Conventional Changelog

[![Build Status](https://travis-ci.org/conventional-changelog/conventional-changelog.svg?branch=master)](https://travis-ci.org/conventional-changelog/conventional-changelog)
[![Coverage Status](https://coveralls.io/repos/conventional-changelog/conventional-changelog/badge.svg?branch=master)](https://coveralls.io/r/conventional-changelog/conventional-changelog?branch=master)
[![Standard Version](https://img.shields.io/badge/release-standard%20version-brightgreen.svg)](https://github.com/conventional-changelog/standard-version)

> Generate a CHANGELOG from git metadata

It's recommended you use the high level [standard-version](https://github.com/conventional-changelog/standard-version) library, which handles the entire tagging and CHANGELOG
generation process.

Alternatively, the [conventional-changelog-cli](https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-cli) allows you to generate a CHANGELOG from the
command line.

## About this Repo

The conventional-changelog repo is managed as a [monorepo](https://github.com/babel/babel/blob/master/doc/design/monorepo.md); it's composed of many npm packages.

The original `conventional-changelog/conventional-changelog` API repo can be
found in [packages/conventional-changelog](https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog).

## Plugins Supporting Conventional Changelog

[grunt](https://github.com/btford/grunt-conventional-changelog)/[gulp](https://github.com/conventional-changelog/gulp-conventional-changelog)/[atom](https://github.com/conventional-changelog/atom-conventional-changelog).

## Modules Important to Conventional Changelog Ecosystem

- [conventional-changelog-cli](https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-cli) - the full-featured command line interface
- [standard-changelog](https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/standard-changelog) - command line interface for the angular commit format.
- [conventional-github-releaser](https://github.com/conventional-changelog/conventional-github-releaser) - Make a new GitHub release from git metadata
- [conventional-recommended-bump](https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-recommended-bump) - Get a recommended version bump based on conventional commits
- [conventional-commits-detector](https://github.com/conventional-changelog/conventional-commits-detector) - Detect what commit message convention your repository is using
- [commitizen](https://github.com/commitizen/cz-cli) - Simple commit conventions for internet citizens.
- [validate-commit-msg](https://github.com/conventional-changelog/validate-commit-msg) - Githook to validate commit messages are up to standard
- [conventional-changelog-lint](https://github.com/marionebl/conventional-changelog-lint) - Lint commit messages against your conventional-changelog preset
