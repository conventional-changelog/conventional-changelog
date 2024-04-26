# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [5.0.0](https://github.com/conventional-changelog/conventional-changelog/compare/conventional-changelog-cli-v4.1.0...conventional-changelog-cli-v5.0.0) (2024-04-26)


### ⚠ BREAKING CHANGES

* Node >= 18 is required
* cleanup presets interface ([#1215](https://github.com/conventional-changelog/conventional-changelog/issues/1215))
* Now all packages, except gulp-conventional-changelog, are ESM-only.

### Features

* cleanup presets interface ([#1215](https://github.com/conventional-changelog/conventional-changelog/issues/1215)) ([0e4f293](https://github.com/conventional-changelog/conventional-changelog/commit/0e4f2935add5dbf68410ea3c245ed8bd13e292a8))
* drop node 16 support ([#1226](https://github.com/conventional-changelog/conventional-changelog/issues/1226)) ([ec69cfd](https://github.com/conventional-changelog/conventional-changelog/commit/ec69cfdf0040f73ec0eadc4779c37874e71f3dff))
* move from CommonJS to ESM ([#1144](https://github.com/conventional-changelog/conventional-changelog/issues/1144)) ([c5b859d](https://github.com/conventional-changelog/conventional-changelog/commit/c5b859d201e124822002eb54574f003f074216e2))


### Bug Fixes

* **conventional-changelog-cli,conventional-recommended-bump,standard-changelog:** fix config loading ([#1234](https://github.com/conventional-changelog/conventional-changelog/issues/1234)) ([c2c4b3a](https://github.com/conventional-changelog/conventional-changelog/commit/c2c4b3a4cb60f784a4e7ee83d189b85c0acac960))
* **conventional-changelog-cli:** fix link for option prompt ([#1159](https://github.com/conventional-changelog/conventional-changelog/issues/1159)) ([7e51c6d](https://github.com/conventional-changelog/conventional-changelog/commit/7e51c6d1bed61dfa7d8dedf7b11a0a027a222f3f))
* **deps:** update dependency meow to v13 ([#1190](https://github.com/conventional-changelog/conventional-changelog/issues/1190)) ([862f66b](https://github.com/conventional-changelog/conventional-changelog/commit/862f66ba99989af2d44a524b11bc3a873426b00b))

## [4.1.0](https://github.com/conventional-changelog/conventional-changelog/compare/conventional-changelog-cli-v4.0.0...conventional-changelog-cli-v4.1.0) (2023-09-09)

**Note:** Upgrade workspace dependencies.

## [4.0.0](https://github.com/conventional-changelog/conventional-changelog/compare/conventional-changelog-cli-v3.0.0...conventional-changelog-cli-v4.0.0) (2023-08-26)


### ⚠ BREAKING CHANGES

* Node >= 16 is required
* Now all presets are exports preset config factory function. conventional-changelog-preset-loader now exports new loadPreset and createPresetLoader functions. If you are using presets indirectly, using preset name, no any changes in configuration needed, just upgrade packages to latest versions.

### Features

* drop node 14 support ([#1085](https://github.com/conventional-changelog/conventional-changelog/issues/1085)) ([1bce036](https://github.com/conventional-changelog/conventional-changelog/commit/1bce0362dbb624a869eb01fd7724ab7f81d337e6))
* unified presets interface ([#1045](https://github.com/conventional-changelog/conventional-changelog/issues/1045)) ([8d0ffbe](https://github.com/conventional-changelog/conventional-changelog/commit/8d0ffbe6c59b861b560cea0e3594c7b32e978cc3))


### Bug Fixes

* **deps:** update dependency tempfile to v5 ([#1041](https://github.com/conventional-changelog/conventional-changelog/issues/1041)) ([c026e30](https://github.com/conventional-changelog/conventional-changelog/commit/c026e3006cd4cc2d49812ff8a4cfa9f3d4b3795c))
* fix semver vulnerability ([#1071](https://github.com/conventional-changelog/conventional-changelog/issues/1071)) ([3f5c99d](https://github.com/conventional-changelog/conventional-changelog/commit/3f5c99d503ea1bf01df679f4180c39516e190b21)), closes [#1019](https://github.com/conventional-changelog/conventional-changelog/issues/1019)

## [3.0.0](https://github.com/conventional-changelog/conventional-changelog/compare/conventional-changelog-cli-v2.2.2...conventional-changelog-cli-v3.0.0) (2023-06-05)


### ⚠ BREAKING CHANGES

* now all promises are native
* Node >= 14 is required

### Code Refactoring

* drop lodash from dependencies where it possible ([#959](https://github.com/conventional-changelog/conventional-changelog/issues/959)) ([a8b4e12](https://github.com/conventional-changelog/conventional-changelog/commit/a8b4e12883021231befc6bdfeb95a9b50637f361))
* drop q from dependencies ([#974](https://github.com/conventional-changelog/conventional-changelog/issues/974)) ([d0e5d59](https://github.com/conventional-changelog/conventional-changelog/commit/d0e5d5926c8addba74bc962553dd8bcfba90e228))

### [2.2.2](https://github.com/conventional-changelog/conventional-changelog/compare/conventional-changelog-cli-v2.2.1...conventional-changelog-cli-v2.2.2) (2021-12-24)


### Bug Fixes

* **docs:** update list of available presets ([#871](https://github.com/conventional-changelog/conventional-changelog/issues/871)) ([2799851](https://github.com/conventional-changelog/conventional-changelog/commit/2799851f1915a42cb8498cf8959875badd07fd32))

## [2.1.1](https://github.com/conventional-changelog/conventional-changelog/compare/conventional-changelog-cli@2.1.0...conventional-changelog-cli@2.1.1) (2020-11-05)

**Note:** Version bump only for package conventional-changelog-cli





# [2.1.0](https://github.com/conventional-changelog/conventional-changelog/compare/conventional-changelog-cli@2.0.35...conventional-changelog-cli@2.1.0) (2020-08-12)


### Features

* add support for '--skip-unstable' option ([#656](https://github.com/conventional-changelog/conventional-changelog/issues/656)) ([#656](https://github.com/conventional-changelog/conventional-changelog/issues/656)) ([0679d7a](https://github.com/conventional-changelog/conventional-changelog/commit/0679d7a1d7a8715918326f31ec3f6168c2341fd6))





## [2.0.35](https://github.com/conventional-changelog/conventional-changelog/compare/conventional-changelog-cli@2.0.34...conventional-changelog-cli@2.0.35) (2020-06-20)

**Note:** Version bump only for package conventional-changelog-cli





## [2.0.34](https://github.com/conventional-changelog/conventional-changelog/compare/conventional-changelog-cli@2.0.33...conventional-changelog-cli@2.0.34) (2020-05-08)


### Bug Fixes

* **deps:** address CVE in meow ([#642](https://github.com/conventional-changelog/conventional-changelog/issues/642)) ([46311d2](https://github.com/conventional-changelog/conventional-changelog/commit/46311d2932b367f370d06c4e447b8dcf4bc4e83f))





## [2.0.33](https://github.com/conventional-changelog/conventional-changelog/compare/conventional-changelog-cli@2.0.29...conventional-changelog-cli@2.0.33) (2020-05-08)


### Bug Fixes

* **deps:** update yargs-parser to move off a flagged-vulnerable version. ([#635](https://github.com/conventional-changelog/conventional-changelog/issues/635)) ([aafc0f0](https://github.com/conventional-changelog/conventional-changelog/commit/aafc0f00412c3e4b23b8418300e5a570a48fe24d))





## [2.0.29](https://github.com/conventional-changelog/conventional-changelog/compare/conventional-changelog-cli@2.0.28...conventional-changelog-cli@2.0.29) (2019-11-21)

**Note:** Version bump only for package conventional-changelog-cli





## [2.0.28](https://github.com/conventional-changelog/conventional-changelog/compare/conventional-changelog-cli@2.0.27...conventional-changelog-cli@2.0.28) (2019-11-14)


### Bug Fixes

* add types for cli flags ([#551](https://github.com/conventional-changelog/conventional-changelog/issues/551)) ([bf1d64a](https://github.com/conventional-changelog/conventional-changelog/commit/bf1d64aeaf8f262d4b2beec02d2aebb78df7343b))





## [2.0.27](https://github.com/conventional-changelog/conventional-changelog/compare/conventional-changelog-cli@2.0.26...conventional-changelog-cli@2.0.27) (2019-11-07)

**Note:** Version bump only for package conventional-changelog-cli





## [2.0.26](https://github.com/conventional-changelog/conventional-changelog/compare/conventional-changelog-cli@2.0.25...conventional-changelog-cli@2.0.26) (2019-10-24)


### Bug Fixes

* **deps:** update lodash to fix security issues ([#535](https://github.com/conventional-changelog/conventional-changelog/issues/535)) ([ac43f51](https://github.com/conventional-changelog/conventional-changelog/commit/ac43f51de1f3b597c32f7f8442917a2d06199018))





## [2.0.24](https://github.com/conventional-changelog/conventional-changelog/compare/conventional-changelog-cli@2.0.23...conventional-changelog-cli@2.0.24) (2019-10-02)


### Bug Fixes

* **deps:** update dependency tempfile to v3 ([#459](https://github.com/conventional-changelog/conventional-changelog/issues/459)) ([c0bac28](https://github.com/conventional-changelog/conventional-changelog/commit/c0bac28))
* **preset-loader:** fix handling conventionalcommits preset without config object ([6425972](https://github.com/conventional-changelog/conventional-changelog/commit/6425972)), closes [#512](https://github.com/conventional-changelog/conventional-changelog/issues/512)
* **preset, conventionalcommits:** fix handling conventionalcommits preset without config object ([c0566ce](https://github.com/conventional-changelog/conventional-changelog/commit/c0566ce)), closes [#512](https://github.com/conventional-changelog/conventional-changelog/issues/512)


### Reverts

* "fix(preset-loader): fix handling conventionalcommits preset without config object" ([#520](https://github.com/conventional-changelog/conventional-changelog/issues/520)) ([417139c](https://github.com/conventional-changelog/conventional-changelog/commit/417139c))





## [2.0.23](https://github.com/conventional-changelog/conventional-changelog/compare/conventional-changelog-cli@2.0.22...conventional-changelog-cli@2.0.23) (2019-07-29)


### Bug Fixes

* **deps, cli:** bumps (minor + patch) lodash in conventional-changelog-cli ([#501](https://github.com/conventional-changelog/conventional-changelog/issues/501)) ([50212e6](https://github.com/conventional-changelog/conventional-changelog/commit/50212e6)), closes [#486](https://github.com/conventional-changelog/conventional-changelog/issues/486)





## [2.0.22](https://github.com/conventional-changelog/conventional-changelog/compare/conventional-changelog-cli@2.0.21...conventional-changelog-cli@2.0.22) (2019-05-18)


### Bug Fixes

* **cli.js:** fix issue where standard conventional-changelog options are not passed into options object ([#380](https://github.com/conventional-changelog/conventional-changelog/issues/380)) ([86ae571](https://github.com/conventional-changelog/conventional-changelog/commit/86ae571))





## [2.0.21](https://github.com/conventional-changelog/conventional-changelog/compare/conventional-changelog-cli@2.0.20...conventional-changelog-cli@2.0.21) (2019-05-05)

**Note:** Version bump only for package conventional-changelog-cli





## [2.0.20](https://github.com/conventional-changelog/conventional-changelog/compare/conventional-changelog-cli@2.0.19...conventional-changelog-cli@2.0.20) (2019-05-02)

**Note:** Version bump only for package conventional-changelog-cli





## [2.0.19](https://github.com/conventional-changelog/conventional-changelog/compare/conventional-changelog-cli@2.0.18...conventional-changelog-cli@2.0.19) (2019-05-02)

**Note:** Version bump only for package conventional-changelog-cli





## [2.0.18](https://github.com/conventional-changelog/conventional-changelog/compare/conventional-changelog-cli@2.0.17...conventional-changelog-cli@2.0.18) (2019-04-26)

**Note:** Version bump only for package conventional-changelog-cli





## [2.0.17](https://github.com/conventional-changelog/conventional-changelog/compare/conventional-changelog-cli@2.0.16...conventional-changelog-cli@2.0.17) (2019-04-24)

**Note:** Version bump only for package conventional-changelog-cli





## [2.0.16](https://github.com/conventional-changelog/conventional-changelog/compare/conventional-changelog-cli@2.0.15...conventional-changelog-cli@2.0.16) (2019-04-11)

**Note:** Version bump only for package conventional-changelog-cli





## [2.0.15](https://github.com/conventional-changelog/conventional-changelog/compare/conventional-changelog-cli@2.0.14...conventional-changelog-cli@2.0.15) (2019-04-11)

**Note:** Version bump only for package conventional-changelog-cli





## [2.0.14](https://github.com/conventional-changelog/conventional-changelog/compare/conventional-changelog-cli@2.0.13...conventional-changelog-cli@2.0.14) (2019-04-11)

**Note:** Version bump only for package conventional-changelog-cli





## [2.0.13](https://github.com/conventional-changelog/conventional-changelog/compare/conventional-changelog-cli@2.0.12...conventional-changelog-cli@2.0.13) (2019-04-10)

**Note:** Version bump only for package conventional-changelog-cli





## [2.0.12](https://github.com/conventional-changelog/conventional-changelog/compare/conventional-changelog-cli@2.0.11...conventional-changelog-cli@2.0.12) (2019-02-14)

**Note:** Version bump only for package conventional-changelog-cli





## [2.0.11](https://github.com/conventional-changelog/conventional-changelog/compare/conventional-changelog-cli@2.0.10...conventional-changelog-cli@2.0.11) (2018-11-01)

**Note:** Version bump only for package conventional-changelog-cli





## [2.0.10](https://github.com/conventional-changelog/conventional-changelog/compare/conventional-changelog-cli@2.0.9...conventional-changelog-cli@2.0.10) (2018-11-01)

**Note:** Version bump only for package conventional-changelog-cli





## [2.0.9](https://github.com/conventional-changelog/conventional-changelog/compare/conventional-changelog-cli@2.0.8...conventional-changelog-cli@2.0.9) (2018-11-01)

**Note:** Version bump only for package conventional-changelog-cli





## [2.0.8](https://github.com/conventional-changelog/conventional-changelog/compare/conventional-changelog-cli@2.0.7...conventional-changelog-cli@2.0.8) (2018-11-01)

**Note:** Version bump only for package conventional-changelog-cli





## [2.0.7](https://github.com/conventional-changelog/conventional-changelog/compare/conventional-changelog-cli@2.0.6...conventional-changelog-cli@2.0.7) (2018-11-01)

**Note:** Version bump only for package conventional-changelog-cli





## [2.0.6](https://github.com/conventional-changelog/conventional-changelog/compare/conventional-changelog-cli@2.0.5...conventional-changelog-cli@2.0.6) (2018-11-01)


### Bug Fixes

* Upgrade to Lerna 3, fix Node.js v11 error ([#385](https://github.com/conventional-changelog/conventional-changelog/issues/385)) ([cdef282](https://github.com/conventional-changelog/conventional-changelog/commit/cdef282))





<a name="2.0.5"></a>
## [2.0.5](https://github.com/conventional-changelog/conventional-changelog/compare/conventional-changelog-cli@2.0.4...conventional-changelog-cli@2.0.5) (2018-08-21)




**Note:** Version bump only for package conventional-changelog-cli

<a name="2.0.4"></a>
## [2.0.4](https://github.com/conventional-changelog/conventional-changelog/compare/conventional-changelog-cli@2.0.3...conventional-changelog-cli@2.0.4) (2018-08-21)


### Bug Fixes

* **cli:** pass `--tag-prefix` option to core ([#345](https://github.com/conventional-changelog/conventional-changelog/issues/345)) ([2151fce](https://github.com/conventional-changelog/conventional-changelog/commit/2151fce))




<a name="2.0.3"></a>
## [2.0.3](https://github.com/conventional-changelog/conventional-changelog/compare/conventional-changelog-cli@2.0.2...conventional-changelog-cli@2.0.3) (2018-08-21)




**Note:** Version bump only for package conventional-changelog-cli

<a name="2.0.2"></a>
## [2.0.2](https://github.com/conventional-changelog/conventional-changelog/compare/conventional-changelog-cli@2.0.1...conventional-changelog-cli@2.0.2) (2018-08-21)


### Bug Fixes

* add missing context flag ([#361](https://github.com/conventional-changelog/conventional-changelog/issues/361)) ([0cf43f4](https://github.com/conventional-changelog/conventional-changelog/commit/0cf43f4)), closes [#355](https://github.com/conventional-changelog/conventional-changelog/issues/355)




<a name="2.0.1"></a>
## [2.0.1](https://github.com/conventional-changelog/conventional-changelog/compare/conventional-changelog-cli@2.0.0...conventional-changelog-cli@2.0.1) (2018-06-06)




**Note:** Version bump only for package conventional-changelog-cli

<a name="2.0.0"></a>
# [2.0.0](https://github.com/conventional-changelog/conventional-changelog/compare/conventional-changelog-cli@1.3.22...conventional-changelog-cli@2.0.0) (2018-05-29)


### Chores

* **package:** set Node requirement to oldest supported LTS ([#329](https://github.com/conventional-changelog/conventional-changelog/issues/329)) ([cae2fe0](https://github.com/conventional-changelog/conventional-changelog/commit/cae2fe0))


### BREAKING CHANGES

* **package:** Set the package's minimum required Node version to be the oldest LTS
currently supported by the Node Release working group. At this time,
that is Node 6 (which is in its Maintenance LTS phase).




<a name="1.3.22"></a>
## [1.3.22](https://github.com/conventional-changelog/conventional-changelog/compare/conventional-changelog-cli@1.3.21...conventional-changelog-cli@1.3.22) (2018-04-16)




**Note:** Version bump only for package conventional-changelog-cli

<a name="1.3.21"></a>
## [1.3.21](https://github.com/conventional-changelog/conventional-changelog/compare/conventional-changelog-cli@1.3.20...conventional-changelog-cli@1.3.21) (2018-03-28)




**Note:** Version bump only for package conventional-changelog-cli

<a name="1.3.20"></a>
## [1.3.20](https://github.com/conventional-changelog/conventional-changelog/compare/conventional-changelog-cli@1.3.19...conventional-changelog-cli@1.3.20) (2018-03-27)




**Note:** Version bump only for package conventional-changelog-cli

<a name="1.3.19"></a>
## [1.3.19](https://github.com/conventional-changelog/conventional-changelog/compare/conventional-changelog-cli@1.3.18...conventional-changelog-cli@1.3.19) (2018-03-27)




**Note:** Version bump only for package conventional-changelog-cli

<a name="1.3.18"></a>
## [1.3.18](https://github.com/conventional-changelog/conventional-changelog/compare/conventional-changelog-cli@1.3.17...conventional-changelog-cli@1.3.18) (2018-03-27)




**Note:** Version bump only for package conventional-changelog-cli

<a name="1.3.17"></a>
## [1.3.17](https://github.com/conventional-changelog/conventional-changelog/compare/conventional-changelog-cli@1.3.16...conventional-changelog-cli@1.3.17) (2018-03-22)




**Note:** Version bump only for package conventional-changelog-cli

<a name="1.3.16"></a>
## [1.3.16](https://github.com/conventional-changelog/conventional-changelog/compare/conventional-changelog-cli@1.3.15...conventional-changelog-cli@1.3.16) (2018-03-03)




**Note:** Version bump only for package conventional-changelog-cli

<a name="1.3.15"></a>
## [1.3.15](https://github.com/conventional-changelog/conventional-changelog/compare/conventional-changelog-cli@1.3.14...conventional-changelog-cli@1.3.15) (2018-02-24)




**Note:** Version bump only for package conventional-changelog-cli

<a name="1.3.14"></a>
## [1.3.14](https://github.com/conventional-changelog/conventional-changelog/compare/conventional-changelog-cli@1.3.13...conventional-changelog-cli@1.3.14) (2018-02-20)




**Note:** Version bump only for package conventional-changelog-cli

<a name="1.3.13"></a>
## [1.3.13](https://github.com/conventional-changelog/conventional-changelog-cli/compare/conventional-changelog-cli@1.3.12...conventional-changelog-cli@1.3.13) (2018-02-13)




**Note:** Version bump only for package conventional-changelog-cli

<a name="1.3.12"></a>
## [1.3.12](https://github.com/conventional-changelog/conventional-changelog-cli/compare/conventional-changelog-cli@1.3.11...conventional-changelog-cli@1.3.12) (2018-02-13)




**Note:** Version bump only for package conventional-changelog-cli

<a name="1.3.11"></a>
## [1.3.11](https://github.com/conventional-changelog/conventional-changelog-cli/compare/conventional-changelog-cli@1.3.10...conventional-changelog-cli@1.3.11) (2018-02-13)




**Note:** Version bump only for package conventional-changelog-cli

<a name="1.3.10"></a>
## [1.3.10](https://github.com/conventional-changelog/conventional-changelog-cli/compare/conventional-changelog-cli@1.3.9...conventional-changelog-cli@1.3.10) (2018-02-12)




**Note:** Version bump only for package conventional-changelog-cli

<a name="1.3.9"></a>
## [1.3.9](https://github.com/conventional-changelog/conventional-changelog-cli/compare/conventional-changelog-cli@1.3.8...conventional-changelog-cli@1.3.9) (2018-02-05)


### Bug Fixes

* **cli:** set options.config to loaded custom config for processing ([3d8b243](https://github.com/conventional-changelog/conventional-changelog-cli/commit/3d8b243)), closes [#227](https://github.com/conventional-changelog/conventional-changelog-cli/issues/227)




<a name="1.3.8"></a>
## [1.3.8](https://github.com/conventional-changelog/conventional-changelog-cli/compare/conventional-changelog-cli@1.3.7...conventional-changelog-cli@1.3.8) (2018-01-29)




**Note:** Version bump only for package conventional-changelog-cli

<a name="1.3.7"></a>
## [1.3.7](https://github.com/conventional-changelog/conventional-changelog-cli/compare/conventional-changelog-cli@1.3.6...conventional-changelog-cli@1.3.7) (2017-12-18)




**Note:** Version bump only for package conventional-changelog-cli

<a name="1.3.6"></a>
## [1.3.6](https://github.com/conventional-changelog/conventional-changelog-cli/compare/conventional-changelog-cli@1.3.5...conventional-changelog-cli@1.3.6) (2017-12-08)




**Note:** Version bump only for package conventional-changelog-cli

<a name="1.3.5"></a>
## [1.3.5](https://github.com/conventional-changelog/conventional-changelog-cli/compare/conventional-changelog-cli@1.3.4...conventional-changelog-cli@1.3.5) (2017-11-13)




**Note:** Version bump only for package conventional-changelog-cli

<a name="1.3.4"></a>
## [1.3.4](https://github.com/conventional-changelog/conventional-changelog-cli/compare/conventional-changelog-cli@1.3.3...conventional-changelog-cli@1.3.4) (2017-10-01)

<a name="1.3.3"></a>
## [1.3.3](https://github.com/conventional-changelog/conventional-changelog-cli/compare/conventional-changelog-cli@1.3.2...conventional-changelog-cli@1.3.3) (2017-09-01)

<a name="1.3.2"></a>
## [1.3.2](https://github.com/conventional-changelog/conventional-changelog-cli/compare/conventional-changelog-cli@1.3.1...conventional-changelog-cli@1.3.2) (2017-07-17)

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
