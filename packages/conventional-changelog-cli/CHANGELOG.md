# Change Log

All notable changes to this project will be documented in this file.
See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

<a name="1.3.1"></a>
## [1.3.1](https://github.com/conventional-changelog/conventional-changelog-cli/compare/conventional-changelog-cli@1.3.0...conventional-changelog-cli@1.3.1) (2017-03-11)

<a name="1.2.0"></a>
# [1.2.0](https://github.com/conventional-changelog/conventional-changelog-cli/compare/v1.1.1...v1.2.0) (2016-05-08)


### Features

* **config:** should work with preset([a0449a2](https://github.com/conventional-changelog/conventional-changelog-cli/commit/a0449a2)), closes [#4](https://github.com/conventional-changelog/conventional-changelog-cli/issues/4)



<a name="1.1.1"></a>
## [1.1.1](https://github.com/stevemao/conventional-changelog-cli/compare/v1.1.0...v1.1.1) (2016-02-14)




<a name="1.1.0"></a>
# [1.1.0](https://github.com/stevemao/conventional-changelog-cli/compare/v1.0.0...v1.1.0) (2016-02-13)


### Features

* **debug:** use conventional-changelog 1.1.0 and debug when verbose ([d1aa13d](https://github.com/stevemao/conventional-changelog-cli/commit/d1aa13d))



<a name="1.0.0"></a>
# [1.0.0](https://github.com/stevemao/conventional-changelog-cli/compare/v0.0.1...v1.0.0) (2016-02-05)


### Bug Fixes

* **infile:** do not print the latest release twice if infile ENOENT ([e664087](https://github.com/stevemao/conventional-changelog-cli/commit/e664087))

### Features

* **flags:** add config and remove uncommon ones ([abc2b83](https://github.com/stevemao/conventional-changelog-cli/commit/abc2b83))
* **help:** improve the flag names and add more descriptions ([f59d6d9](https://github.com/stevemao/conventional-changelog-cli/commit/f59d6d9))
* **infile:** warn if infile does not exist ([443eb64](https://github.com/stevemao/conventional-changelog-cli/commit/443eb64))
* add --output-unreleased ([d479ff4](https://github.com/stevemao/conventional-changelog-cli/commit/d479ff4))


### BREAKING CHANGES

* help: `overwrite` is now called `same-file`.

Fixes https://github.com/ajoslin/conventional-changelog/issues/100
* flags: `--git-raw-commits-opts`, `--parser-opts` and `--writer-opts` are removed as they are considered uncommon, use `--config` is easier as people can write all options within one file and they can learn from existing presets.

Fixes https://github.com/ajoslin/conventional-changelog/issues/100



<a name="0.0.1"></a>
## 0.0.1 (2016-01-30)


### Features

* **init:** extract cli from conventional-changelog ([2246df5](https://github.com/stevemao/conventional-changelog-cli/commit/2246df5))
