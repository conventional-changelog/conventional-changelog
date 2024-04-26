# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [5.0.0](https://github.com/conventional-changelog/conventional-changelog/compare/conventional-changelog-preset-loader-v4.1.0...conventional-changelog-preset-loader-v5.0.0) (2024-04-26)


### ⚠ BREAKING CHANGES

* Node >= 18 is required
* **conventional-recommended-bump:** new `Bumper` exported class ([#1218](https://github.com/conventional-changelog/conventional-changelog/issues/1218))
* Now all packages, except gulp-conventional-changelog, are ESM-only.

### Features

* **conventional-changelog-preset-loader:** rewrite to TypeScript ([#1185](https://github.com/conventional-changelog/conventional-changelog/issues/1185)) ([d082692](https://github.com/conventional-changelog/conventional-changelog/commit/d082692a2bafbc8edf402f353bc2b94bc8077f08))
* **conventional-recommended-bump:** new `Bumper` exported class ([#1218](https://github.com/conventional-changelog/conventional-changelog/issues/1218)) ([0ddc8cd](https://github.com/conventional-changelog/conventional-changelog/commit/0ddc8cdceb91f838f9f73e0bff8e3f140176a13a))
* drop node 16 support ([#1226](https://github.com/conventional-changelog/conventional-changelog/issues/1226)) ([ec69cfd](https://github.com/conventional-changelog/conventional-changelog/commit/ec69cfdf0040f73ec0eadc4779c37874e71f3dff))
* move from CommonJS to ESM ([#1144](https://github.com/conventional-changelog/conventional-changelog/issues/1144)) ([c5b859d](https://github.com/conventional-changelog/conventional-changelog/commit/c5b859d201e124822002eb54574f003f074216e2))

## [4.1.0](https://github.com/conventional-changelog/conventional-changelog/compare/conventional-changelog-preset-loader-v4.0.0...conventional-changelog-preset-loader-v4.1.0) (2023-09-08)


### Features

* **conventional-changelog-preset-loader:** throw error if preset does not export a function ([#1115](https://github.com/conventional-changelog/conventional-changelog/issues/1115)) ([4f09e6d](https://github.com/conventional-changelog/conventional-changelog/commit/4f09e6da384c3d5d40da67ebddc07e2d1a03ac31))

## [4.0.0](https://github.com/conventional-changelog/conventional-changelog/compare/conventional-changelog-preset-loader-v3.0.0...conventional-changelog-preset-loader-v4.0.0) (2023-08-27)


### ⚠ BREAKING CHANGES

* Node >= 16 is required
* Now all presets are exports preset config factory function. conventional-changelog-preset-loader now exports new loadPreset and createPresetLoader functions. If you are using presets indirectly, using preset name, no any changes in configuration needed, just upgrade packages to latest versions.

### Features

* drop node 14 support ([#1085](https://github.com/conventional-changelog/conventional-changelog/issues/1085)) ([1bce036](https://github.com/conventional-changelog/conventional-changelog/commit/1bce0362dbb624a869eb01fd7724ab7f81d337e6))
* unified presets interface ([#1045](https://github.com/conventional-changelog/conventional-changelog/issues/1045)) ([8d0ffbe](https://github.com/conventional-changelog/conventional-changelog/commit/8d0ffbe6c59b861b560cea0e3594c7b32e978cc3))

## [3.0.0](https://github.com/conventional-changelog/conventional-changelog/compare/conventional-changelog-preset-loader-v2.3.2...conventional-changelog-preset-loader-v3.0.0) (2023-06-06)


### ⚠ BREAKING CHANGES

* Node >= 14 is required

### Code Refactoring

* drop lodash from dependencies where it possible ([#959](https://github.com/conventional-changelog/conventional-changelog/issues/959)) ([a8b4e12](https://github.com/conventional-changelog/conventional-changelog/commit/a8b4e12883021231befc6bdfeb95a9b50637f361))

## [2.3.4](https://github.com/conventional-changelog/conventional-changelog/compare/conventional-changelog-preset-loader@2.3.0...conventional-changelog-preset-loader@2.3.4) (2020-05-08)

**Note:** Version bump only for package conventional-changelog-preset-loader





# [2.3.0](https://github.com/conventional-changelog/conventional-changelog/compare/conventional-changelog-preset-loader@2.2.0...conventional-changelog-preset-loader@2.3.0) (2019-10-24)


### Bug Fixes

* **preset-loader:** fix handling conventionalcommits preset without config object ([6425972](https://github.com/conventional-changelog/conventional-changelog/commit/64259723085eaa21a281391acb9fc0704319c8b3)), closes [#512](https://github.com/conventional-changelog/conventional-changelog/issues/512)


### Features

* **preset-loader:** allow use of absolute package path ([#530](https://github.com/conventional-changelog/conventional-changelog/issues/530)) ([84d28b2](https://github.com/conventional-changelog/conventional-changelog/commit/84d28b285f787e9b1252aadf55f07a358635a5a6))


### Reverts

* "fix(preset-loader): fix handling conventionalcommits preset without config object" ([#520](https://github.com/conventional-changelog/conventional-changelog/issues/520)) ([417139c](https://github.com/conventional-changelog/conventional-changelog/commit/417139cbdae13d76ba325a8505534419325102a6))





# [2.2.0](https://github.com/conventional-changelog/conventional-changelog/compare/conventional-changelog-preset-loader@2.1.1...conventional-changelog-preset-loader@2.2.0) (2019-07-29)


### Features

* **preset-loader:** allow use of full package names ([#481](https://github.com/conventional-changelog/conventional-changelog/issues/481)) ([03cb95c](https://github.com/conventional-changelog/conventional-changelog/commit/03cb95c))





## [2.1.1](https://github.com/conventional-changelog/conventional-changelog/compare/conventional-changelog-preset-loader@2.1.0...conventional-changelog-preset-loader@2.1.1) (2019-04-11)

**Note:** Version bump only for package conventional-changelog-preset-loader





# [2.1.0](https://github.com/conventional-changelog/conventional-changelog/compare/conventional-changelog-preset-loader@2.0.2...conventional-changelog-preset-loader@2.1.0) (2019-04-10)


### Features

* conventionalcommits preset, preMajor config option ([#434](https://github.com/conventional-changelog/conventional-changelog/issues/434)) ([dde12fe](https://github.com/conventional-changelog/conventional-changelog/commit/dde12fe))





## [2.0.2](https://github.com/conventional-changelog/conventional-changelog/compare/conventional-changelog-preset-loader@2.0.1...conventional-changelog-preset-loader@2.0.2) (2018-11-01)


### Bug Fixes

* Upgrade to Lerna 3, fix Node.js v11 error ([#385](https://github.com/conventional-changelog/conventional-changelog/issues/385)) ([cdef282](https://github.com/conventional-changelog/conventional-changelog/commit/cdef282))





<a name="2.0.1"></a>
## [2.0.1](https://github.com/conventional-changelog/conventional-changelog/compare/conventional-changelog-preset-loader@2.0.0...conventional-changelog-preset-loader@2.0.1) (2018-08-21)




**Note:** Version bump only for package conventional-changelog-preset-loader

<a name="2.0.0"></a>
# [2.0.0](https://github.com/conventional-changelog/conventional-changelog/compare/conventional-changelog-preset-loader@1.1.8...conventional-changelog-preset-loader@2.0.0) (2018-05-29)


### Chores

* **package:** set Node requirement to oldest supported LTS ([#329](https://github.com/conventional-changelog/conventional-changelog/issues/329)) ([cae2fe0](https://github.com/conventional-changelog/conventional-changelog/commit/cae2fe0))


### BREAKING CHANGES

* **package:** Set the package's minimum required Node version to be the oldest LTS
currently supported by the Node Release working group. At this time,
that is Node 6 (which is in its Maintenance LTS phase).




<a name="1.1.8"></a>
## [1.1.8](https://github.com/conventional-changelog/conventional-changelog/compare/conventional-changelog-preset-loader@1.1.7...conventional-changelog-preset-loader@1.1.8) (2018-03-27)




**Note:** Version bump only for package conventional-changelog-preset-loader

<a name="1.1.7"></a>
## [1.1.7](https://github.com/conventional-changelog/conventional-changelog/compare/conventional-changelog-preset-loader@1.1.6...conventional-changelog-preset-loader@1.1.7) (2018-03-22)




**Note:** Version bump only for package conventional-changelog-preset-loader

<a name="1.1.6"></a>
## [1.1.6](https://github.com/conventional-changelog/conventional-changelog/compare/conventional-changelog-preset-loader@1.1.5...conventional-changelog-preset-loader@1.1.6) (2018-02-24)




**Note:** Version bump only for package conventional-changelog-preset-loader

<a name="1.1.5"></a>
## [1.1.5](https://github.com/conventional-changelog/conventional-changelog/compare/conventional-changelog-preset-loader@1.1.4...conventional-changelog-preset-loader@1.1.5) (2018-02-20)




**Note:** Version bump only for package conventional-changelog-preset-loader

<a name="1.1.4"></a>
## [1.1.4](https://github.com/conventional-changelog/conventional-changelog/compare/conventional-changelog-preset-loader@1.1.3...conventional-changelog-preset-loader@1.1.4) (2018-02-13)




**Note:** Version bump only for package conventional-changelog-preset-loader

<a name="1.1.3"></a>
## [1.1.3](https://github.com/conventional-changelog/conventional-changelog/compare/conventional-changelog-preset-loader@1.1.2...conventional-changelog-preset-loader@1.1.3) (2018-02-13)




**Note:** Version bump only for package conventional-changelog-preset-loader

<a name="1.1.2"></a>
## [1.1.2](https://github.com/conventional-changelog/conventional-changelog/compare/conventional-changelog-preset-loader@1.1.1...conventional-changelog-preset-loader@1.1.2) (2018-02-12)


### Bug Fixes

* **preset-loader:** don't namespace exported function ([#278](https://github.com/conventional-changelog/conventional-changelog/issues/278)) ([89880cb](https://github.com/conventional-changelog/conventional-changelog/commit/89880cb))




<a name="1.1.1"></a>
## [1.1.1](https://github.com/conventional-changelog/conventional-changelog/compare/conventional-changelog-preset-loader@1.1.0...conventional-changelog-preset-loader@1.1.1) (2018-02-09)




**Note:** Version bump only for package conventional-changelog-preset-loader

<a name="1.1.0"></a>
# 1.1.0 (2018-02-08)


### Features

* **preset-loader:** new package for loading preset packages ([6f5cb10](https://github.com/conventional-changelog/conventional-changelog/commit/6f5cb10))




# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.
