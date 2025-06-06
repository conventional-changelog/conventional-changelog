# Changelog

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [5.0.0](https://github.com/conventional-changelog/conventional-changelog/compare/git-raw-commits-v4.0.0...git-raw-commits-v5.0.0) (2024-04-26)

### ⚠ BREAKING CHANGES

* Node >= 18 is required
* **git-raw-commits:** refactored to use @conventional-changelog/git-client ([#1199](https://github.com/conventional-changelog/conventional-changelog/issues/1199))
* Now all packages, except gulp-conventional-changelog, are ESM-only.
* **git-semver-tags,conventional-recommended-bump:** gitSemverTags and conventionalRecommendedBump now return promises
* **standard-changelog:** createIfMissing method now returns a promise

### Features

* drop node 16 support ([#1226](https://github.com/conventional-changelog/conventional-changelog/issues/1226)) ([ec69cfd](https://github.com/conventional-changelog/conventional-changelog/commit/ec69cfdf0040f73ec0eadc4779c37874e71f3dff))
* **git-client:** GitClient#getLastTag and ConventionalGitClient#getLastSemverTag methods are added. GitClient#getRawCommits ignore param is added. ([#1217](https://github.com/conventional-changelog/conventional-changelog/issues/1217)) ([53254b3](https://github.com/conventional-changelog/conventional-changelog/commit/53254b3e14258e1f6779a2b4462199dda630f96e))
* **git-raw-commits:** refactored to use @conventional-changelog/git-client ([#1199](https://github.com/conventional-changelog/conventional-changelog/issues/1199)) ([ba03ffc](https://github.com/conventional-changelog/conventional-changelog/commit/ba03ffc3c05e794db48b18a508f296d4d662a5d9))
* **git-semver-tags,conventional-recommended-bump:** refactoring to use promises instead of callbacks ([#1112](https://github.com/conventional-changelog/conventional-changelog/issues/1112)) ([1697ecd](https://github.com/conventional-changelog/conventional-changelog/commit/1697ecdf4c2329732e612cc1bd3323e84f046f3a))
* move from CommonJS to ESM ([#1144](https://github.com/conventional-changelog/conventional-changelog/issues/1144)) ([c5b859d](https://github.com/conventional-changelog/conventional-changelog/commit/c5b859d201e124822002eb54574f003f074216e2))
* **standard-changelog:** use promises ([#1111](https://github.com/conventional-changelog/conventional-changelog/issues/1111)) ([5015ab7](https://github.com/conventional-changelog/conventional-changelog/commit/5015ab71de7a3db9cbcbbabd0cc25502f1cd0109))

### Bug Fixes

* **deps:** update dependency meow to v13 ([#1190](https://github.com/conventional-changelog/conventional-changelog/issues/1190)) ([862f66b](https://github.com/conventional-changelog/conventional-changelog/commit/862f66ba99989af2d44a524b11bc3a873426b00b))

## [4.0.0](https://github.com/conventional-changelog/conventional-changelog/compare/git-raw-commits-v3.0.0...git-raw-commits-v4.0.0) (2023-08-26)

### ⚠ BREAKING CHANGES

* Node >= 16 is required

### Features

* drop node 14 support ([#1085](https://github.com/conventional-changelog/conventional-changelog/issues/1085)) ([1bce036](https://github.com/conventional-changelog/conventional-changelog/commit/1bce0362dbb624a869eb01fd7724ab7f81d337e6))
* **git-raw-commits:** add support for multiple paths ([#1079](https://github.com/conventional-changelog/conventional-changelog/issues/1079)) ([107daf2](https://github.com/conventional-changelog/conventional-changelog/commit/107daf24368b07301e1fd6611a8e7c3d7d7cd637))
* **git-raw-commits:** ignore commits by regex ([#1063](https://github.com/conventional-changelog/conventional-changelog/issues/1063)) ([47033e6](https://github.com/conventional-changelog/conventional-changelog/commit/47033e6edfea3705383bb075bc6a4bd417f9ed8c))

### Bug Fixes

* **deps:** update dependency dargs to v8 ([#1028](https://github.com/conventional-changelog/conventional-changelog/issues/1028)) ([1dbcc99](https://github.com/conventional-changelog/conventional-changelog/commit/1dbcc993ba0352b140fcf7074c1ee4078298ea5f))
* **deps:** update dependency split2 to v4 ([#1032](https://github.com/conventional-changelog/conventional-changelog/issues/1032)) ([d16ccc5](https://github.com/conventional-changelog/conventional-changelog/commit/d16ccc5df75f2c728417d20324b6eb6e746633ab))
* fix semver vulnerability ([#1071](https://github.com/conventional-changelog/conventional-changelog/issues/1071)) ([3f5c99d](https://github.com/conventional-changelog/conventional-changelog/commit/3f5c99d503ea1bf01df679f4180c39516e190b21)), closes [#1019](https://github.com/conventional-changelog/conventional-changelog/issues/1019)

## [3.0.0](https://github.com/conventional-changelog/conventional-changelog/compare/git-raw-commits-v2.0.11...git-raw-commits-v3.0.0) (2023-06-06)

### ⚠ BREAKING CHANGES

* Node >= 14 is required

### Code Refactoring

* drop lodash from dependencies where it possible ([#959](https://github.com/conventional-changelog/conventional-changelog/issues/959)) ([a8b4e12](https://github.com/conventional-changelog/conventional-changelog/commit/a8b4e12883021231befc6bdfeb95a9b50637f361))

### [2.0.11](https://github.com/conventional-changelog/conventional-changelog/compare/git-raw-commits-v2.0.10...git-raw-commits-v2.0.11) (2021-12-29)

### Bug Fixes

* allow raw commits to be filtered by path and date range ([#893](https://github.com/conventional-changelog/conventional-changelog/issues/893)) ([b2245a7](https://github.com/conventional-changelog/conventional-changelog/commit/b2245a766c70d280380abbbe85c4894eee04fdd0))

### [2.0.10](https://www.github.com/conventional-changelog/conventional-changelog/compare/v2.0.9...v2.0.10) (2021-01-27)

### Bug Fixes

* align lodash dependency across packages ([#737](https://www.github.com/conventional-changelog/conventional-changelog/issues/737)) ([d9feeb6](https://www.github.com/conventional-changelog/conventional-changelog/commit/d9feeb605de28c00ef55b5c8e229efd1289dd6e8))
* revert normalize git show signature option to false ([c4d9042](https://www.github.com/conventional-changelog/conventional-changelog/commit/c4d9042ae83aa2c823dca181dd72e5a8b3163c1e))

### [2.0.9](https://www.github.com/conventional-changelog/conventional-changelog/compare/git-raw-commits@2.0.8...v2.0.9) (2020-12-29)

### Bug Fixes

* normalize git show signature option to false ([#671](https://www.github.com/conventional-changelog/conventional-changelog/issues/671)) ([a0b348c](https://www.github.com/conventional-changelog/conventional-changelog/commit/a0b348c7a74ba49bb07053ed1d25c2053a7c3b1a)), closes [conventional-changelog/commitlint#2118](https://www.github.com/conventional-changelog/commitlint/issues/2118)

## [2.0.8](https://github.com/conventional-changelog/conventional-changelog/compare/git-raw-commits@2.0.7...git-raw-commits@2.0.8) (2020-11-05)

### Bug Fixes

* **deps:** update dependency through2 to v4 ([#657](https://github.com/conventional-changelog/conventional-changelog/issues/657)) ([7ae618c](https://github.com/conventional-changelog/conventional-changelog/commit/7ae618c81491841e5b1d796d3933aac0c54bc312))

## [2.0.7](https://github.com/conventional-changelog/conventional-changelog/compare/git-raw-commits@2.0.3...git-raw-commits@2.0.7) (2020-05-08)

### Bug Fixes

* **deps:** update yargs-parser to move off a flagged-vulnerable version. ([#635](https://github.com/conventional-changelog/conventional-changelog/issues/635)) ([aafc0f0](https://github.com/conventional-changelog/conventional-changelog/commit/aafc0f00412c3e4b23b8418300e5a570a48fe24d))

## [2.0.3](https://github.com/conventional-changelog/conventional-changelog/compare/git-raw-commits@2.0.2...git-raw-commits@2.0.3) (2019-11-14)

**Note:** Version bump only for package git-raw-commits

## [2.0.2](https://github.com/conventional-changelog/conventional-changelog/compare/git-raw-commits@2.0.1...git-raw-commits@2.0.2) (2019-04-10)

### Bug Fixes

* **deps:** update dependency through2 to v3 ([#392](https://github.com/conventional-changelog/conventional-changelog/issues/392)) ([26fe91f](https://github.com/conventional-changelog/conventional-changelog/commit/26fe91f))

## [2.0.1](https://github.com/conventional-changelog/conventional-changelog/compare/git-raw-commits@2.0.0...git-raw-commits@2.0.1) (2018-11-01)

### Bug Fixes

* Upgrade to Lerna 3, fix Node.js v11 error ([#385](https://github.com/conventional-changelog/conventional-changelog/issues/385)) ([cdef282](https://github.com/conventional-changelog/conventional-changelog/commit/cdef282))

<a name="2.0.0"></a>
# [2.0.0](https://github.com/conventional-changelog/conventional-changelog/compare/git-raw-commits@1.3.6...git-raw-commits@2.0.0) (2018-05-29)

### Chores

* **package:** set Node requirement to oldest supported LTS ([#329](https://github.com/conventional-changelog/conventional-changelog/issues/329)) ([cae2fe0](https://github.com/conventional-changelog/conventional-changelog/commit/cae2fe0))

### BREAKING CHANGES

* **package:** Set the package's minimum required Node version to be the oldest LTS
currently supported by the Node Release working group. At this time,
that is Node 6 (which is in its Maintenance LTS phase).

<a name="1.3.6"></a>
## [1.3.6](https://github.com/conventional-changelog/conventional-changelog/compare/git-raw-commits@1.3.5...git-raw-commits@1.3.6) (2018-03-27)

**Note:** Version bump only for package git-raw-commits

<a name="1.3.5"></a>
## [1.3.5](https://github.com/conventional-changelog/conventional-changelog/compare/git-raw-commits@1.3.4...git-raw-commits@1.3.5) (2018-03-22)

**Note:** Version bump only for package git-raw-commits

<a name="1.3.4"></a>
## [1.3.4](https://github.com/conventional-changelog/conventional-changelog/compare/git-raw-commits@1.3.3...git-raw-commits@1.3.4) (2018-02-24)

**Note:** Version bump only for package git-raw-commits

<a name="1.3.3"></a>
## [1.3.3](https://github.com/conventional-changelog/conventional-changelog/compare/git-raw-commits@1.3.2...git-raw-commits@1.3.3) (2018-02-20)

**Note:** Version bump only for package git-raw-commits

<a name="1.3.2"></a>
## [1.3.2](https://github.com/conventional-changelog/git-raw-commits/compare/git-raw-commits@1.3.1...git-raw-commits@1.3.2) (2018-02-13)

**Note:** Version bump only for package git-raw-commits

<a name="1.3.1"></a>
## [1.3.1](https://github.com/conventional-changelog/git-raw-commits/compare/git-raw-commits@1.3.0...git-raw-commits@1.3.1) (2018-02-13)

**Note:** Version bump only for package git-raw-commits

<a name="1.3.0"></a>
# [1.3.0](https://github.com/conventional-changelog/git-raw-commits/compare/git-raw-commits@1.2.0...git-raw-commits@1.3.0) (2017-11-13)

### Features

* **git-raw-commits:** add execOpts.cwd ([2631213](https://github.com/conventional-changelog/git-raw-commits/commit/2631213))

<a name="1.2.0"></a>
# [1.2.0](https://github.com/conventional-changelog/conventional-changelog/compare/git-raw-commits@1.1.2...v1.2.0) (2017-03-10)

### Features

* allow raw commits to be filtered by path ([#172](https://github.com/conventional-changelog/conventional-changelog/issues/172)) ([ec0a25d](https://github.com/conventional-changelog/conventional-changelog/commit/ec0a25d))
* migrate repo to lerna mono-repo ([793e823](https://github.com/conventional-changelog/conventional-changelog/commit/793e823))

<a name="1.1.2"></a>
## [1.1.2](https://github.com/conventional-changelog/git-raw-commits/compare/v1.1.1...v1.1.2) (2016-06-27)

### Bug Fixes

* **windows:** use execFile for executing git ([9ae06df](https://github.com/conventional-changelog/git-raw-commits/commit/9ae06df)), closes [#11](https://github.com/conventional-changelog/git-raw-commits/issues/11)

<a name="1.1.1"></a>
## [1.1.1](https://github.com/conventional-changelog/git-raw-commits/compare/v1.1.0...v1.1.1) (2016-06-26)

### Bug Fixes

* **windows:** escape command percent signs ([005b559](https://github.com/conventional-changelog/git-raw-commits/commit/005b559)), closes [#10](https://github.com/conventional-changelog/git-raw-commits/issues/10)
