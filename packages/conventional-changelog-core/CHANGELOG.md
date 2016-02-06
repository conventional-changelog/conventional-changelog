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



