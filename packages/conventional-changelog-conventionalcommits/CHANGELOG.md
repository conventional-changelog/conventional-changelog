# Changelog

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [9.1.0](https://github.com/conventional-changelog/conventional-changelog/compare/conventional-changelog-conventionalcommits-v9.0.0...conventional-changelog-conventionalcommits-v9.1.0) (2025-07-10)

### Features

* scope option can be an array of strings ([#1391](https://github.com/conventional-changelog/conventional-changelog/issues/1391)) ([81da809](https://github.com/conventional-changelog/conventional-changelog/commit/81da80996888efb0277f7c6f76f2dd39164d81bd))

## [9.0.0](https://github.com/conventional-changelog/conventional-changelog/compare/conventional-changelog-conventionalcommits-v8.0.0...conventional-changelog-conventionalcommits-v9.0.0) (2025-05-19)

### ⚠ BREAKING CHANGES

* bang notes handling is removed, it already being handled in
conventional-commits-parser

### Features

* bang notes handling is removed ([#1355](https://github.com/conventional-changelog/conventional-changelog/issues/1355)) ([5150f47](https://github.com/conventional-changelog/conventional-changelog/commit/5150f47))
* scope, scopeOnly and bumpStrict options were added ([e2973e2](https://github.com/conventional-changelog/conventional-changelog/commit/e2973e2))

## [8.0.0](https://github.com/conventional-changelog/conventional-changelog/compare/conventional-changelog-conventionalcommits-v7.0.2...conventional-changelog-conventionalcommits-v8.0.0) (2024-04-26)

### ⚠ BREAKING CHANGES

* Node >= 18 is required
* **conventional-recommended-bump:** new `Bumper` exported class ([#1218](https://github.com/conventional-changelog/conventional-changelog/issues/1218))
* cleanup presets interface ([#1215](https://github.com/conventional-changelog/conventional-changelog/issues/1215))
* **conventional-changelog-writer:** rewrite to TypeScript ([#1150](https://github.com/conventional-changelog/conventional-changelog/issues/1150))
* Now all packages, except gulp-conventional-changelog, are ESM-only.

### Features

* cleanup presets interface ([#1215](https://github.com/conventional-changelog/conventional-changelog/issues/1215)) ([0e4f293](https://github.com/conventional-changelog/conventional-changelog/commit/0e4f2935add5dbf68410ea3c245ed8bd13e292a8))
* **conventional-changelog-writer:** rewrite to TypeScript ([#1150](https://github.com/conventional-changelog/conventional-changelog/issues/1150)) ([8af364f](https://github.com/conventional-changelog/conventional-changelog/commit/8af364feb20f4e6f7ffab6f5b25638df780db715))
* **conventional-recommended-bump:** new `Bumper` exported class ([#1218](https://github.com/conventional-changelog/conventional-changelog/issues/1218)) ([0ddc8cd](https://github.com/conventional-changelog/conventional-changelog/commit/0ddc8cdceb91f838f9f73e0bff8e3f140176a13a))
* drop node 16 support ([#1226](https://github.com/conventional-changelog/conventional-changelog/issues/1226)) ([ec69cfd](https://github.com/conventional-changelog/conventional-changelog/commit/ec69cfdf0040f73ec0eadc4779c37874e71f3dff))
* move from CommonJS to ESM ([#1144](https://github.com/conventional-changelog/conventional-changelog/issues/1144)) ([c5b859d](https://github.com/conventional-changelog/conventional-changelog/commit/c5b859d201e124822002eb54574f003f074216e2))

### Bug Fixes

* **conventional-changelog-conventionalcommits:** avoid double empty lines ([#1235](https://github.com/conventional-changelog/conventional-changelog/issues/1235)) ([3b4bfdf](https://github.com/conventional-changelog/conventional-changelog/commit/3b4bfdf3ac7d26da8466a577227254123b767336)), closes [#1188](https://github.com/conventional-changelog/conventional-changelog/issues/1188)

## [7.0.2](https://github.com/conventional-changelog/conventional-changelog/compare/conventional-changelog-conventionalcommits-v7.0.1...conventional-changelog-conventionalcommits-v7.0.2) (2023-09-08)

### Bug Fixes

* **conventional-changelog-conventionalcommits:** fix handling input params ([#1120](https://github.com/conventional-changelog/conventional-changelog/issues/1120)) ([e721cde](https://github.com/conventional-changelog/conventional-changelog/commit/e721cdec8de32162dd56096ef6a07786f1b4faec))

## [7.0.1](https://github.com/conventional-changelog/conventional-changelog/compare/conventional-changelog-conventionalcommits-v7.0.0...conventional-changelog-conventionalcommits-v7.0.1) (2023-08-27)

### Bug Fixes

* **conventional-changelog-conventionalcommits:** include constants.js in package ([#1095](https://github.com/conventional-changelog/conventional-changelog/issues/1095)) ([a730b18](https://github.com/conventional-changelog/conventional-changelog/commit/a730b186c10493ee551b84b528d7437dbc3feac0)), closes [#1093](https://github.com/conventional-changelog/conventional-changelog/issues/1093)

## [7.0.0](https://github.com/conventional-changelog/conventional-changelog/compare/conventional-changelog-conventionalcommits-v6.1.0...conventional-changelog-conventionalcommits-v7.0.0) (2023-08-26)

### ⚠ BREAKING CHANGES

* Node >= 16 is required
* Now all presets are exports preset config factory function. conventional-changelog-preset-loader now exports new loadPreset and createPresetLoader functions. If you are using presets indirectly, using preset name, no any changes in configuration needed, just upgrade packages to latest versions.

### Features

* **conventional-changelog-conventionalcommits:** add support for alphanumeric issues ([#1080](https://github.com/conventional-changelog/conventional-changelog/issues/1080)) ([f9b1897](https://github.com/conventional-changelog/conventional-changelog/commit/f9b18975ba1bf74ecb7a294f3b220794e0d09e0b))
* drop node 14 support ([#1085](https://github.com/conventional-changelog/conventional-changelog/issues/1085)) ([1bce036](https://github.com/conventional-changelog/conventional-changelog/commit/1bce0362dbb624a869eb01fd7724ab7f81d337e6))
* **git-raw-commits:** ignore commits by regex ([#1063](https://github.com/conventional-changelog/conventional-changelog/issues/1063)) ([47033e6](https://github.com/conventional-changelog/conventional-changelog/commit/47033e6edfea3705383bb075bc6a4bd417f9ed8c))
* **types:** allow combining provided types with defaults ([#1064](https://github.com/conventional-changelog/conventional-changelog/issues/1064)) ([7ec8a18](https://github.com/conventional-changelog/conventional-changelog/commit/7ec8a183473fe5b1f6675f04c230576e562ea291))
* unified presets interface ([#1045](https://github.com/conventional-changelog/conventional-changelog/issues/1045)) ([8d0ffbe](https://github.com/conventional-changelog/conventional-changelog/commit/8d0ffbe6c59b861b560cea0e3594c7b32e978cc3))

## [6.1.0](https://github.com/conventional-changelog/conventional-changelog/compare/conventional-changelog-conventionalcommits-v6.0.0...conventional-changelog-conventionalcommits-v6.1.0) (2023-06-17)

### Features

* **conventional-changelog-conventionalcommits:** sort groups based on config types ([#702](https://github.com/conventional-changelog/conventional-changelog/issues/702)) ([#1002](https://github.com/conventional-changelog/conventional-changelog/issues/1002)) ([0e59f0c](https://github.com/conventional-changelog/conventional-changelog/commit/0e59f0c884bf104e3a6a14c5669c58755cdef064))

## [6.0.0](https://github.com/conventional-changelog/conventional-changelog/compare/conventional-changelog-conventionalcommits-v5.0.0...conventional-changelog-conventionalcommits-v6.0.0) (2023-06-05)

### ⚠ BREAKING CHANGES

* now all promises are native
* Node >= 14 is required

### Code Refactoring

* drop lodash from dependencies where it possible ([#959](https://github.com/conventional-changelog/conventional-changelog/issues/959)) ([a8b4e12](https://github.com/conventional-changelog/conventional-changelog/commit/a8b4e12883021231befc6bdfeb95a9b50637f361))
* drop q from dependencies ([#974](https://github.com/conventional-changelog/conventional-changelog/issues/974)) ([d0e5d59](https://github.com/conventional-changelog/conventional-changelog/commit/d0e5d5926c8addba74bc962553dd8bcfba90e228))

## [5.0.0](https://github.com/conventional-changelog/conventional-changelog/compare/conventional-changelog-conventionalcommits-v4.6.3...conventional-changelog-conventionalcommits-v5.0.0) (2022-05-27)

### ⚠ BREAKING CHANGES

* always use H2 heading for versions (#920)

### Bug Fixes

* always use H2 heading for versions ([#920](https://github.com/conventional-changelog/conventional-changelog/issues/920)) ([d2e02d7](https://github.com/conventional-changelog/conventional-changelog/commit/d2e02d73f275bd10a39c52016999d8faf400c990)), closes [#867](https://github.com/conventional-changelog/conventional-changelog/issues/867)

### [4.6.3](https://github.com/conventional-changelog/conventional-changelog/compare/conventional-changelog-conventionalcommits-v4.6.2...conventional-changelog-conventionalcommits-v4.6.3) (2021-12-29)

### Bug Fixes

* support BREAKING-CHANGE alongside BREAKING CHANGE ([#882](https://github.com/conventional-changelog/conventional-changelog/issues/882)) ([e6f44ad](https://github.com/conventional-changelog/conventional-changelog/commit/e6f44adcf1ac5abbb85bdac73237c331c6594177))

### [4.6.2](https://github.com/conventional-changelog/conventional-changelog/compare/conventional-changelog-conventionalcommits-v4.6.1...conventional-changelog-conventionalcommits-v4.6.2) (2021-12-24)

### Bug Fixes

* **docs:** template examples ([#866](https://github.com/conventional-changelog/conventional-changelog/issues/866)) ([5917ad2](https://github.com/conventional-changelog/conventional-changelog/commit/5917ad2bd95a83c2a047b2f5692c8e8e442a23f5))

### [4.6.1](https://www.github.com/conventional-changelog/conventional-changelog/compare/conventional-changelog-conventionalcommits-v4.6.0...conventional-changelog-conventionalcommits-v4.6.1) (2021-09-09)

### Bug Fixes

* **conventional-commits-parser:** address CVE-2021-23425 ([#841](https://www.github.com/conventional-changelog/conventional-changelog/issues/841)) ([02b3d53](https://www.github.com/conventional-changelog/conventional-changelog/commit/02b3d53a0c142f0c28ee7d190d210c76a62887c2))

## [4.6.0](https://www.github.com/conventional-changelog/conventional-changelog/compare/conventional-changelog-conventionalcommits-vconventional-changelog-conventionalcommits@4.5.0...conventional-changelog-conventionalcommits-v4.6.0) (2021-04-30)

### Features

* **conventionalcommits:** include Release-As commits in CHANGELOG ([#796](https://www.github.com/conventional-changelog/conventional-changelog/issues/796)) ([9a0b9a7](https://www.github.com/conventional-changelog/conventional-changelog/commit/9a0b9a7f7ba5edd68b3476de706672d82e42b9e0))

# [4.5.0](https://github.com/conventional-changelog/conventional-changelog/compare/conventional-changelog-conventionalcommits@4.4.0...conventional-changelog-conventionalcommits@4.5.0) (2020-11-05)

### Features

* **conventionalcommits:** allow matching scope ([#669](https://github.com/conventional-changelog/conventional-changelog/issues/669)) ([e01e027](https://github.com/conventional-changelog/conventional-changelog/commit/e01e027af60f5fa3e9146223b96797793930aeb4))

# [4.4.0](https://github.com/conventional-changelog/conventional-changelog/compare/conventional-changelog-conventionalcommits@4.3.1...conventional-changelog-conventionalcommits@4.4.0) (2020-08-12)

### Features

* **templates:** if hash is nullish, do not display in CHANGELOG ([#664](https://github.com/conventional-changelog/conventional-changelog/issues/664)) ([f10256c](https://github.com/conventional-changelog/conventional-changelog/commit/f10256c635687de0a85c4db2bf06292902924f77))

## [4.3.1](https://github.com/conventional-changelog/conventional-changelog/compare/conventional-changelog-conventionalcommits@4.3.0...conventional-changelog-conventionalcommits@4.3.1) (2020-06-20)

### Bug Fixes

* **deps:** update dependency compare-func to v2 ([#647](https://github.com/conventional-changelog/conventional-changelog/issues/647)) ([de4f630](https://github.com/conventional-changelog/conventional-changelog/commit/de4f6309403ca0d46b7c6235052f4dca61ea15bc))
* pass config to parserOpts and writerOpts ([73c7a1b](https://github.com/conventional-changelog/conventional-changelog/commit/73c7a1b92c2a47c498f42972acbffa156172a341))

# [4.3.0](https://github.com/conventional-changelog/conventional-changelog/compare/conventional-changelog-conventionalcommits@4.2.3...conventional-changelog-conventionalcommits@4.3.0) (2020-05-08)

### Features

* add support for 'feature' as alias for 'feat' ([#582](https://github.com/conventional-changelog/conventional-changelog/issues/582)) ([94c40f7](https://github.com/conventional-changelog/conventional-changelog/commit/94c40f755e6c329311d89a47c634b91cf0276da3))

## [4.2.3](https://github.com/conventional-changelog/conventional-changelog/compare/conventional-changelog-conventionalcommits@4.2.2...conventional-changelog-conventionalcommits@4.2.3) (2019-11-07)

### Bug Fixes

* revertPattern match default git revert format ([#545](https://github.com/conventional-changelog/conventional-changelog/issues/545)) ([fe449f8](https://github.com/conventional-changelog/conventional-changelog/commit/fe449f899567574a36d1819b313e2caa899052ff))

## [4.2.2](https://github.com/conventional-changelog/conventional-changelog/compare/conventional-changelog-conventionalcommits@4.2.1...conventional-changelog-conventionalcommits@4.2.2) (2019-10-24)

### Bug Fixes

* **deps:** update lodash to fix security issues ([#535](https://github.com/conventional-changelog/conventional-changelog/issues/535)) ([ac43f51](https://github.com/conventional-changelog/conventional-changelog/commit/ac43f51de1f3b597c32f7f8442917a2d06199018))

# [4.2.0](https://github.com/conventional-changelog/conventional-changelog/compare/conventional-changelog-conventionalcommits@4.1.0...conventional-changelog-conventionalcommits@4.2.0) (2019-10-02)

### Bug Fixes

* **preset, conventionalcommits:** fix handling conventionalcommits preset without config object ([c0566ce](https://github.com/conventional-changelog/conventional-changelog/commit/c0566ce)), closes [#512](https://github.com/conventional-changelog/conventional-changelog/issues/512)
* **preset, conventionalcommits:** pass issuePrefixes to parser ([#510](https://github.com/conventional-changelog/conventional-changelog/issues/510)) ([958d243](https://github.com/conventional-changelog/conventional-changelog/commit/958d243))
* use full commit hash in commit link ([7a60dec](https://github.com/conventional-changelog/conventional-changelog/commit/7a60dec)), closes [#476](https://github.com/conventional-changelog/conventional-changelog/issues/476)

### Features

* sort sections of CHANGELOG based on priority ([#513](https://github.com/conventional-changelog/conventional-changelog/issues/513)) ([a3acc32](https://github.com/conventional-changelog/conventional-changelog/commit/a3acc32))

# [4.1.0](https://github.com/conventional-changelog/conventional-changelog/compare/conventional-changelog-conventionalcommits@4.0.0...conventional-changelog-conventionalcommits@4.1.0) (2019-07-29)

### Bug Fixes

* **preset, conventionalcommits:** Ensure proper substitutions for the conventionalcommit preset by using commit context for values where possible. ([#463](https://github.com/conventional-changelog/conventional-changelog/issues/463)) ([0b7ed0b](https://github.com/conventional-changelog/conventional-changelog/commit/0b7ed0b))

### Features

* **preset, conventionalcommits:** add handling of issue prefixes ([#498](https://github.com/conventional-changelog/conventional-changelog/issues/498)) ([85c17bb](https://github.com/conventional-changelog/conventional-changelog/commit/85c17bb))

# [4.0.0](https://github.com/conventional-changelog/conventional-changelog/compare/conventional-changelog-conventionalcommits@3.0.2...conventional-changelog-conventionalcommits@4.0.0) (2019-05-18)

### Bug Fixes

* Recommend a patch bump for features when preMajor is enabled ([#452](https://github.com/conventional-changelog/conventional-changelog/issues/452)) ([3d0a520](https://github.com/conventional-changelog/conventional-changelog/commit/3d0a520))

* feat!: BREAKING CHANGES are important and should be prioritized (#464) ([f8adba2](https://github.com/conventional-changelog/conventional-changelog/commit/f8adba2)), closes [#464](https://github.com/conventional-changelog/conventional-changelog/issues/464)

### BREAKING CHANGES

* moved BREAKING CHANGES to top of template.

## [3.0.2](https://github.com/conventional-changelog/conventional-changelog/compare/conventional-changelog-conventionalcommits@3.0.1...conventional-changelog-conventionalcommits@3.0.2) (2019-05-05)

### Bug Fixes

* don't require 'host' and 'repository' when deciding whether to render URLs ([#447](https://github.com/conventional-changelog/conventional-changelog/issues/447)) ([83dff7a](https://github.com/conventional-changelog/conventional-changelog/commit/83dff7a))
* if ! and BREAKING CHANGE were used, notes would populate twice ([#446](https://github.com/conventional-changelog/conventional-changelog/issues/446)) ([63d8cbe](https://github.com/conventional-changelog/conventional-changelog/commit/63d8cbe))

## [3.0.1](https://github.com/conventional-changelog/conventional-changelog/compare/conventional-changelog-conventionalcommits@3.0.0...conventional-changelog-conventionalcommits@3.0.1) (2019-05-02)

### Bug Fixes

* add add-bang-notes to files list ([7e4e4d2](https://github.com/conventional-changelog/conventional-changelog/commit/7e4e4d2))

# [3.0.0](https://github.com/conventional-changelog/conventional-changelog/compare/conventional-changelog-conventionalcommits@2.0.0...conventional-changelog-conventionalcommits@3.0.0) (2019-05-02)

### Features

* ! without BREAKING CHANGE should be treated as major ([#443](https://github.com/conventional-changelog/conventional-changelog/issues/443)) ([cf22d70](https://github.com/conventional-changelog/conventional-changelog/commit/cf22d70))

### BREAKING CHANGES

* if ! is in the commit header, it now indicates a BREAKING CHANGE, and the description is used as the body.

# [2.0.0](https://github.com/conventional-changelog/conventional-changelog/compare/conventional-changelog-conventionalcommits@1.1.2...conventional-changelog-conventionalcommits@2.0.0) (2019-04-26)

### Bug Fixes

* don't use multiple H1 tags ([#440](https://github.com/conventional-changelog/conventional-changelog/issues/440)) ([3d79263](https://github.com/conventional-changelog/conventional-changelog/commit/3d79263))

### Features

* add support for ! ([#441](https://github.com/conventional-changelog/conventional-changelog/issues/441)) ([0887940](https://github.com/conventional-changelog/conventional-changelog/commit/0887940))

### BREAKING CHANGES

* a ! character at the end of type will now be omitted

## [1.1.2](https://github.com/conventional-changelog/conventional-changelog/compare/conventional-changelog-conventionalcommits@1.1.1...conventional-changelog-conventionalcommits@1.1.2) (2019-04-24)

### Bug Fixes

* Downgrade node 10.x dependency to 6.9.0 dependency ([#437](https://github.com/conventional-changelog/conventional-changelog/issues/437)) ([ded5a30](https://github.com/conventional-changelog/conventional-changelog/commit/ded5a30))

## [1.1.1](https://github.com/conventional-changelog/conventional-changelog/compare/conventional-changelog-conventionalcommits@1.1.0...conventional-changelog-conventionalcommits@1.1.1) (2019-04-11)

**Note:** Version bump only for package conventional-changelog-conventionalcommits

# 1.1.0 (2019-04-10)

### Bug Fixes

* address discrepancies between cc preset and spec ([#429](https://github.com/conventional-changelog/conventional-changelog/issues/429)) ([18f71d2](https://github.com/conventional-changelog/conventional-changelog/commit/18f71d2))
* adhere to config spec ([#432](https://github.com/conventional-changelog/conventional-changelog/issues/432)) ([4eb1f55](https://github.com/conventional-changelog/conventional-changelog/commit/4eb1f55))

### Features

* conventionalcommits preset, preMajor config option ([#434](https://github.com/conventional-changelog/conventional-changelog/issues/434)) ([dde12fe](https://github.com/conventional-changelog/conventional-changelog/commit/dde12fe))
* creating highly configurable preset, based on conventionalcommits.org ([#421](https://github.com/conventional-changelog/conventional-changelog/issues/421)) ([f2fb240](https://github.com/conventional-changelog/conventional-changelog/commit/f2fb240))
