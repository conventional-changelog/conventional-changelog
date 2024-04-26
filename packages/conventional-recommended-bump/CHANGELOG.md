# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [10.0.0](https://github.com/conventional-changelog/conventional-changelog/compare/conventional-recommended-bump-v9.0.0...conventional-recommended-bump-v10.0.0) (2024-04-26)


### ⚠ BREAKING CHANGES

* Node >= 18 is required
* **conventional-recommended-bump:** new `Bumper` exported class ([#1218](https://github.com/conventional-changelog/conventional-changelog/issues/1218))
* cleanup presets interface ([#1215](https://github.com/conventional-changelog/conventional-changelog/issues/1215))
* **git-semver-tags:** refactored to use @conventional-changelog/git-client ([#1203](https://github.com/conventional-changelog/conventional-changelog/issues/1203))
* **git-raw-commits:** refactored to use @conventional-changelog/git-client ([#1199](https://github.com/conventional-changelog/conventional-changelog/issues/1199))
* **conventional-commits-filter:** rewrite to TypeScript ([#1178](https://github.com/conventional-changelog/conventional-changelog/issues/1178))
* **conventional-commits-parser:** rewrite to TypeScript ([#1126](https://github.com/conventional-changelog/conventional-changelog/issues/1126))
* Now all packages, except gulp-conventional-changelog, are ESM-only.

### Features

* cleanup presets interface ([#1215](https://github.com/conventional-changelog/conventional-changelog/issues/1215)) ([0e4f293](https://github.com/conventional-changelog/conventional-changelog/commit/0e4f2935add5dbf68410ea3c245ed8bd13e292a8))
* **conventional-commits-filter:** rewrite to TypeScript ([#1178](https://github.com/conventional-changelog/conventional-changelog/issues/1178)) ([e0c7b06](https://github.com/conventional-changelog/conventional-changelog/commit/e0c7b060202100ab82d858986ce43ba1b310d496))
* **conventional-commits-parser:** rewrite to TypeScript ([#1126](https://github.com/conventional-changelog/conventional-changelog/issues/1126)) ([9e280d8](https://github.com/conventional-changelog/conventional-changelog/commit/9e280d89f33e2185643e2531edb668bd0e0df22c))
* **conventional-recommended-bump:** new `Bumper` exported class ([#1218](https://github.com/conventional-changelog/conventional-changelog/issues/1218)) ([0ddc8cd](https://github.com/conventional-changelog/conventional-changelog/commit/0ddc8cdceb91f838f9f73e0bff8e3f140176a13a))
* drop node 16 support ([#1226](https://github.com/conventional-changelog/conventional-changelog/issues/1226)) ([ec69cfd](https://github.com/conventional-changelog/conventional-changelog/commit/ec69cfdf0040f73ec0eadc4779c37874e71f3dff))
* **git-raw-commits:** refactored to use @conventional-changelog/git-client ([#1199](https://github.com/conventional-changelog/conventional-changelog/issues/1199)) ([ba03ffc](https://github.com/conventional-changelog/conventional-changelog/commit/ba03ffc3c05e794db48b18a508f296d4d662a5d9))
* **git-semver-tags:** refactored to use @conventional-changelog/git-client ([#1203](https://github.com/conventional-changelog/conventional-changelog/issues/1203)) ([7ac1860](https://github.com/conventional-changelog/conventional-changelog/commit/7ac186060b16ea66847c401d57ca78157329d778))
* move from CommonJS to ESM ([#1144](https://github.com/conventional-changelog/conventional-changelog/issues/1144)) ([c5b859d](https://github.com/conventional-changelog/conventional-changelog/commit/c5b859d201e124822002eb54574f003f074216e2))


### Bug Fixes

* **conventional-changelog-cli,conventional-recommended-bump,standard-changelog:** fix config loading ([#1234](https://github.com/conventional-changelog/conventional-changelog/issues/1234)) ([c2c4b3a](https://github.com/conventional-changelog/conventional-changelog/commit/c2c4b3a4cb60f784a4e7ee83d189b85c0acac960))
* **deps:** update dependency meow to v13 ([#1190](https://github.com/conventional-changelog/conventional-changelog/issues/1190)) ([862f66b](https://github.com/conventional-changelog/conventional-changelog/commit/862f66ba99989af2d44a524b11bc3a873426b00b))

## [9.0.0](https://github.com/conventional-changelog/conventional-changelog/compare/conventional-recommended-bump-v8.0.0...conventional-recommended-bump-v9.0.0) (2023-09-08)


### ⚠ BREAKING CHANGES

* **git-semver-tags,conventional-recommended-bump:** gitSemverTags and conventionalRecommendedBump now return promises
* **standard-changelog:** createIfMissing method now returns a promise

### Features

* **git-semver-tags,conventional-recommended-bump:** refactoring to use promises instead of callbacks ([#1112](https://github.com/conventional-changelog/conventional-changelog/issues/1112)) ([1697ecd](https://github.com/conventional-changelog/conventional-changelog/commit/1697ecdf4c2329732e612cc1bd3323e84f046f3a))
* **standard-changelog:** use promises ([#1111](https://github.com/conventional-changelog/conventional-changelog/issues/1111)) ([5015ab7](https://github.com/conventional-changelog/conventional-changelog/commit/5015ab71de7a3db9cbcbbabd0cc25502f1cd0109))

## [8.0.0](https://github.com/conventional-changelog/conventional-changelog/compare/conventional-recommended-bump-v7.0.1...conventional-recommended-bump-v8.0.0) (2023-08-26)


### ⚠ BREAKING CHANGES

* Node >= 16 is required
* Now all presets are exports preset config factory function. conventional-changelog-preset-loader now exports new loadPreset and createPresetLoader functions. If you are using presets indirectly, using preset name, no any changes in configuration needed, just upgrade packages to latest versions.

### Features

* drop node 14 support ([#1085](https://github.com/conventional-changelog/conventional-changelog/issues/1085)) ([1bce036](https://github.com/conventional-changelog/conventional-changelog/commit/1bce0362dbb624a869eb01fd7724ab7f81d337e6))
* **git-semver-tags,conventional-recommended-bump:** define `skip-unstable` option in cli ([#1066](https://github.com/conventional-changelog/conventional-changelog/issues/1066)) ([0ffec3f](https://github.com/conventional-changelog/conventional-changelog/commit/0ffec3f60a1119e180e244b5500f9a8c35671a98))
* unified presets interface ([#1045](https://github.com/conventional-changelog/conventional-changelog/issues/1045)) ([8d0ffbe](https://github.com/conventional-changelog/conventional-changelog/commit/8d0ffbe6c59b861b560cea0e3594c7b32e978cc3))


### Bug Fixes

* fix semver vulnerability ([#1071](https://github.com/conventional-changelog/conventional-changelog/issues/1071)) ([3f5c99d](https://github.com/conventional-changelog/conventional-changelog/commit/3f5c99d503ea1bf01df679f4180c39516e190b21)), closes [#1019](https://github.com/conventional-changelog/conventional-changelog/issues/1019)

## [7.0.1](https://github.com/conventional-changelog/conventional-changelog/compare/conventional-recommended-bump-v7.0.0...conventional-recommended-bump-v7.0.1) (2023-06-06)


### Bug Fixes

* **conventional-changelog-core:** update monorepo dependencies ([#1012](https://github.com/conventional-changelog/conventional-changelog/issues/1012)) ([ef3413a](https://github.com/conventional-changelog/conventional-changelog/commit/ef3413a40e48628e94c88bc50bf4fba0ddc0b0b0))

## [7.0.0](https://github.com/conventional-changelog/conventional-changelog/compare/conventional-recommended-bump-v6.1.0...conventional-recommended-bump-v7.0.0) (2023-06-06)


### ⚠ BREAKING CHANGES

* now all promises are native
* Node >= 14 is required

### Features

* add possibility to provide custom flags to commit fetcher ([#978](https://github.com/conventional-changelog/conventional-changelog/issues/978)) ([58f0887](https://github.com/conventional-changelog/conventional-changelog/commit/58f0887283a200d52e49607baf7b352f26177b05))


### Code Refactoring

* drop lodash from dependencies where it possible ([#959](https://github.com/conventional-changelog/conventional-changelog/issues/959)) ([a8b4e12](https://github.com/conventional-changelog/conventional-changelog/commit/a8b4e12883021231befc6bdfeb95a9b50637f361))
* drop q from dependencies ([#974](https://github.com/conventional-changelog/conventional-changelog/issues/974)) ([d0e5d59](https://github.com/conventional-changelog/conventional-changelog/commit/d0e5d5926c8addba74bc962553dd8bcfba90e228))

## [6.1.0](https://www.github.com/conventional-changelog/conventional-changelog/compare/v6.0.12...v6.1.0) (2020-12-30)


### Features

* **conventional-recommended-bump:** support for '--skip-unstable' ([#698](https://www.github.com/conventional-changelog/conventional-changelog/issues/698)) ([3a5b41e](https://www.github.com/conventional-changelog/conventional-changelog/commit/3a5b41e0ccdcdfb81f1b75f295975b0ab0f48683))

### [6.0.12](https://www.github.com/conventional-changelog/conventional-changelog/compare/conventional-recommended-bump@6.0.11...v6.0.12) (2020-12-30)


### Bug Fixes

* **deps:** update dependency git-raw-commits to v2.0.8 ([#723](https://www.github.com/conventional-changelog/conventional-changelog/issues/723)) ([9682305](https://www.github.com/conventional-changelog/conventional-changelog/commit/968230536914a680237e830ccc8e125c56b0f0aa))

## [6.0.11](https://github.com/conventional-changelog/conventional-changelog/compare/conventional-recommended-bump@6.0.10...conventional-recommended-bump@6.0.11) (2020-11-05)

**Note:** Version bump only for package conventional-recommended-bump





## [6.0.10](https://github.com/conventional-changelog/conventional-changelog/compare/conventional-recommended-bump@6.0.9...conventional-recommended-bump@6.0.10) (2020-08-12)

**Note:** Version bump only for package conventional-recommended-bump





## [6.0.9](https://github.com/conventional-changelog/conventional-changelog/compare/conventional-recommended-bump@6.0.5...conventional-recommended-bump@6.0.9) (2020-05-08)


### Bug Fixes

* **deps:** update yargs-parser to move off a flagged-vulnerable version. ([#635](https://github.com/conventional-changelog/conventional-changelog/issues/635)) ([aafc0f0](https://github.com/conventional-changelog/conventional-changelog/commit/aafc0f00412c3e4b23b8418300e5a570a48fe24d))





## [6.0.5](https://github.com/conventional-changelog/conventional-changelog/compare/conventional-recommended-bump@6.0.4...conventional-recommended-bump@6.0.5) (2019-11-14)

**Note:** Version bump only for package conventional-recommended-bump





## [6.0.4](https://github.com/conventional-changelog/conventional-changelog/compare/conventional-recommended-bump@6.0.3...conventional-recommended-bump@6.0.4) (2019-11-07)


### Bug Fixes

* revertPattern match default git revert format ([#545](https://github.com/conventional-changelog/conventional-changelog/issues/545)) ([fe449f8](https://github.com/conventional-changelog/conventional-changelog/commit/fe449f899567574a36d1819b313e2caa899052ff))





## [6.0.3](https://github.com/conventional-changelog/conventional-changelog/compare/conventional-recommended-bump@6.0.2...conventional-recommended-bump@6.0.3) (2019-10-24)

**Note:** Version bump only for package conventional-recommended-bump





## [6.0.1](https://github.com/conventional-changelog/conventional-changelog/compare/conventional-recommended-bump@6.0.0...conventional-recommended-bump@6.0.1) (2019-10-02)

**Note:** Version bump only for package conventional-recommended-bump





# [6.0.0](https://github.com/conventional-changelog/conventional-changelog/compare/conventional-recommended-bump@5.0.1...conventional-recommended-bump@6.0.0) (2019-07-29)


* refactor!: modify gitSemverTags to take options first (#390) ([dc8aeda](https://github.com/conventional-changelog/conventional-changelog/commit/dc8aeda)), closes [#390](https://github.com/conventional-changelog/conventional-changelog/issues/390)


### BREAKING CHANGES

* gitSemverTags now takes options followed by callback.





## [5.0.1](https://github.com/conventional-changelog/conventional-changelog/compare/conventional-recommended-bump@5.0.0...conventional-recommended-bump@5.0.1) (2019-05-18)


### Bug Fixes

* Recommend a patch bump for features when preMajor is enabled ([#452](https://github.com/conventional-changelog/conventional-changelog/issues/452)) ([3d0a520](https://github.com/conventional-changelog/conventional-changelog/commit/3d0a520))





# [5.0.0](https://github.com/conventional-changelog/conventional-changelog/compare/conventional-recommended-bump@4.1.1...conventional-recommended-bump@5.0.0) (2019-05-02)


### Features

* ! without BREAKING CHANGE should be treated as major ([#443](https://github.com/conventional-changelog/conventional-changelog/issues/443)) ([cf22d70](https://github.com/conventional-changelog/conventional-changelog/commit/cf22d70))


### BREAKING CHANGES

* if ! is in the commit header, it now indicates a BREAKING CHANGE, and the description is used as the body.





## [4.1.1](https://github.com/conventional-changelog/conventional-changelog/compare/conventional-recommended-bump@4.1.0...conventional-recommended-bump@4.1.1) (2019-04-11)


### Bug Fixes

* preset load error message should handle objects ([fb4a8d1](https://github.com/conventional-changelog/conventional-changelog/commit/fb4a8d1))





# [4.1.0](https://github.com/conventional-changelog/conventional-changelog/compare/conventional-recommended-bump@4.0.4...conventional-recommended-bump@4.1.0) (2019-04-10)


### Bug Fixes

* **deps:** update dependency concat-stream to v2 ([#401](https://github.com/conventional-changelog/conventional-changelog/issues/401)) ([4c09bfc](https://github.com/conventional-changelog/conventional-changelog/commit/4c09bfc))


### Features

* conventionalcommits preset, preMajor config option ([#434](https://github.com/conventional-changelog/conventional-changelog/issues/434)) ([dde12fe](https://github.com/conventional-changelog/conventional-changelog/commit/dde12fe))
* **conventional-recommended-bump:** send options to whatBump ([#409](https://github.com/conventional-changelog/conventional-changelog/issues/409)) ([508d6d6](https://github.com/conventional-changelog/conventional-changelog/commit/508d6d6)), closes [/github.com/lerna/lerna/blob/a6733a2b864cf9d082d080bbd3bfedb04e59b0ab/core/conventional-commits/lib/recommend-version.js#L13-L21](https://github.com//github.com/lerna/lerna/blob/a6733a2b864cf9d082d080bbd3bfedb04e59b0ab/core/conventional-commits/lib/recommend-version.js/issues/L13-L21)





## [4.0.4](https://github.com/conventional-changelog/conventional-changelog/compare/conventional-recommended-bump@4.0.3...conventional-recommended-bump@4.0.4) (2018-11-01)


### Bug Fixes

* fix broken release of conventional-recommended-bump ([d9267e8](https://github.com/conventional-changelog/conventional-changelog/commit/d9267e8))





## [4.0.3](https://github.com/conventional-changelog/conventional-changelog/compare/conventional-recommended-bump@4.0.2...conventional-recommended-bump@4.0.3) (2018-11-01)

**Note:** Version bump only for package conventional-recommended-bump





## [4.0.2](https://github.com/conventional-changelog/conventional-changelog/compare/conventional-recommended-bump@4.0.1...conventional-recommended-bump@4.0.2) (2018-11-01)


### Bug Fixes

* Upgrade to Lerna 3, fix Node.js v11 error ([#385](https://github.com/conventional-changelog/conventional-changelog/issues/385)) ([cdef282](https://github.com/conventional-changelog/conventional-changelog/commit/cdef282))





<a name="4.0.1"></a>
## [4.0.1](https://github.com/conventional-changelog/conventional-changelog/compare/conventional-recommended-bump@4.0.0...conventional-recommended-bump@4.0.1) (2018-08-21)




**Note:** Version bump only for package conventional-recommended-bump

<a name="4.0.0"></a>
# [4.0.0](https://github.com/conventional-changelog/conventional-changelog/compare/conventional-recommended-bump@3.0.0...conventional-recommended-bump@4.0.0) (2018-06-06)


### Features

* re-use parser options within each preset ([#335](https://github.com/conventional-changelog/conventional-changelog/issues/335)) ([d3eaacf](https://github.com/conventional-changelog/conventional-changelog/commit/d3eaacf)), closes [#241](https://github.com/conventional-changelog/conventional-changelog/issues/241)


### BREAKING CHANGES

* Re-use parser options object between components of a preset. For some
presets this may change the behavior of `conventional-recommended-bump`
as the parser options object for the `conventional-recommended-bump` options
within a preset were different than the parser options object for the
`conventional-changelog` options within a preset.

If you are not using `conventional-recommended-bump`, then this is
**not** a breaking change for you.




<a name="3.0.0"></a>
# [3.0.0](https://github.com/conventional-changelog/conventional-changelog/compare/conventional-recommended-bump@2.0.9...conventional-recommended-bump@3.0.0) (2018-05-29)


### Chores

* **package:** set Node requirement to oldest supported LTS ([#329](https://github.com/conventional-changelog/conventional-changelog/issues/329)) ([cae2fe0](https://github.com/conventional-changelog/conventional-changelog/commit/cae2fe0))


### BREAKING CHANGES

* **package:** Set the package's minimum required Node version to be the oldest LTS
currently supported by the Node Release working group. At this time,
that is Node 6 (which is in its Maintenance LTS phase).




<a name="2.0.9"></a>
## [2.0.9](https://github.com/conventional-changelog/conventional-changelog/compare/conventional-recommended-bump@2.0.8...conventional-recommended-bump@2.0.9) (2018-04-16)




**Note:** Version bump only for package conventional-recommended-bump

<a name="2.0.8"></a>
## [2.0.8](https://github.com/conventional-changelog/conventional-changelog/compare/conventional-recommended-bump@2.0.7...conventional-recommended-bump@2.0.8) (2018-03-27)




**Note:** Version bump only for package conventional-recommended-bump

<a name="2.0.7"></a>
## [2.0.7](https://github.com/conventional-changelog/conventional-changelog/compare/conventional-recommended-bump@2.0.6...conventional-recommended-bump@2.0.7) (2018-03-22)




**Note:** Version bump only for package conventional-recommended-bump

<a name="2.0.6"></a>
## [2.0.6](https://github.com/conventional-changelog/conventional-changelog/compare/conventional-recommended-bump@2.0.5...conventional-recommended-bump@2.0.6) (2018-02-24)




**Note:** Version bump only for package conventional-recommended-bump

<a name="2.0.5"></a>
## [2.0.5](https://github.com/conventional-changelog/conventional-changelog/compare/conventional-recommended-bump@2.0.4...conventional-recommended-bump@2.0.5) (2018-02-20)




**Note:** Version bump only for package conventional-recommended-bump

<a name="2.0.4"></a>
## [2.0.4](https://github.com/conventional-changelog/conventional-recommended-bump/compare/conventional-recommended-bump@2.0.3...conventional-recommended-bump@2.0.4) (2018-02-13)




**Note:** Version bump only for package conventional-recommended-bump

<a name="2.0.3"></a>
## [2.0.3](https://github.com/conventional-changelog/conventional-recommended-bump/compare/conventional-recommended-bump@2.0.2...conventional-recommended-bump@2.0.3) (2018-02-13)




**Note:** Version bump only for package conventional-recommended-bump

<a name="2.0.2"></a>
## [2.0.2](https://github.com/conventional-changelog/conventional-recommended-bump/compare/conventional-recommended-bump@2.0.1...conventional-recommended-bump@2.0.2) (2018-02-13)




**Note:** Version bump only for package conventional-recommended-bump

<a name="2.0.1"></a>
## [2.0.1](https://github.com/conventional-changelog/conventional-recommended-bump/compare/conventional-recommended-bump@2.0.0...conventional-recommended-bump@2.0.1) (2018-02-12)


### Bug Fixes

* **conventional-recommended-bump:** include missing file in publishing ([1481c05](https://github.com/conventional-changelog/conventional-recommended-bump/commit/1481c05))




<a name="1.2.1"></a>
## [1.2.1](https://github.com/conventional-changelog/conventional-recommended-bump/compare/conventional-recommended-bump@1.2.0...conventional-recommended-bump@1.2.1) (2018-02-05)




**Note:** Version bump only for package conventional-recommended-bump

<a name="1.2.0"></a>
# [1.2.0](https://github.com/conventional-changelog/conventional-recommended-bump/compare/conventional-recommended-bump@1.1.0...conventional-recommended-bump@1.2.0) (2018-01-29)


### Features

* allow to specify a tagPrefix in conventional-recommended-bump ([f60f86f](https://github.com/conventional-changelog/conventional-recommended-bump/commit/f60f86f))




<a name="1.1.0"></a>
# [1.1.0](https://github.com/conventional-changelog/conventional-recommended-bump/compare/conventional-recommended-bump@1.0.3...conventional-recommended-bump@1.1.0) (2017-12-08)


### Features

* **recommended-bump:** add `eslint` preset ([#256](https://github.com/conventional-changelog/conventional-recommended-bump/issues/256)) ([64abf07](https://github.com/conventional-changelog/conventional-recommended-bump/commit/64abf07))




<a name="1.0.3"></a>
## [1.0.3](https://github.com/conventional-changelog/conventional-recommended-bump/compare/conventional-recommended-bump@1.0.2...conventional-recommended-bump@1.0.3) (2017-11-13)




**Note:** Version bump only for package conventional-recommended-bump

<a name="1.0.2"></a>
## [1.0.2](https://github.com/conventional-changelog/conventional-recommended-bump/compare/conventional-recommended-bump@1.0.1...conventional-recommended-bump@1.0.2) (2017-10-01)

<a name="1.0.1"></a>
## [1.0.1](https://github.com/conventional-changelog/conventional-recommended-bump/compare/conventional-recommended-bump@1.0.0...conventional-recommended-bump@1.0.1) (2017-07-17)

<a name="0.3.0"></a>
# [0.3.0](https://github.com/conventional-changelog/conventional-recommended-bump/compare/v0.2.1...v0.3.0) (2016-08-13)


### Code Refactoring

* **naming:** releaseAs => releaseType ([1476f1e](https://github.com/conventional-changelog/conventional-recommended-bump/commit/1476f1e)), closes [#15](https://github.com/conventional-changelog/conventional-recommended-bump/issues/15)


### BREAKING CHANGES

* naming: `releaseAs` => `releaseType`



<a name="0.2.1"></a>
## [0.2.1](https://github.com/conventional-changelog/conventional-recommended-bump/compare/v0.2.0...v0.2.1) (2016-04-16)




<a name="0.2.0"></a>
# [0.2.0](https://github.com/conventional-changelog/conventional-recommended-bump/compare/v0.1.2...v0.2.0) (2016-04-02)


### Features

* **config:** custom config file ([aa3747a](https://github.com/conventional-changelog/conventional-recommended-bump/commit/aa3747a)), closes [#6](https://github.com/conventional-changelog/conventional-recommended-bump/issues/6)
* **verbose:** output details of the bump ([2311c4a](https://github.com/conventional-changelog/conventional-recommended-bump/commit/2311c4a)), closes [#5](https://github.com/conventional-changelog/conventional-recommended-bump/issues/5)
* **warn:** no new commits since last release ([84f5284](https://github.com/conventional-changelog/conventional-recommended-bump/commit/84f5284)), closes [#4](https://github.com/conventional-changelog/conventional-recommended-bump/issues/4)


### BREAKING CHANGES

* verbose: `whatBump` can return an object. `result` is an `object` instead of a `string`.



<a name="0.1.2"></a>
## [0.1.2](https://github.com/conventional-changelog/conventional-recommended-bump/compare/v0.1.1...v0.1.2) (2016-03-10)


### Bug Fixes

* **angular:** handle breaking changes after a feature ([6c40400](https://github.com/conventional-changelog/conventional-recommended-bump/commit/6c40400)), closes [#8](https://github.com/conventional-changelog/conventional-recommended-bump/issues/8)



<a name="0.1.1"></a>
## [0.1.1](https://github.com/conventional-changelog/conventional-recommended-bump/compare/v0.1.0...v0.1.1) (2016-02-23)




<a name="0.1.0"></a>
# [0.1.0](https://github.com/conventional-changelog/conventional-recommended-bump/compare/v0.0.3...v0.1.0) (2016-02-08)




<a name="0.0.3"></a>
## [0.0.3](https://github.com/conventional-changelog/conventional-recommended-bump/compare/v0.0.2...v0.0.3) (2015-08-12)


### Features

* **deps:** bump and a lot of bugs are fixed ([1abc3af](https://github.com/conventional-changelog/conventional-recommended-bump/commit/1abc3af))
* **deps:** bump conventional-commits-filter and fix bug ([87639a0](https://github.com/conventional-changelog/conventional-recommended-bump/commit/87639a0))
* **deps:** modulise conventional-commits-filter ([b1eadb9](https://github.com/conventional-changelog/conventional-recommended-bump/commit/b1eadb9))



<a name="0.0.2"></a>
## [0.0.2](https://github.com/conventional-changelog/conventional-recommended-bump/compare/v0.0.1...v0.0.2) (2015-07-03)


### Features

* **revert:** ignore reverted commits ([cd87dea](https://github.com/conventional-changelog/conventional-recommended-bump/commit/cd87dea))



<a name="0.0.1"></a>
## 0.0.1 (2015-06-22)
