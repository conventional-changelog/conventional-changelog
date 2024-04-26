# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [6.0.0](https://github.com/conventional-changelog/conventional-changelog/compare/standard-changelog-v5.0.0...standard-changelog-v6.0.0) (2024-04-26)


### ⚠ BREAKING CHANGES

* Node >= 18 is required
* Now all packages, except gulp-conventional-changelog, are ESM-only.

### Features

* drop node 16 support ([#1226](https://github.com/conventional-changelog/conventional-changelog/issues/1226)) ([ec69cfd](https://github.com/conventional-changelog/conventional-changelog/commit/ec69cfdf0040f73ec0eadc4779c37874e71f3dff))
* move from CommonJS to ESM ([#1144](https://github.com/conventional-changelog/conventional-changelog/issues/1144)) ([c5b859d](https://github.com/conventional-changelog/conventional-changelog/commit/c5b859d201e124822002eb54574f003f074216e2))


### Bug Fixes

* **conventional-changelog-cli,conventional-recommended-bump,standard-changelog:** fix config loading ([#1234](https://github.com/conventional-changelog/conventional-changelog/issues/1234)) ([c2c4b3a](https://github.com/conventional-changelog/conventional-changelog/commit/c2c4b3a4cb60f784a4e7ee83d189b85c0acac960))
* **deps:** update dependency meow to v13 ([#1190](https://github.com/conventional-changelog/conventional-changelog/issues/1190)) ([862f66b](https://github.com/conventional-changelog/conventional-changelog/commit/862f66ba99989af2d44a524b11bc3a873426b00b))

## [5.0.0](https://github.com/conventional-changelog/conventional-changelog/compare/standard-changelog-v4.0.0...standard-changelog-v5.0.0) (2023-09-08)


### ⚠ BREAKING CHANGES

* **git-semver-tags,conventional-recommended-bump:** gitSemverTags and conventionalRecommendedBump now return promises
* **standard-changelog:** createIfMissing method now returns a promise

### Features

* **git-semver-tags,conventional-recommended-bump:** refactoring to use promises instead of callbacks ([#1112](https://github.com/conventional-changelog/conventional-changelog/issues/1112)) ([1697ecd](https://github.com/conventional-changelog/conventional-changelog/commit/1697ecdf4c2329732e612cc1bd3323e84f046f3a))
* **standard-changelog:** use promises ([#1111](https://github.com/conventional-changelog/conventional-changelog/issues/1111)) ([5015ab7](https://github.com/conventional-changelog/conventional-changelog/commit/5015ab71de7a3db9cbcbbabd0cc25502f1cd0109))

## [4.0.0](https://github.com/conventional-changelog/conventional-changelog/compare/standard-changelog-v3.0.0...standard-changelog-v4.0.0) (2023-08-26)


### ⚠ BREAKING CHANGES

* Node >= 16 is required
* Now all presets are exports preset config factory function. conventional-changelog-preset-loader now exports new loadPreset and createPresetLoader functions. If you are using presets indirectly, using preset name, no any changes in configuration needed, just upgrade packages to latest versions.

### Features

* drop node 14 support ([#1085](https://github.com/conventional-changelog/conventional-changelog/issues/1085)) ([1bce036](https://github.com/conventional-changelog/conventional-changelog/commit/1bce0362dbb624a869eb01fd7724ab7f81d337e6))
* migrate from chalk to picocolors ([#1074](https://github.com/conventional-changelog/conventional-changelog/issues/1074)) ([c746701](https://github.com/conventional-changelog/conventional-changelog/commit/c7467017584616037d9ed8cb926b8e99a161cc5e))
* unified presets interface ([#1045](https://github.com/conventional-changelog/conventional-changelog/issues/1045)) ([8d0ffbe](https://github.com/conventional-changelog/conventional-changelog/commit/8d0ffbe6c59b861b560cea0e3594c7b32e978cc3))


### Bug Fixes

* **deps:** update dependency tempfile to v5 ([#1041](https://github.com/conventional-changelog/conventional-changelog/issues/1041)) ([c026e30](https://github.com/conventional-changelog/conventional-changelog/commit/c026e3006cd4cc2d49812ff8a4cfa9f3d4b3795c))
* fix semver vulnerability ([#1071](https://github.com/conventional-changelog/conventional-changelog/issues/1071)) ([3f5c99d](https://github.com/conventional-changelog/conventional-changelog/commit/3f5c99d503ea1bf01df679f4180c39516e190b21)), closes [#1019](https://github.com/conventional-changelog/conventional-changelog/issues/1019)

## [3.0.0](https://github.com/conventional-changelog/conventional-changelog/compare/standard-changelog-v2.0.27...standard-changelog-v3.0.0) (2023-06-06)


### ⚠ BREAKING CHANGES

* Node >= 14 is required

### Features

* update CLI tools to support lerna tags ([#175](https://github.com/conventional-changelog/conventional-changelog/issues/175)) ([1fc5612](https://github.com/conventional-changelog/conventional-changelog/commit/1fc561217d79978b9d0248612b75e87c4b4a2d0b))


### Bug Fixes

* add types for cli flags ([#551](https://github.com/conventional-changelog/conventional-changelog/issues/551)) ([bf1d64a](https://github.com/conventional-changelog/conventional-changelog/commit/bf1d64aeaf8f262d4b2beec02d2aebb78df7343b))

### Code Refactoring

* drop lodash from dependencies where it possible ([#959](https://github.com/conventional-changelog/conventional-changelog/issues/959)) ([a8b4e12](https://github.com/conventional-changelog/conventional-changelog/commit/a8b4e12883021231befc6bdfeb95a9b50637f361))

## [2.0.27](https://github.com/conventional-changelog/conventional-changelog/compare/standard-changelog@2.0.26...standard-changelog@2.0.27) (2020-11-05)

**Note:** Version bump only for package standard-changelog





## [2.0.26](https://github.com/conventional-changelog/conventional-changelog/compare/standard-changelog@2.0.25...standard-changelog@2.0.26) (2020-08-12)

**Note:** Version bump only for package standard-changelog





## [2.0.25](https://github.com/conventional-changelog/conventional-changelog/compare/standard-changelog@2.0.24...standard-changelog@2.0.25) (2020-06-20)

**Note:** Version bump only for package standard-changelog





## [2.0.24](https://github.com/conventional-changelog/conventional-changelog/compare/standard-changelog@2.0.23...standard-changelog@2.0.24) (2020-05-08)

**Note:** Version bump only for package standard-changelog





## [2.0.23](https://github.com/conventional-changelog/conventional-changelog/compare/standard-changelog@2.0.19...standard-changelog@2.0.23) (2020-05-08)


### Bug Fixes

* **deps:** update yargs-parser to move off a flagged-vulnerable version. ([#635](https://github.com/conventional-changelog/conventional-changelog/issues/635)) ([aafc0f0](https://github.com/conventional-changelog/conventional-changelog/commit/aafc0f00412c3e4b23b8418300e5a570a48fe24d))





## [2.0.19](https://github.com/conventional-changelog/conventional-changelog/compare/standard-changelog@2.0.18...standard-changelog@2.0.19) (2019-11-21)

**Note:** Version bump only for package standard-changelog





## [2.0.18](https://github.com/conventional-changelog/conventional-changelog/compare/standard-changelog@2.0.17...standard-changelog@2.0.18) (2019-11-14)


### Bug Fixes

* add types for cli flags ([#551](https://github.com/conventional-changelog/conventional-changelog/issues/551)) ([bf1d64a](https://github.com/conventional-changelog/conventional-changelog/commit/bf1d64aeaf8f262d4b2beec02d2aebb78df7343b))





## [2.0.17](https://github.com/conventional-changelog/conventional-changelog/compare/standard-changelog@2.0.16...standard-changelog@2.0.17) (2019-11-07)

**Note:** Version bump only for package standard-changelog





## [2.0.16](https://github.com/conventional-changelog/conventional-changelog/compare/standard-changelog@2.0.15...standard-changelog@2.0.16) (2019-10-24)


### Bug Fixes

* **deps:** update dependency rimraf to v3 ([#514](https://github.com/conventional-changelog/conventional-changelog/issues/514)) ([c7e1706](https://github.com/conventional-changelog/conventional-changelog/commit/c7e17062a7a38a194164c47d0e88fcbe3fb6490c))
* **deps:** update lodash to fix security issues ([#535](https://github.com/conventional-changelog/conventional-changelog/issues/535)) ([ac43f51](https://github.com/conventional-changelog/conventional-changelog/commit/ac43f51de1f3b597c32f7f8442917a2d06199018))





## [2.0.14](https://github.com/conventional-changelog/conventional-changelog/compare/standard-changelog@2.0.13...standard-changelog@2.0.14) (2019-10-02)


### Bug Fixes

* **deps:** update dependency tempfile to v3 ([#459](https://github.com/conventional-changelog/conventional-changelog/issues/459)) ([c0bac28](https://github.com/conventional-changelog/conventional-changelog/commit/c0bac28))





## [2.0.13](https://github.com/conventional-changelog/conventional-changelog/compare/standard-changelog@2.0.12...standard-changelog@2.0.13) (2019-07-29)

**Note:** Version bump only for package standard-changelog





## [2.0.12](https://github.com/conventional-changelog/conventional-changelog/compare/standard-changelog@2.0.11...standard-changelog@2.0.12) (2019-05-18)


### Bug Fixes

* **deps:** update dependency figures to v3 ([#453](https://github.com/conventional-changelog/conventional-changelog/issues/453)) ([099b5b5](https://github.com/conventional-changelog/conventional-changelog/commit/099b5b5))





## [2.0.11](https://github.com/conventional-changelog/conventional-changelog/compare/standard-changelog@2.0.10...standard-changelog@2.0.11) (2019-05-05)

**Note:** Version bump only for package standard-changelog





## [2.0.10](https://github.com/conventional-changelog/conventional-changelog/compare/standard-changelog@2.0.9...standard-changelog@2.0.10) (2019-04-11)

**Note:** Version bump only for package standard-changelog





## [2.0.9](https://github.com/conventional-changelog/conventional-changelog/compare/standard-changelog@2.0.8...standard-changelog@2.0.9) (2019-04-11)

**Note:** Version bump only for package standard-changelog





## [2.0.8](https://github.com/conventional-changelog/conventional-changelog/compare/standard-changelog@2.0.7...standard-changelog@2.0.8) (2019-04-10)

**Note:** Version bump only for package standard-changelog





## [2.0.7](https://github.com/conventional-changelog/conventional-changelog/compare/standard-changelog@2.0.6...standard-changelog@2.0.7) (2019-02-14)

**Note:** Version bump only for package standard-changelog





## [2.0.6](https://github.com/conventional-changelog/conventional-changelog/compare/standard-changelog@2.0.5...standard-changelog@2.0.6) (2018-11-01)

**Note:** Version bump only for package standard-changelog





## [2.0.5](https://github.com/conventional-changelog/conventional-changelog/compare/standard-changelog@2.0.4...standard-changelog@2.0.5) (2018-11-01)

**Note:** Version bump only for package standard-changelog





## [2.0.4](https://github.com/conventional-changelog/conventional-changelog/compare/standard-changelog@2.0.3...standard-changelog@2.0.4) (2018-11-01)

**Note:** Version bump only for package standard-changelog





## [2.0.3](https://github.com/conventional-changelog/conventional-changelog/compare/standard-changelog@2.0.2...standard-changelog@2.0.3) (2018-11-01)

**Note:** Version bump only for package standard-changelog





## [2.0.2](https://github.com/conventional-changelog/conventional-changelog/compare/standard-changelog@2.0.1...standard-changelog@2.0.2) (2018-11-01)


### Bug Fixes

* Upgrade to Lerna 3, fix Node.js v11 error ([#385](https://github.com/conventional-changelog/conventional-changelog/issues/385)) ([cdef282](https://github.com/conventional-changelog/conventional-changelog/commit/cdef282))





<a name="2.0.1"></a>
## [2.0.1](https://github.com/conventional-changelog/conventional-changelog/compare/standard-changelog@2.0.0...standard-changelog@2.0.1) (2018-08-21)




**Note:** Version bump only for package standard-changelog

<a name="2.0.0"></a>
# [2.0.0](https://github.com/conventional-changelog/conventional-changelog/compare/standard-changelog@1.0.19...standard-changelog@2.0.0) (2018-05-29)


### Chores

* **package:** set Node requirement to oldest supported LTS ([#329](https://github.com/conventional-changelog/conventional-changelog/issues/329)) ([cae2fe0](https://github.com/conventional-changelog/conventional-changelog/commit/cae2fe0))


### BREAKING CHANGES

* **package:** Set the package's minimum required Node version to be the oldest LTS
currently supported by the Node Release working group. At this time,
that is Node 6 (which is in its Maintenance LTS phase).




<a name="1.0.19"></a>
## [1.0.19](https://github.com/conventional-changelog/conventional-changelog/compare/standard-changelog@1.0.18...standard-changelog@1.0.19) (2018-04-16)




**Note:** Version bump only for package standard-changelog

<a name="1.0.18"></a>
## [1.0.18](https://github.com/conventional-changelog/conventional-changelog/compare/standard-changelog@1.0.17...standard-changelog@1.0.18) (2018-03-28)




**Note:** Version bump only for package standard-changelog

<a name="1.0.17"></a>
## [1.0.17](https://github.com/conventional-changelog/conventional-changelog/compare/standard-changelog@1.0.16...standard-changelog@1.0.17) (2018-03-27)




**Note:** Version bump only for package standard-changelog

<a name="1.0.16"></a>
## [1.0.16](https://github.com/conventional-changelog/conventional-changelog/compare/standard-changelog@1.0.15...standard-changelog@1.0.16) (2018-03-27)




**Note:** Version bump only for package standard-changelog

<a name="1.0.15"></a>
## [1.0.15](https://github.com/conventional-changelog/conventional-changelog/compare/standard-changelog@1.0.14...standard-changelog@1.0.15) (2018-03-27)




**Note:** Version bump only for package standard-changelog

<a name="1.0.14"></a>
## [1.0.14](https://github.com/conventional-changelog/conventional-changelog/compare/standard-changelog@1.0.13...standard-changelog@1.0.14) (2018-03-22)




**Note:** Version bump only for package standard-changelog

<a name="1.0.13"></a>
## [1.0.13](https://github.com/conventional-changelog/conventional-changelog/compare/standard-changelog@1.0.12...standard-changelog@1.0.13) (2018-02-24)




**Note:** Version bump only for package standard-changelog

<a name="1.0.12"></a>
## [1.0.12](https://github.com/conventional-changelog/conventional-changelog/compare/standard-changelog@1.0.11...standard-changelog@1.0.12) (2018-02-20)




**Note:** Version bump only for package standard-changelog

<a name="1.0.11"></a>
## [1.0.11](https://github.com/stevemao/standard-changelog/compare/standard-changelog@1.0.10...standard-changelog@1.0.11) (2018-02-13)




**Note:** Version bump only for package standard-changelog

<a name="1.0.10"></a>
## [1.0.10](https://github.com/stevemao/standard-changelog/compare/standard-changelog@1.0.9...standard-changelog@1.0.10) (2018-02-13)




**Note:** Version bump only for package standard-changelog

<a name="1.0.9"></a>
## [1.0.9](https://github.com/stevemao/standard-changelog/compare/standard-changelog@1.0.8...standard-changelog@1.0.9) (2018-02-05)




**Note:** Version bump only for package standard-changelog

<a name="1.0.8"></a>
## [1.0.8](https://github.com/stevemao/standard-changelog/compare/standard-changelog@1.0.7...standard-changelog@1.0.8) (2018-01-29)




**Note:** Version bump only for package standard-changelog

<a name="1.0.7"></a>
## [1.0.7](https://github.com/stevemao/standard-changelog/compare/standard-changelog@1.0.6...standard-changelog@1.0.7) (2017-12-18)




**Note:** Version bump only for package standard-changelog

<a name="1.0.6"></a>
## [1.0.6](https://github.com/stevemao/standard-changelog/compare/standard-changelog@1.0.5...standard-changelog@1.0.6) (2017-12-08)




**Note:** Version bump only for package standard-changelog

<a name="1.0.5"></a>
## [1.0.5](https://github.com/stevemao/standard-changelog/compare/standard-changelog@1.0.4...standard-changelog@1.0.5) (2017-11-13)




**Note:** Version bump only for package standard-changelog

<a name="1.0.4"></a>
## [1.0.4](https://github.com/stevemao/standard-changelog/compare/standard-changelog@1.0.3...standard-changelog@1.0.4) (2017-10-01)

<a name="1.0.3"></a>
## [1.0.3](https://github.com/stevemao/standard-changelog/compare/standard-changelog@1.0.2...standard-changelog@1.0.3) (2017-09-01)

<a name="1.0.2"></a>
## [1.0.2](https://github.com/stevemao/standard-changelog/compare/standard-changelog@1.0.1...standard-changelog@1.0.2) (2017-07-17)

<a name="1.0.1"></a>
## [1.0.1](https://github.com/stevemao/standard-changelog/compare/standard-changelog@1.0.0...standard-changelog@1.0.1) (2017-03-11)

<a name="0.0.1"></a>
## 0.0.1 (2016-01-30)


### Features

* init ([df41edb](https://github.com/stevemao/standard-changelog/commit/df41edb)), closes [ajoslin/conventional-changelog#84](https://github.com/ajoslin/conventional-changelog/issues/84)
