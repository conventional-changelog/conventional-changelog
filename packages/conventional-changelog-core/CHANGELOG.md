# Change Log

All notable changes to this project will be documented in this file.
See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

<a name="1.8.0"></a>
# [1.8.0](https://github.com/conventional-changelog/conventional-changelog-core/compare/conventional-changelog-core@1.7.0...conventional-changelog-core@1.8.0) (2017-03-11)


### Features

* context.currentTag should take into account lerna tag format ([#178](https://github.com/conventional-changelog/conventional-changelog/issues/178)) ([f0e5875](https://github.com/conventional-changelog/conventional-changelog-core/commit/f0e5875))

<a name="1.5.0"></a>
# [1.5.0](https://github.com/conventional-changelog/conventional-changelog-core/compare/v1.4.0...v1.5.0) (2016-05-10)


### Features

* **context:** fallback to repoUrl([da0b096](https://github.com/conventional-changelog/conventional-changelog-core/commit/da0b096)), closes [#7](https://github.com/conventional-changelog/conventional-changelog-core/issues/7)



<a name="1.4.0"></a>
# [1.4.0](https://github.com/conventional-changelog/conventional-changelog-core/compare/v1.3.4...v1.4.0) (2016-05-08)


### Features

* **debug:** make options.debug as default writeOpts.debug([eeb7e8f](https://github.com/conventional-changelog/conventional-changelog-core/commit/eeb7e8f))



<a name="1.3.4"></a>
## [1.3.4](https://github.com/conventional-changelog/conventional-changelog-core/compare/v1.3.3...v1.3.4) (2016-05-07)


### Bug Fixes

* **mergeConfig:** respect issuePrefixes option ([4be052b](https://github.com/conventional-changelog/conventional-changelog-core/commit/4be052b)), closes [#6](https://github.com/conventional-changelog/conventional-changelog-core/issues/6) [#8](https://github.com/conventional-changelog/conventional-changelog-core/issues/8)



<a name="1.3.3"></a>
## [1.3.3](https://github.com/conventional-changelog/conventional-changelog-core/compare/v1.3.2...v1.3.3) (2016-04-19)


### Bug Fixes

* **unknownHost:** default context.repository ([eaa3b6f](https://github.com/conventional-changelog/conventional-changelog-core/commit/eaa3b6f))



<a name="1.3.2"></a>
## [1.3.2](https://github.com/conventional-changelog/conventional-changelog-core/compare/v1.3.1...v1.3.2) (2016-04-17)




<a name="1.3.1"></a>
## [1.3.1](https://github.com/conventional-changelog/conventional-changelog-core/compare/v1.3.0...v1.3.1) (2016-04-09)


### Bug Fixes

* **defaults:** context tags ([2571038](https://github.com/conventional-changelog/conventional-changelog-core/commit/2571038))



<a name="1.3.0"></a>
# [1.3.0](https://github.com/stevemao/conventional-changelog-core/compare/v1.2.0...v1.3.0) (2016-02-13)


### Features

* **debug:** add options.debug function ([aa56ae6](https://github.com/stevemao/conventional-changelog-core/commit/aa56ae6))



<a name="1.2.0"></a>
# [1.2.0](https://github.com/stevemao/conventional-changelog-core/compare/v1.1.0...v1.2.0) (2016-02-11)


### Features

* **merge:** ignore merge commits ([8f788dc](https://github.com/stevemao/conventional-changelog-core/commit/8f788dc))



<a name="1.1.0"></a>
# [1.1.0](https://github.com/stevemao/conventional-changelog-core/compare/v1.0.2...v1.1.0) (2016-02-08)


### Bug Fixes

* **default:** firstCommit and lastCommit should based on original unfiltered commits ([7fc49c9](https://github.com/stevemao/conventional-changelog-core/commit/7fc49c9)), closes [#2](https://github.com/stevemao/conventional-changelog-core/issues/2)



<a name="1.0.2"></a>
## [1.0.2](https://github.com/stevemao/conventional-changelog-core/compare/v1.0.1...v1.0.2) (2016-02-06)


### Bug Fixes

* **currentTag:** if unreleased, currentTag should be last commit hash ([e3d25ae](https://github.com/stevemao/conventional-changelog-core/commit/e3d25ae))



<a name="1.0.1"></a>
## [1.0.1](https://github.com/stevemao/conventional-changelog-core/compare/v1.0.0...v1.0.1) (2016-02-06)


### Bug Fixes

* **unreleased:** now it can output unreleased commits ([87b7340](https://github.com/stevemao/conventional-changelog-core/commit/87b7340))



<a name="1.0.0"></a>
# [1.0.0](https://github.com/stevemao/conventional-changelog-core/compare/v0.0.2...v1.0.0) (2016-02-05)


### Bug Fixes

* **oldNode:** git remote origin url feature is only available under node>=4 ([c69db53](https://github.com/stevemao/conventional-changelog-core/commit/c69db53))

### Features

* **pkg:** fallback to git remote origin url ([5b56952](https://github.com/stevemao/conventional-changelog-core/commit/5b56952))
* **unreleased:** option to output or not unreleased changelog ([9dfe8d8](https://github.com/stevemao/conventional-changelog-core/commit/9dfe8d8)), closes [ajoslin/conventional-changelog#120](https://github.com/ajoslin/conventional-changelog/issues/120)


### BREAKING CHANGES

* unreleased: If `context.version` is the same as the version of the last release, by default the unreleased chagnelog will not output.



<a name="0.0.2"></a>
## [0.0.2](https://github.com/stevemao/conventional-changelog-core/compare/v0.0.1...v0.0.2) (2016-01-30)


### Bug Fixes

* **error:** better error handling ([614ce1a](https://github.com/stevemao/conventional-changelog-core/commit/614ce1a)), closes [ajoslin/conventional-changelog#130](https://github.com/ajoslin/conventional-changelog/issues/130)



<a name="0.0.1"></a>
## 0.0.1 (2015-12-26)


### Features

* **config:** change preset to config ([85fd9d9](https://github.com/stevemao/conventional-changelog-core/commit/85fd9d9))
* **init:** extract core from conventional-changelog ([4a4bca3](https://github.com/stevemao/conventional-changelog-core/commit/4a4bca3))


### BREAKING CHANGES

* config: `options.preset` is removed in favour of `options.config`
