# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [5.0.0](https://github.com/conventional-changelog/conventional-changelog/compare/gulp-conventional-changelog-v4.0.0...gulp-conventional-changelog-v5.0.0) (2024-04-26)


### ⚠ BREAKING CHANGES

* Node >= 18 is required
* **git-raw-commits:** refactored to use @conventional-changelog/git-client ([#1199](https://github.com/conventional-changelog/conventional-changelog/issues/1199))
* Now all packages, except gulp-conventional-changelog, are ESM-only.
* **git-semver-tags,conventional-recommended-bump:** gitSemverTags and conventionalRecommendedBump now return promises
* **standard-changelog:** createIfMissing method now returns a promise

### Features

* drop node 16 support ([#1226](https://github.com/conventional-changelog/conventional-changelog/issues/1226)) ([ec69cfd](https://github.com/conventional-changelog/conventional-changelog/commit/ec69cfdf0040f73ec0eadc4779c37874e71f3dff))
* **git-raw-commits:** refactored to use @conventional-changelog/git-client ([#1199](https://github.com/conventional-changelog/conventional-changelog/issues/1199)) ([ba03ffc](https://github.com/conventional-changelog/conventional-changelog/commit/ba03ffc3c05e794db48b18a508f296d4d662a5d9))
* **git-semver-tags,conventional-recommended-bump:** refactoring to use promises instead of callbacks ([#1112](https://github.com/conventional-changelog/conventional-changelog/issues/1112)) ([1697ecd](https://github.com/conventional-changelog/conventional-changelog/commit/1697ecdf4c2329732e612cc1bd3323e84f046f3a))
* move from CommonJS to ESM ([#1144](https://github.com/conventional-changelog/conventional-changelog/issues/1144)) ([c5b859d](https://github.com/conventional-changelog/conventional-changelog/commit/c5b859d201e124822002eb54574f003f074216e2))
* **standard-changelog:** use promises ([#1111](https://github.com/conventional-changelog/conventional-changelog/issues/1111)) ([5015ab7](https://github.com/conventional-changelog/conventional-changelog/commit/5015ab71de7a3db9cbcbbabd0cc25502f1cd0109))

## [4.0.0](https://github.com/conventional-changelog/conventional-changelog/compare/gulp-conventional-changelog-v3.0.0...gulp-conventional-changelog-v4.0.0) (2023-08-26)


### ⚠ BREAKING CHANGES

* Node >= 16 is required
* Now all presets are exports preset config factory function. conventional-changelog-preset-loader now exports new loadPreset and createPresetLoader functions. If you are using presets indirectly, using preset name, no any changes in configuration needed, just upgrade packages to latest versions.

### Features

* drop node 14 support ([#1085](https://github.com/conventional-changelog/conventional-changelog/issues/1085)) ([1bce036](https://github.com/conventional-changelog/conventional-changelog/commit/1bce0362dbb624a869eb01fd7724ab7f81d337e6))
* unified presets interface ([#1045](https://github.com/conventional-changelog/conventional-changelog/issues/1045)) ([8d0ffbe](https://github.com/conventional-changelog/conventional-changelog/commit/8d0ffbe6c59b861b560cea0e3594c7b32e978cc3))


### Bug Fixes

* **deps:** update dependency fancy-log to v2 ([#901](https://github.com/conventional-changelog/conventional-changelog/issues/901)) ([5d93f15](https://github.com/conventional-changelog/conventional-changelog/commit/5d93f15f767a121fffda434e2eb1e862d8621a2f))
* **deps:** update dependency plugin-error to v2 ([#1038](https://github.com/conventional-changelog/conventional-changelog/issues/1038)) ([5fe464c](https://github.com/conventional-changelog/conventional-changelog/commit/5fe464cc5972af35c93f224256a20a56be4b9d31))

## [3.0.0](https://github.com/conventional-changelog/conventional-changelog/compare/gulp-conventional-changelog-v2.0.35...gulp-conventional-changelog-v3.0.0) (2023-06-06)


### ⚠ BREAKING CHANGES

* Node >= 14 is required

### Code Refactoring

* drop lodash from dependencies where it possible ([#959](https://github.com/conventional-changelog/conventional-changelog/issues/959)) ([a8b4e12](https://github.com/conventional-changelog/conventional-changelog/commit/a8b4e12883021231befc6bdfeb95a9b50637f361))

## [2.0.35](https://github.com/conventional-changelog/conventional-changelog/compare/gulp-conventional-changelog@2.0.34...gulp-conventional-changelog@2.0.35) (2020-11-05)


### Bug Fixes

* **deps:** update dependency through2 to v4 ([#657](https://github.com/conventional-changelog/conventional-changelog/issues/657)) ([7ae618c](https://github.com/conventional-changelog/conventional-changelog/commit/7ae618c81491841e5b1d796d3933aac0c54bc312))





## [2.0.34](https://github.com/conventional-changelog/conventional-changelog/compare/gulp-conventional-changelog@2.0.33...gulp-conventional-changelog@2.0.34) (2020-08-12)

**Note:** Version bump only for package gulp-conventional-changelog





## [2.0.33](https://github.com/conventional-changelog/conventional-changelog/compare/gulp-conventional-changelog@2.0.32...gulp-conventional-changelog@2.0.33) (2020-06-20)

**Note:** Version bump only for package gulp-conventional-changelog





## [2.0.32](https://github.com/conventional-changelog/conventional-changelog/compare/gulp-conventional-changelog@2.0.31...gulp-conventional-changelog@2.0.32) (2020-05-08)

**Note:** Version bump only for package gulp-conventional-changelog





## [2.0.31](https://github.com/conventional-changelog/conventional-changelog/compare/gulp-conventional-changelog@2.0.27...gulp-conventional-changelog@2.0.31) (2020-05-08)

**Note:** Version bump only for package gulp-conventional-changelog





## [2.0.27](https://github.com/conventional-changelog/conventional-changelog/compare/gulp-conventional-changelog@2.0.26...gulp-conventional-changelog@2.0.27) (2019-11-21)

**Note:** Version bump only for package gulp-conventional-changelog





## [2.0.26](https://github.com/conventional-changelog/conventional-changelog/compare/gulp-conventional-changelog@2.0.25...gulp-conventional-changelog@2.0.26) (2019-11-14)

**Note:** Version bump only for package gulp-conventional-changelog





## [2.0.25](https://github.com/conventional-changelog/conventional-changelog/compare/gulp-conventional-changelog@2.0.24...gulp-conventional-changelog@2.0.25) (2019-11-07)

**Note:** Version bump only for package gulp-conventional-changelog





## [2.0.24](https://github.com/conventional-changelog/conventional-changelog/compare/gulp-conventional-changelog@2.0.23...gulp-conventional-changelog@2.0.24) (2019-10-24)

**Note:** Version bump only for package gulp-conventional-changelog





## [2.0.22](https://github.com/conventional-changelog/conventional-changelog/compare/gulp-conventional-changelog@2.0.21...gulp-conventional-changelog@2.0.22) (2019-10-02)

**Note:** Version bump only for package gulp-conventional-changelog





## [2.0.21](https://github.com/conventional-changelog/conventional-changelog/compare/gulp-conventional-changelog@2.0.20...gulp-conventional-changelog@2.0.21) (2019-07-29)

**Note:** Version bump only for package gulp-conventional-changelog





## [2.0.20](https://github.com/conventional-changelog/conventional-changelog/compare/gulp-conventional-changelog@2.0.19...gulp-conventional-changelog@2.0.20) (2019-05-18)

**Note:** Version bump only for package gulp-conventional-changelog





## [2.0.19](https://github.com/conventional-changelog/conventional-changelog/compare/gulp-conventional-changelog@2.0.18...gulp-conventional-changelog@2.0.19) (2019-05-05)

**Note:** Version bump only for package gulp-conventional-changelog





## [2.0.18](https://github.com/conventional-changelog/conventional-changelog/compare/gulp-conventional-changelog@2.0.17...gulp-conventional-changelog@2.0.18) (2019-05-02)

**Note:** Version bump only for package gulp-conventional-changelog





## [2.0.17](https://github.com/conventional-changelog/conventional-changelog/compare/gulp-conventional-changelog@2.0.16...gulp-conventional-changelog@2.0.17) (2019-05-02)

**Note:** Version bump only for package gulp-conventional-changelog





## [2.0.16](https://github.com/conventional-changelog/conventional-changelog/compare/gulp-conventional-changelog@2.0.15...gulp-conventional-changelog@2.0.16) (2019-04-26)

**Note:** Version bump only for package gulp-conventional-changelog





## [2.0.15](https://github.com/conventional-changelog/conventional-changelog/compare/gulp-conventional-changelog@2.0.14...gulp-conventional-changelog@2.0.15) (2019-04-24)

**Note:** Version bump only for package gulp-conventional-changelog





## [2.0.14](https://github.com/conventional-changelog/conventional-changelog/compare/gulp-conventional-changelog@2.0.13...gulp-conventional-changelog@2.0.14) (2019-04-11)

**Note:** Version bump only for package gulp-conventional-changelog





## [2.0.13](https://github.com/conventional-changelog/conventional-changelog/compare/gulp-conventional-changelog@2.0.12...gulp-conventional-changelog@2.0.13) (2019-04-11)

**Note:** Version bump only for package gulp-conventional-changelog





## [2.0.12](https://github.com/conventional-changelog/conventional-changelog/compare/gulp-conventional-changelog@2.0.11...gulp-conventional-changelog@2.0.12) (2019-04-11)

**Note:** Version bump only for package gulp-conventional-changelog





## [2.0.11](https://github.com/conventional-changelog/conventional-changelog/compare/gulp-conventional-changelog@2.0.10...gulp-conventional-changelog@2.0.11) (2019-04-10)


### Bug Fixes

* **deps:** update dependency concat-stream to v2 ([#401](https://github.com/conventional-changelog/conventional-changelog/issues/401)) ([4c09bfc](https://github.com/conventional-changelog/conventional-changelog/commit/4c09bfc))
* **deps:** update dependency through2 to v3 ([#392](https://github.com/conventional-changelog/conventional-changelog/issues/392)) ([26fe91f](https://github.com/conventional-changelog/conventional-changelog/commit/26fe91f))





## [2.0.10](https://github.com/conventional-changelog/conventional-changelog/compare/gulp-conventional-changelog@2.0.9...gulp-conventional-changelog@2.0.10) (2019-02-14)

**Note:** Version bump only for package gulp-conventional-changelog





## [2.0.9](https://github.com/conventional-changelog/conventional-changelog/compare/gulp-conventional-changelog@2.0.8...gulp-conventional-changelog@2.0.9) (2018-11-01)

**Note:** Version bump only for package gulp-conventional-changelog





## [2.0.8](https://github.com/conventional-changelog/conventional-changelog/compare/gulp-conventional-changelog@2.0.7...gulp-conventional-changelog@2.0.8) (2018-11-01)

**Note:** Version bump only for package gulp-conventional-changelog





## [2.0.7](https://github.com/conventional-changelog/conventional-changelog/compare/gulp-conventional-changelog@2.0.6...gulp-conventional-changelog@2.0.7) (2018-11-01)

**Note:** Version bump only for package gulp-conventional-changelog





## [2.0.6](https://github.com/conventional-changelog/conventional-changelog/compare/gulp-conventional-changelog@2.0.5...gulp-conventional-changelog@2.0.6) (2018-11-01)

**Note:** Version bump only for package gulp-conventional-changelog





## [2.0.5](https://github.com/conventional-changelog/conventional-changelog/compare/gulp-conventional-changelog@2.0.4...gulp-conventional-changelog@2.0.5) (2018-11-01)

**Note:** Version bump only for package gulp-conventional-changelog





## [2.0.4](https://github.com/conventional-changelog/conventional-changelog/compare/gulp-conventional-changelog@2.0.3...gulp-conventional-changelog@2.0.4) (2018-11-01)


### Bug Fixes

* Upgrade to Lerna 3, fix Node.js v11 error ([#385](https://github.com/conventional-changelog/conventional-changelog/issues/385)) ([cdef282](https://github.com/conventional-changelog/conventional-changelog/commit/cdef282))





<a name="2.0.3"></a>
## [2.0.3](https://github.com/conventional-changelog/conventional-changelog/compare/gulp-conventional-changelog@2.0.2...gulp-conventional-changelog@2.0.3) (2018-08-21)




**Note:** Version bump only for package gulp-conventional-changelog

<a name="2.0.2"></a>
## [2.0.2](https://github.com/conventional-changelog/conventional-changelog/compare/gulp-conventional-changelog@2.0.1...gulp-conventional-changelog@2.0.2) (2018-08-21)




**Note:** Version bump only for package gulp-conventional-changelog

<a name="2.0.1"></a>
## [2.0.1](https://github.com/conventional-changelog/conventional-changelog/compare/gulp-conventional-changelog@2.0.0...gulp-conventional-changelog@2.0.1) (2018-06-06)




**Note:** Version bump only for package gulp-conventional-changelog

<a name="2.0.0"></a>
# [2.0.0](https://github.com/conventional-changelog/conventional-changelog/compare/gulp-conventional-changelog@1.1.24...gulp-conventional-changelog@2.0.0) (2018-05-29)


### Chores

* **package:** set Node requirement to oldest supported LTS ([#329](https://github.com/conventional-changelog/conventional-changelog/issues/329)) ([cae2fe0](https://github.com/conventional-changelog/conventional-changelog/commit/cae2fe0))


### BREAKING CHANGES

* **package:** Set the package's minimum required Node version to be the oldest LTS
currently supported by the Node Release working group. At this time,
that is Node 6 (which is in its Maintenance LTS phase).




<a name="1.1.24"></a>
## [1.1.24](https://github.com/conventional-changelog/conventional-changelog/compare/gulp-conventional-changelog@1.1.23...gulp-conventional-changelog@1.1.24) (2018-04-16)




**Note:** Version bump only for package gulp-conventional-changelog

<a name="1.1.23"></a>
## [1.1.23](https://github.com/conventional-changelog/conventional-changelog/compare/gulp-conventional-changelog@1.1.22...gulp-conventional-changelog@1.1.23) (2018-03-28)




**Note:** Version bump only for package gulp-conventional-changelog

<a name="1.1.22"></a>
## [1.1.22](https://github.com/conventional-changelog/conventional-changelog/compare/gulp-conventional-changelog@1.1.21...gulp-conventional-changelog@1.1.22) (2018-03-27)




**Note:** Version bump only for package gulp-conventional-changelog

<a name="1.1.21"></a>
## [1.1.21](https://github.com/conventional-changelog/conventional-changelog/compare/gulp-conventional-changelog@1.1.20...gulp-conventional-changelog@1.1.21) (2018-03-27)




**Note:** Version bump only for package gulp-conventional-changelog

<a name="1.1.20"></a>
## [1.1.20](https://github.com/conventional-changelog/conventional-changelog/compare/gulp-conventional-changelog@1.1.19...gulp-conventional-changelog@1.1.20) (2018-03-27)




**Note:** Version bump only for package gulp-conventional-changelog

<a name="1.1.19"></a>
## [1.1.19](https://github.com/conventional-changelog/conventional-changelog/compare/gulp-conventional-changelog@1.1.18...gulp-conventional-changelog@1.1.19) (2018-03-22)




**Note:** Version bump only for package gulp-conventional-changelog

<a name="1.1.18"></a>
## [1.1.18](https://github.com/conventional-changelog/conventional-changelog/compare/gulp-conventional-changelog@1.1.17...gulp-conventional-changelog@1.1.18) (2018-03-03)




**Note:** Version bump only for package gulp-conventional-changelog

<a name="1.1.17"></a>
## [1.1.17](https://github.com/conventional-changelog/conventional-changelog/compare/gulp-conventional-changelog@1.1.16...gulp-conventional-changelog@1.1.17) (2018-02-24)




**Note:** Version bump only for package gulp-conventional-changelog

<a name="1.1.16"></a>
## [1.1.16](https://github.com/conventional-changelog/conventional-changelog/compare/gulp-conventional-changelog@1.1.15...gulp-conventional-changelog@1.1.16) (2018-02-20)




**Note:** Version bump only for package gulp-conventional-changelog

<a name="1.1.15"></a>
## [1.1.15](https://github.com/conventional-changelog/gulp-conventional-changelog/compare/gulp-conventional-changelog@1.1.14...gulp-conventional-changelog@1.1.15) (2018-02-13)




**Note:** Version bump only for package gulp-conventional-changelog

<a name="1.1.14"></a>
## [1.1.14](https://github.com/conventional-changelog/gulp-conventional-changelog/compare/gulp-conventional-changelog@1.1.13...gulp-conventional-changelog@1.1.14) (2018-02-13)




**Note:** Version bump only for package gulp-conventional-changelog

<a name="1.1.13"></a>
## [1.1.13](https://github.com/conventional-changelog/gulp-conventional-changelog/compare/gulp-conventional-changelog@1.1.12...gulp-conventional-changelog@1.1.13) (2018-02-13)




**Note:** Version bump only for package gulp-conventional-changelog

<a name="1.1.12"></a>
## [1.1.12](https://github.com/conventional-changelog/gulp-conventional-changelog/compare/gulp-conventional-changelog@1.1.11...gulp-conventional-changelog@1.1.12) (2018-02-12)




**Note:** Version bump only for package gulp-conventional-changelog

<a name="1.1.11"></a>
## [1.1.11](https://github.com/conventional-changelog/gulp-conventional-changelog/compare/gulp-conventional-changelog@1.1.10...gulp-conventional-changelog@1.1.11) (2018-02-05)




**Note:** Version bump only for package gulp-conventional-changelog

<a name="1.1.10"></a>
## [1.1.10](https://github.com/conventional-changelog/gulp-conventional-changelog/compare/gulp-conventional-changelog@1.1.9...gulp-conventional-changelog@1.1.10) (2018-01-29)




**Note:** Version bump only for package gulp-conventional-changelog

<a name="1.1.9"></a>
## [1.1.9](https://github.com/conventional-changelog/gulp-conventional-changelog/compare/gulp-conventional-changelog@1.1.8...gulp-conventional-changelog@1.1.9) (2017-12-18)




**Note:** Version bump only for package gulp-conventional-changelog

<a name="1.1.8"></a>
## [1.1.8](https://github.com/conventional-changelog/gulp-conventional-changelog/compare/gulp-conventional-changelog@1.1.7...gulp-conventional-changelog@1.1.8) (2017-12-08)




**Note:** Version bump only for package gulp-conventional-changelog

<a name="1.1.7"></a>
## [1.1.7](https://github.com/conventional-changelog/gulp-conventional-changelog/compare/gulp-conventional-changelog@1.1.6...gulp-conventional-changelog@1.1.7) (2017-11-13)




**Note:** Version bump only for package gulp-conventional-changelog

<a name="1.1.6"></a>
## [1.1.6](https://github.com/conventional-changelog/gulp-conventional-changelog/compare/gulp-conventional-changelog@1.1.5...gulp-conventional-changelog@1.1.6) (2017-10-01)

<a name="1.1.5"></a>
## [1.1.5](https://github.com/conventional-changelog/gulp-conventional-changelog/compare/gulp-conventional-changelog@1.1.4...gulp-conventional-changelog@1.1.5) (2017-09-01)

<a name="1.1.4"></a>
## [1.1.4](https://github.com/conventional-changelog/gulp-conventional-changelog/compare/gulp-conventional-changelog@1.1.3...gulp-conventional-changelog@1.1.4) (2017-07-17)

<a name="1.1.3"></a>
## [1.1.3](https://github.com/conventional-changelog/gulp-conventional-changelog/compare/gulp-conventional-changelog@1.1.2...gulp-conventional-changelog@1.1.3) (2017-03-11)

<a name="1.1.0"></a>
# [1.1.0](https://github.com/stevemao/gulp-conventional-changelog/compare/v1.0.1...v1.1.0) (2016-02-13)


### Features

* **debug:** use conventional-changelog 1.1.0 and debug when verbose ([a7d58c7](https://github.com/stevemao/gulp-conventional-changelog/commit/a7d58c7))



<a name="1.0.1"></a>
## [1.0.1](https://github.com/stevemao/gulp-conventional-changelog/compare/v1.0.0...v1.0.1) (2016-02-10)


### Bug Fixes

* **error:** error should be emitted ([d49a6ec](https://github.com/stevemao/gulp-conventional-changelog/commit/d49a6ec))



<a name="1.0.0"></a>
# [1.0.0](https://github.com/stevemao/gulp-conventional-changelog/compare/v0.7.0...v1.0.0) (2016-02-08)


### Chores

* **deps:** bump ([82ce9aa](https://github.com/stevemao/gulp-conventional-changelog/commit/82ce9aa))


### BREAKING CHANGES

* deps: Using conventional-changelog v1.



<a name="0.7.0"></a>
# [0.7.0](https://github.com/stevemao/gulp-conventional-changelog/compare/v0.6.0...v0.7.0) (2015-09-30)


### Features

* **deps:** bump ([7109a32](https://github.com/stevemao/gulp-conventional-changelog/commit/7109a32))


### BREAKING CHANGES

* deps: Use conventional-changelog^0.5.0



<a name="0.6.0"></a>
# [0.6.0](https://github.com/stevemao/gulp-conventional-changelog/compare/v0.5.0...v0.6.0) (2015-08-15)
