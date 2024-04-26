# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [6.0.0](https://github.com/conventional-changelog/conventional-changelog/compare/conventional-changelog-eslint-v5.0.0...conventional-changelog-eslint-v6.0.0) (2024-04-26)


### ⚠ BREAKING CHANGES

* Node >= 18 is required
* cleanup presets interface ([#1215](https://github.com/conventional-changelog/conventional-changelog/issues/1215))
* **conventional-changelog-writer:** rewrite to TypeScript ([#1150](https://github.com/conventional-changelog/conventional-changelog/issues/1150))
* Now all packages, except gulp-conventional-changelog, are ESM-only.
* **git-semver-tags,conventional-recommended-bump:** gitSemverTags and conventionalRecommendedBump now return promises
* **standard-changelog:** createIfMissing method now returns a promise

### Features

* cleanup presets interface ([#1215](https://github.com/conventional-changelog/conventional-changelog/issues/1215)) ([0e4f293](https://github.com/conventional-changelog/conventional-changelog/commit/0e4f2935add5dbf68410ea3c245ed8bd13e292a8))
* **conventional-changelog-writer:** rewrite to TypeScript ([#1150](https://github.com/conventional-changelog/conventional-changelog/issues/1150)) ([8af364f](https://github.com/conventional-changelog/conventional-changelog/commit/8af364feb20f4e6f7ffab6f5b25638df780db715))
* drop node 16 support ([#1226](https://github.com/conventional-changelog/conventional-changelog/issues/1226)) ([ec69cfd](https://github.com/conventional-changelog/conventional-changelog/commit/ec69cfdf0040f73ec0eadc4779c37874e71f3dff))
* **git-semver-tags,conventional-recommended-bump:** refactoring to use promises instead of callbacks ([#1112](https://github.com/conventional-changelog/conventional-changelog/issues/1112)) ([1697ecd](https://github.com/conventional-changelog/conventional-changelog/commit/1697ecdf4c2329732e612cc1bd3323e84f046f3a))
* move from CommonJS to ESM ([#1144](https://github.com/conventional-changelog/conventional-changelog/issues/1144)) ([c5b859d](https://github.com/conventional-changelog/conventional-changelog/commit/c5b859d201e124822002eb54574f003f074216e2))
* **standard-changelog:** use promises ([#1111](https://github.com/conventional-changelog/conventional-changelog/issues/1111)) ([5015ab7](https://github.com/conventional-changelog/conventional-changelog/commit/5015ab71de7a3db9cbcbbabd0cc25502f1cd0109))

## [5.0.0](https://github.com/conventional-changelog/conventional-changelog/compare/conventional-changelog-eslint-v4.0.0...conventional-changelog-eslint-v5.0.0) (2023-08-26)


### ⚠ BREAKING CHANGES

* Node >= 16 is required
* Now all presets are exports preset config factory function. conventional-changelog-preset-loader now exports new loadPreset and createPresetLoader functions. If you are using presets indirectly, using preset name, no any changes in configuration needed, just upgrade packages to latest versions.

### Features

* drop node 14 support ([#1085](https://github.com/conventional-changelog/conventional-changelog/issues/1085)) ([1bce036](https://github.com/conventional-changelog/conventional-changelog/commit/1bce0362dbb624a869eb01fd7724ab7f81d337e6))
* unified presets interface ([#1045](https://github.com/conventional-changelog/conventional-changelog/issues/1045)) ([8d0ffbe](https://github.com/conventional-changelog/conventional-changelog/commit/8d0ffbe6c59b861b560cea0e3594c7b32e978cc3))

## [4.0.0](https://github.com/conventional-changelog/conventional-changelog/compare/conventional-changelog-eslint-v3.0.9...conventional-changelog-eslint-v4.0.0) (2023-06-06)


### ⚠ BREAKING CHANGES

* now all promises are native
* Node >= 14 is required

### Features

* **eslint:** improve regex headerPattern ([#268](https://github.com/conventional-changelog/conventional-changelog/issues/268)) ([ccc1365](https://github.com/conventional-changelog/conventional-changelog/commit/ccc136505712fdf3e13e4c52a8d23f568ad8b3f0))
* **preset:** add recommended-bump opts into presets ([60815b5](https://github.com/conventional-changelog/conventional-changelog/commit/60815b50bc68b50a8430c21ec0499273a4a1c402))
* re-use parser options within each preset ([#335](https://github.com/conventional-changelog/conventional-changelog/issues/335)) ([d3eaacf](https://github.com/conventional-changelog/conventional-changelog/commit/d3eaacfe642eb7e076e4879a3202cc60ca626b59))

### Bug Fixes

* **preset, eslint:** display short tag in release notes ([b63a5ff](https://github.com/conventional-changelog/conventional-changelog/commit/b63a5ffdf540cdaff2013e4465f640ef5a8f5013)), closes [#313](https://github.com/conventional-changelog/conventional-changelog/issues/313)
* **preset:** ESLint recommended-bump is always "patch" ([#371](https://github.com/conventional-changelog/conventional-changelog/issues/371)) ([35e279d](https://github.com/conventional-changelog/conventional-changelog/commit/35e279d40603b0969c6d622514f5c0984c5bf309))
* **preset:** recommended-bump ESLint preset ([#295](https://github.com/conventional-changelog/conventional-changelog/issues/295)) ([acf9c19](https://github.com/conventional-changelog/conventional-changelog/commit/acf9c193d6930d0ed2c89fc1b0990a784633dfb3))

### Code Refactoring

* drop lodash from dependencies where it possible ([#959](https://github.com/conventional-changelog/conventional-changelog/issues/959)) ([a8b4e12](https://github.com/conventional-changelog/conventional-changelog/commit/a8b4e12883021231befc6bdfeb95a9b50637f361))
* drop q from dependencies ([#974](https://github.com/conventional-changelog/conventional-changelog/issues/974)) ([d0e5d59](https://github.com/conventional-changelog/conventional-changelog/commit/d0e5d5926c8addba74bc962553dd8bcfba90e228))
* remove anchor from header templates ([#301](https://github.com/conventional-changelog/conventional-changelog/issues/301)) ([346f24f](https://github.com/conventional-changelog/conventional-changelog/commit/346f24f0f8d92b64ed62658796d1876a52ec3ab3))

## [3.0.9](https://github.com/conventional-changelog/conventional-changelog/compare/conventional-changelog-eslint@3.0.8...conventional-changelog-eslint@3.0.9) (2020-11-05)

**Note:** Version bump only for package conventional-changelog-eslint





## [3.0.8](https://github.com/conventional-changelog/conventional-changelog/compare/conventional-changelog-eslint@3.0.4...conventional-changelog-eslint@3.0.8) (2020-05-08)

**Note:** Version bump only for package conventional-changelog-eslint





## [3.0.3](https://github.com/conventional-changelog/conventional-changelog/compare/conventional-changelog-eslint@3.0.2...conventional-changelog-eslint@3.0.3) (2019-10-02)


### Bug Fixes

* **preset, eslint:** display short tag in release notes ([b63a5ff](https://github.com/conventional-changelog/conventional-changelog/commit/b63a5ff)), closes [#313](https://github.com/conventional-changelog/conventional-changelog/issues/313)





## [3.0.2](https://github.com/conventional-changelog/conventional-changelog/compare/conventional-changelog-eslint@3.0.1...conventional-changelog-eslint@3.0.2) (2019-04-10)

**Note:** Version bump only for package conventional-changelog-eslint





## [3.0.1](https://github.com/conventional-changelog/conventional-changelog/compare/conventional-changelog-eslint@3.0.0...conventional-changelog-eslint@3.0.1) (2018-11-01)


### Bug Fixes

* **preset:** ESLint recommended-bump is always "patch" ([#371](https://github.com/conventional-changelog/conventional-changelog/issues/371)) ([35e279d](https://github.com/conventional-changelog/conventional-changelog/commit/35e279d)), closes [/github.com/conventional-changelog/conventional-changelog/blob/ce1fd981f88ce201e996dfa833e4682de3aafcdd/packages/conventional-changelog-eslint/conventional-recommended-bump.js#L32-L35](https://github.com//github.com/conventional-changelog/conventional-changelog/blob/ce1fd981f88ce201e996dfa833e4682de3aafcdd/packages/conventional-changelog-eslint/conventional-recommended-bump.js/issues/L32-L35)
* Upgrade to Lerna 3, fix Node.js v11 error ([#385](https://github.com/conventional-changelog/conventional-changelog/issues/385)) ([cdef282](https://github.com/conventional-changelog/conventional-changelog/commit/cdef282))





<a name="3.0.0"></a>
# [3.0.0](https://github.com/conventional-changelog/conventional-changelog/compare/conventional-changelog-eslint@2.0.0...conventional-changelog-eslint@3.0.0) (2018-06-06)


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




<a name="2.0.0"></a>
# [2.0.0](https://github.com/conventional-changelog/conventional-changelog/compare/conventional-changelog-eslint@1.0.9...conventional-changelog-eslint@2.0.0) (2018-05-29)


### Chores

* **package:** set Node requirement to oldest supported LTS ([#329](https://github.com/conventional-changelog/conventional-changelog/issues/329)) ([cae2fe0](https://github.com/conventional-changelog/conventional-changelog/commit/cae2fe0))


### Code Refactoring

* remove anchor from header templates ([#301](https://github.com/conventional-changelog/conventional-changelog/issues/301)) ([346f24f](https://github.com/conventional-changelog/conventional-changelog/commit/346f24f)), closes [#186](https://github.com/conventional-changelog/conventional-changelog/issues/186)


### BREAKING CHANGES

* **package:** Set the package's minimum required Node version to be the oldest LTS
currently supported by the Node Release working group. At this time,
that is Node 6 (which is in its Maintenance LTS phase).
* Anchor tags are removed from the changelog header templates. The
rendered Markdown will no longer contain anchor tags proceeding the
version number header that constitutes the changelog header. This means
that consumers of rendered markdown will not be able to use a URL that
has been constructed to contain a version number anchor tag reference,
since the anchor tag won't exist in the rendered markdown.

It's stronly recomended consumers use the full URL path to the release
page for a given version, as that URL is a permalink to that verison,
contains all relavent release information, and does not, otherwise, rely
on the anchor tag being excessible from the current page view.

As an example, for version `2.0.0` of a GitHub project, the following
URL should be used:
- https://github.com/conventional-changelog/releaser-tools/releases/tag/v2.0.0




<a name="1.0.9"></a>
## [1.0.9](https://github.com/conventional-changelog/conventional-changelog/compare/conventional-changelog-eslint@1.0.8...conventional-changelog-eslint@1.0.9) (2018-03-28)


### Bug Fixes

* revert previous change ([2f4530f](https://github.com/conventional-changelog/conventional-changelog/commit/2f4530f))




<a name="1.0.8"></a>
## [1.0.8](https://github.com/conventional-changelog/conventional-changelog/compare/conventional-changelog-eslint@1.0.7...conventional-changelog-eslint@1.0.8) (2018-03-27)




**Note:** Version bump only for package conventional-changelog-eslint

<a name="1.0.7"></a>
## [1.0.7](https://github.com/conventional-changelog/conventional-changelog/compare/conventional-changelog-eslint@1.0.6...conventional-changelog-eslint@1.0.7) (2018-03-27)




**Note:** Version bump only for package conventional-changelog-eslint

<a name="1.0.6"></a>
## [1.0.6](https://github.com/conventional-changelog/conventional-changelog/compare/conventional-changelog-eslint@1.0.5...conventional-changelog-eslint@1.0.6) (2018-03-22)




**Note:** Version bump only for package conventional-changelog-eslint

<a name="1.0.5"></a>
## [1.0.5](https://github.com/conventional-changelog/conventional-changelog/compare/conventional-changelog-eslint@1.0.4...conventional-changelog-eslint@1.0.5) (2018-03-03)


### Bug Fixes

* **preset:** recommended-bump ESLint preset ([#295](https://github.com/conventional-changelog/conventional-changelog/issues/295)) ([acf9c19](https://github.com/conventional-changelog/conventional-changelog/commit/acf9c19)), closes [#270](https://github.com/conventional-changelog/conventional-changelog/issues/270) [#241](https://github.com/conventional-changelog/conventional-changelog/issues/241)




<a name="1.0.4"></a>
## [1.0.4](https://github.com/conventional-changelog/conventional-changelog/compare/conventional-changelog-eslint@1.0.3...conventional-changelog-eslint@1.0.4) (2018-02-24)




**Note:** Version bump only for package conventional-changelog-eslint

<a name="1.0.3"></a>
## [1.0.3](https://github.com/conventional-changelog/conventional-changelog/compare/conventional-changelog-eslint@1.0.2...conventional-changelog-eslint@1.0.3) (2018-02-20)




**Note:** Version bump only for package conventional-changelog-eslint

<a name="1.0.2"></a>
## [1.0.2](https://github.com/stevemao/conventional-changelog-eslint/compare/conventional-changelog-eslint@1.0.1...conventional-changelog-eslint@1.0.2) (2018-02-13)




**Note:** Version bump only for package conventional-changelog-eslint

<a name="1.0.1"></a>
## [1.0.1](https://github.com/stevemao/conventional-changelog-eslint/compare/conventional-changelog-eslint@1.0.0...conventional-changelog-eslint@1.0.1) (2018-02-13)




**Note:** Version bump only for package conventional-changelog-eslint

<a name="1.0.0"></a>
# [1.0.0](https://github.com/stevemao/conventional-changelog-eslint/compare/conventional-changelog-eslint@0.3.0...conventional-changelog-eslint@1.0.0) (2018-01-29)


### Features

* **eslint:** improve regex headerPattern ([#268](https://github.com/stevemao/conventional-changelog-eslint/issues/268)) ([ccc1365](https://github.com/stevemao/conventional-changelog-eslint/commit/ccc1365))


### BREAKING CHANGES

* **eslint:** Trailing whitespaces at the beginning of commit messages
will not be saved anymore




<a name="0.3.0"></a>
# [0.3.0](https://github.com/stevemao/conventional-changelog-eslint/compare/conventional-changelog-eslint@0.2.1...conventional-changelog-eslint@0.3.0) (2017-12-18)


### Features

* **preset:** add recommended-bump opts into presets ([60815b5](https://github.com/stevemao/conventional-changelog-eslint/commit/60815b5)), closes [#241](https://github.com/stevemao/conventional-changelog-eslint/issues/241)




<a name="0.2.1"></a>
## [0.2.1](https://github.com/stevemao/conventional-changelog-eslint/compare/conventional-changelog-eslint@0.2.0...conventional-changelog-eslint@0.2.1) (2017-11-13)




**Note:** Version bump only for package conventional-changelog-eslint

<a name="0.2.0"></a>
# 0.2.0 (2017-07-17)


### Features

* migrate repo to lerna mono-repo ([793e823](https://github.com/stevemao/conventional-changelog-eslint/commit/793e823))
