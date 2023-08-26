# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [6.0.0](https://github.com/conventional-changelog/conventional-changelog/compare/git-semver-tags-v5.0.1...git-semver-tags-v6.0.0) (2023-08-26)


### ⚠ BREAKING CHANGES

* Node >= 16 is required
* Now all presets are exports preset config factory function. conventional-changelog-preset-loader now exports new loadPreset and createPresetLoader functions. If you are using presets indirectly, using preset name, no any changes in configuration needed, just upgrade packages to latest versions.

### Features

* drop node 14 support ([#1085](https://github.com/conventional-changelog/conventional-changelog/issues/1085)) ([1bce036](https://github.com/conventional-changelog/conventional-changelog/commit/1bce0362dbb624a869eb01fd7724ab7f81d337e6))
* **git-semver-tags,conventional-recommended-bump:** define `skip-unstable` option in cli ([#1066](https://github.com/conventional-changelog/conventional-changelog/issues/1066)) ([0ffec3f](https://github.com/conventional-changelog/conventional-changelog/commit/0ffec3f60a1119e180e244b5500f9a8c35671a98))
* unified presets interface ([#1045](https://github.com/conventional-changelog/conventional-changelog/issues/1045)) ([8d0ffbe](https://github.com/conventional-changelog/conventional-changelog/commit/8d0ffbe6c59b861b560cea0e3594c7b32e978cc3))


### Bug Fixes

* fix semver vulnerability ([#1071](https://github.com/conventional-changelog/conventional-changelog/issues/1071)) ([3f5c99d](https://github.com/conventional-changelog/conventional-changelog/commit/3f5c99d503ea1bf01df679f4180c39516e190b21)), closes [#1019](https://github.com/conventional-changelog/conventional-changelog/issues/1019)
* **git-semver-tags:** escape regexp characters in the tagPrefix option ([#941](https://github.com/conventional-changelog/conventional-changelog/issues/941)) ([49273ee](https://github.com/conventional-changelog/conventional-changelog/commit/49273ee1ce3360d464c5e1c38b2d1b07881f9048))

## [5.0.1](https://github.com/conventional-changelog/conventional-changelog/compare/git-semver-tags-v5.0.0...git-semver-tags-v5.0.1) (2023-07-09)


### Bug Fixes

* **deps:** update dependency semver to v7 [security] ([#1021](https://github.com/conventional-changelog/conventional-changelog/issues/1021)) ([31fa409](https://github.com/conventional-changelog/conventional-changelog/commit/31fa409e446a51a5a23e2217997d04364b89c1dd))

## [5.0.0](https://github.com/conventional-changelog/conventional-changelog/compare/git-semver-tags-v4.1.1...git-semver-tags-v5.0.0) (2023-06-06)


### ⚠ BREAKING CHANGES

* Node >= 14 is required
* **git-semver-tags:** --tagPrefix flag was changed to --tag-prefix
* gitSemverTags now takes options followed by callback.

### Features

* add support for '--skip-unstable' option ([#656](https://github.com/conventional-changelog/conventional-changelog/issues/656)) ([#656](https://github.com/conventional-changelog/conventional-changelog/issues/656)) ([0679d7a](https://github.com/conventional-changelog/conventional-changelog/commit/0679d7a1d7a8715918326f31ec3f6168c2341fd6))
* add support for listing lerna style tags (project@version) ([#161](https://github.com/conventional-changelog/conventional-changelog/issues/161)) ([b245f9d](https://github.com/conventional-changelog/conventional-changelog/commit/b245f9d46a064a6daa2b46a48eab354c512f46c0))
* allow raw commits to be filtered by path ([#172](https://github.com/conventional-changelog/conventional-changelog/issues/172)) ([ec0a25d](https://github.com/conventional-changelog/conventional-changelog/commit/ec0a25d0664ae74da1201c011814f62bd8e1b031))
* allow to specify a tagPrefix in conventional-recommended-bump ([f60f86f](https://github.com/conventional-changelog/conventional-changelog/commit/f60f86fa388edb3b0731b2fb0cb5ddabafd36911))

### Bug Fixes

* add types for cli flags ([#551](https://github.com/conventional-changelog/conventional-changelog/issues/551)) ([bf1d64a](https://github.com/conventional-changelog/conventional-changelog/commit/bf1d64aeaf8f262d4b2beec02d2aebb78df7343b))
* bad release of git-semver-tags ([8827ae4](https://github.com/conventional-changelog/conventional-changelog/commit/8827ae418adf8bd400ce879548c732812e5934ea))
* bug in unstableTagTest causing a mismatch on beta release higher then beta-9 ([#679](https://github.com/conventional-changelog/conventional-changelog/issues/679)) ([cd4c726](https://github.com/conventional-changelog/conventional-changelog/commit/cd4c726b1ca227a132ec2eadac5d0cfdd75d9e81))
* **deps:** update dependency semver to v6 ([#458](https://github.com/conventional-changelog/conventional-changelog/issues/458)) ([efaa7bb](https://github.com/conventional-changelog/conventional-changelog/commit/efaa7bb651fe1b6de047163fc9db8e5d69f0a6e9))
* **deps:** update yargs-parser to move off a flagged-vulnerable version. ([#635](https://github.com/conventional-changelog/conventional-changelog/issues/635)) ([aafc0f0](https://github.com/conventional-changelog/conventional-changelog/commit/aafc0f00412c3e4b23b8418300e5a570a48fe24d))
* **git-semver-tags:** change --tagPrefix flag to --tag-prefix ([#566](https://github.com/conventional-changelog/conventional-changelog/issues/566)) ([490cda6](https://github.com/conventional-changelog/conventional-changelog/commit/490cda6cff74abe63617f982765b63aebdf3b4b6)), closes [#553](https://github.com/conventional-changelog/conventional-changelog/issues/553)
* **lerna tags:** support multi-digit version tags ([#223](https://github.com/conventional-changelog/conventional-changelog/issues/223)) ([67012fb](https://github.com/conventional-changelog/conventional-changelog/commit/67012fb655a7d968d82185685971ca246751ab0b))

### Code Refactoring

* drop lodash from dependencies where it possible ([#959](https://github.com/conventional-changelog/conventional-changelog/issues/959)) ([a8b4e12](https://github.com/conventional-changelog/conventional-changelog/commit/a8b4e12883021231befc6bdfeb95a9b50637f361))
* modify gitSemverTags to take options first ([#390](https://github.com/conventional-changelog/conventional-changelog/issues/390)) ([dc8aeda](https://github.com/conventional-changelog/conventional-changelog/commit/dc8aedae0519045bfcb2e649167f0f6bfb2f4a30))

## [4.1.1](https://github.com/conventional-changelog/conventional-changelog/compare/git-semver-tags@4.1.0...git-semver-tags@4.1.1) (2020-11-05)


### Bug Fixes

* bug in unstableTagTest causing a mismatch on beta release higher then beta-9 ([#679](https://github.com/conventional-changelog/conventional-changelog/issues/679)) ([cd4c726](https://github.com/conventional-changelog/conventional-changelog/commit/cd4c726b1ca227a132ec2eadac5d0cfdd75d9e81))





# [4.1.0](https://github.com/conventional-changelog/conventional-changelog/compare/git-semver-tags@4.0.0...git-semver-tags@4.1.0) (2020-08-12)


### Features

* add support for '--skip-unstable' option ([#656](https://github.com/conventional-changelog/conventional-changelog/issues/656)) ([#656](https://github.com/conventional-changelog/conventional-changelog/issues/656)) ([0679d7a](https://github.com/conventional-changelog/conventional-changelog/commit/0679d7a1d7a8715918326f31ec3f6168c2341fd6))





# [4.0.0](https://github.com/conventional-changelog/conventional-changelog/compare/git-semver-tags@3.0.1...git-semver-tags@4.0.0) (2020-05-08)


### Bug Fixes

* **deps:** update yargs-parser to move off a flagged-vulnerable version. ([#635](https://github.com/conventional-changelog/conventional-changelog/issues/635)) ([aafc0f0](https://github.com/conventional-changelog/conventional-changelog/commit/aafc0f00412c3e4b23b8418300e5a570a48fe24d))
* **git-semver-tags:** change --tagPrefix flag to --tag-prefix ([#566](https://github.com/conventional-changelog/conventional-changelog/issues/566)) ([490cda6](https://github.com/conventional-changelog/conventional-changelog/commit/490cda6cff74abe63617f982765b63aebdf3b4b6)), closes [#553](https://github.com/conventional-changelog/conventional-changelog/issues/553)


### BREAKING CHANGES

* **git-semver-tags:** --tagPrefix flag was changed to --tag-prefix





## [3.0.1](https://github.com/conventional-changelog/conventional-changelog/compare/git-semver-tags@3.0.0...git-semver-tags@3.0.1) (2019-11-14)


### Bug Fixes

* add types for cli flags ([#551](https://github.com/conventional-changelog/conventional-changelog/issues/551)) ([bf1d64a](https://github.com/conventional-changelog/conventional-changelog/commit/bf1d64aeaf8f262d4b2beec02d2aebb78df7343b))





# [3.0.0](https://github.com/conventional-changelog/conventional-changelog/compare/git-semver-tags@2.0.3...git-semver-tags@3.0.0) (2019-07-29)


* refactor!: modify gitSemverTags to take options first (#390) ([dc8aeda](https://github.com/conventional-changelog/conventional-changelog/commit/dc8aeda)), closes [#390](https://github.com/conventional-changelog/conventional-changelog/issues/390)


### BREAKING CHANGES

* gitSemverTags now takes options followed by callback.





## [2.0.3](https://github.com/conventional-changelog/conventional-changelog/compare/git-semver-tags@2.0.2...git-semver-tags@2.0.3) (2019-05-18)


### Bug Fixes

* **deps:** update dependency semver to v6 ([#458](https://github.com/conventional-changelog/conventional-changelog/issues/458)) ([efaa7bb](https://github.com/conventional-changelog/conventional-changelog/commit/efaa7bb))





## [2.0.2](https://github.com/conventional-changelog/conventional-changelog/compare/git-semver-tags@2.0.1...git-semver-tags@2.0.2) (2018-11-01)


### Bug Fixes

* bad release of git-semver-tags ([8827ae4](https://github.com/conventional-changelog/conventional-changelog/commit/8827ae4))





## [2.0.1](https://github.com/conventional-changelog/conventional-changelog/compare/git-semver-tags@2.0.0...git-semver-tags@2.0.1) (2018-11-01)


### Bug Fixes

* Upgrade to Lerna 3, fix Node.js v11 error ([#385](https://github.com/conventional-changelog/conventional-changelog/issues/385)) ([cdef282](https://github.com/conventional-changelog/conventional-changelog/commit/cdef282))





<a name="2.0.0"></a>
# [2.0.0](https://github.com/conventional-changelog/conventional-changelog/compare/git-semver-tags@1.3.6...git-semver-tags@2.0.0) (2018-05-29)


### Chores

* **package:** set Node requirement to oldest supported LTS ([#329](https://github.com/conventional-changelog/conventional-changelog/issues/329)) ([cae2fe0](https://github.com/conventional-changelog/conventional-changelog/commit/cae2fe0))


### BREAKING CHANGES

* **package:** Set the package's minimum required Node version to be the oldest LTS
currently supported by the Node Release working group. At this time,
that is Node 6 (which is in its Maintenance LTS phase).




<a name="1.3.6"></a>
## [1.3.6](https://github.com/conventional-changelog/conventional-changelog/compare/git-semver-tags@1.3.5...git-semver-tags@1.3.6) (2018-03-27)




**Note:** Version bump only for package git-semver-tags

<a name="1.3.5"></a>
## [1.3.5](https://github.com/conventional-changelog/conventional-changelog/compare/git-semver-tags@1.3.4...git-semver-tags@1.3.5) (2018-03-22)




**Note:** Version bump only for package git-semver-tags

<a name="1.3.4"></a>
## [1.3.4](https://github.com/conventional-changelog/conventional-changelog/compare/git-semver-tags@1.3.3...git-semver-tags@1.3.4) (2018-02-24)




**Note:** Version bump only for package git-semver-tags

<a name="1.3.3"></a>
## [1.3.3](https://github.com/conventional-changelog/conventional-changelog/compare/git-semver-tags@1.3.2...git-semver-tags@1.3.3) (2018-02-20)




**Note:** Version bump only for package git-semver-tags

<a name="1.3.2"></a>
## [1.3.2](https://github.com/stevemao/git-semver-tags/compare/git-semver-tags@1.3.1...git-semver-tags@1.3.2) (2018-02-13)




**Note:** Version bump only for package git-semver-tags

<a name="1.3.1"></a>
## [1.3.1](https://github.com/stevemao/git-semver-tags/compare/git-semver-tags@1.3.0...git-semver-tags@1.3.1) (2018-02-13)




**Note:** Version bump only for package git-semver-tags

<a name="1.3.0"></a>
# [1.3.0](https://github.com/stevemao/git-semver-tags/compare/git-semver-tags@1.2.3...git-semver-tags@1.3.0) (2018-01-29)


### Features

* allow to specify a tagPrefix in conventional-recommended-bump ([f60f86f](https://github.com/stevemao/git-semver-tags/commit/f60f86f))




<a name="1.2.3"></a>
## [1.2.3](https://github.com/stevemao/git-semver-tags/compare/git-semver-tags@1.2.2...git-semver-tags@1.2.3) (2017-11-13)




**Note:** Version bump only for package git-semver-tags

<a name="1.2.2"></a>
## [1.2.2](https://github.com/stevemao/git-semver-tags/compare/git-semver-tags@1.2.1...git-semver-tags@1.2.2) (2017-10-01)


### Bug Fixes

* **lerna tags:** support multi-digit version tags ([#223](https://github.com/conventional-changelog/conventional-changelog/issues/223)) ([67012fb](https://github.com/stevemao/git-semver-tags/commit/67012fb))

<a name="1.2.1"></a>
## [1.2.1](https://github.com/stevemao/git-semver-tags/compare/git-semver-tags@1.2.0...git-semver-tags@1.2.1) (2017-07-17)

<a name="1.2.0"></a>
# [1.0.0](https://github.com/conventional-changelog/conventional-changelog/compare/git-semver-tags@1.1.2...v1.2.0) (2017-03-10)


### Features

* add support for listing lerna style tags (project[@version](https://github.com/version)) ([#161](https://github.com/conventional-changelog/conventional-changelog/issues/161)) ([b245f9d](https://github.com/conventional-changelog/conventional-changelog/commit/b245f9d))
* migrate repo to lerna mono-repo ([793e823](https://github.com/conventional-changelog/conventional-changelog/commit/793e823))
