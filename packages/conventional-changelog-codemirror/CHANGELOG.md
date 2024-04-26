# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [5.0.0](https://github.com/conventional-changelog/conventional-changelog/compare/conventional-changelog-codemirror-v4.0.0...conventional-changelog-codemirror-v5.0.0) (2024-04-26)


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

## [4.0.0](https://github.com/conventional-changelog/conventional-changelog/compare/conventional-changelog-codemirror-v3.0.0...conventional-changelog-codemirror-v4.0.0) (2023-08-26)


### ⚠ BREAKING CHANGES

* Node >= 16 is required
* Now all presets are exports preset config factory function. conventional-changelog-preset-loader now exports new loadPreset and createPresetLoader functions. If you are using presets indirectly, using preset name, no any changes in configuration needed, just upgrade packages to latest versions.

### Features

* drop node 14 support ([#1085](https://github.com/conventional-changelog/conventional-changelog/issues/1085)) ([1bce036](https://github.com/conventional-changelog/conventional-changelog/commit/1bce0362dbb624a869eb01fd7724ab7f81d337e6))
* unified presets interface ([#1045](https://github.com/conventional-changelog/conventional-changelog/issues/1045)) ([8d0ffbe](https://github.com/conventional-changelog/conventional-changelog/commit/8d0ffbe6c59b861b560cea0e3594c7b32e978cc3))

## [3.0.0](https://github.com/conventional-changelog/conventional-changelog/compare/conventional-changelog-codemirror-v2.0.8...conventional-changelog-codemirror-v3.0.0) (2023-06-05)


### ⚠ BREAKING CHANGES

* now all promises are native
* Node >= 14 is required

### Features

* **preset:** add recommended-bump opts into presets ([60815b5](https://github.com/conventional-changelog/conventional-changelog/commit/60815b50bc68b50a8430c21ec0499273a4a1c402))
* re-use parser options within each preset ([#335](https://github.com/conventional-changelog/conventional-changelog/issues/335)) ([d3eaacf](https://github.com/conventional-changelog/conventional-changelog/commit/d3eaacfe642eb7e076e4879a3202cc60ca626b59))

### Bug Fixes

* use full commit hash in commit link ([7a60dec](https://github.com/conventional-changelog/conventional-changelog/commit/7a60decb6979efb5026e399e962313e69b005b22)), closes [#476](https://github.com/conventional-changelog/conventional-changelog/issues/476)

### Code Refactoring

* drop lodash from dependencies where it possible ([#959](https://github.com/conventional-changelog/conventional-changelog/issues/959)) ([a8b4e12](https://github.com/conventional-changelog/conventional-changelog/commit/a8b4e12883021231befc6bdfeb95a9b50637f361))
* drop q from dependencies ([#974](https://github.com/conventional-changelog/conventional-changelog/issues/974)) ([d0e5d59](https://github.com/conventional-changelog/conventional-changelog/commit/d0e5d5926c8addba74bc962553dd8bcfba90e228))
* remove anchor from header templates ([#301](https://github.com/conventional-changelog/conventional-changelog/issues/301)) ([346f24f](https://github.com/conventional-changelog/conventional-changelog/commit/346f24f0f8d92b64ed62658796d1876a52ec3ab3))

## [2.0.8](https://github.com/conventional-changelog/conventional-changelog/compare/conventional-changelog-codemirror@2.0.7...conventional-changelog-codemirror@2.0.8) (2020-11-05)

**Note:** Version bump only for package conventional-changelog-codemirror





## [2.0.7](https://github.com/conventional-changelog/conventional-changelog/compare/conventional-changelog-codemirror@2.0.3...conventional-changelog-codemirror@2.0.7) (2020-05-08)

**Note:** Version bump only for package conventional-changelog-codemirror





## [2.0.2](https://github.com/conventional-changelog/conventional-changelog/compare/conventional-changelog-codemirror@2.0.1...conventional-changelog-codemirror@2.0.2) (2019-10-02)


### Bug Fixes

* use full commit hash in commit link ([7a60dec](https://github.com/conventional-changelog/conventional-changelog/commit/7a60dec)), closes [#476](https://github.com/conventional-changelog/conventional-changelog/issues/476)





## [2.0.1](https://github.com/conventional-changelog/conventional-changelog/compare/conventional-changelog-codemirror@2.0.0...conventional-changelog-codemirror@2.0.1) (2018-11-01)


### Bug Fixes

* Upgrade to Lerna 3, fix Node.js v11 error ([#385](https://github.com/conventional-changelog/conventional-changelog/issues/385)) ([cdef282](https://github.com/conventional-changelog/conventional-changelog/commit/cdef282))





<a name="2.0.0"></a>
# [2.0.0](https://github.com/conventional-changelog/conventional-changelog/compare/conventional-changelog-codemirror@1.0.0...conventional-changelog-codemirror@2.0.0) (2018-06-06)


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




<a name="1.0.0"></a>
# [1.0.0](https://github.com/conventional-changelog/conventional-changelog/compare/conventional-changelog-codemirror@0.3.8...conventional-changelog-codemirror@1.0.0) (2018-05-29)


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




<a name="0.3.8"></a>
## [0.3.8](https://github.com/conventional-changelog/conventional-changelog/compare/conventional-changelog-codemirror@0.3.7...conventional-changelog-codemirror@0.3.8) (2018-03-28)


### Bug Fixes

* revert previous change ([2f4530f](https://github.com/conventional-changelog/conventional-changelog/commit/2f4530f))




<a name="0.3.7"></a>
## [0.3.7](https://github.com/conventional-changelog/conventional-changelog/compare/conventional-changelog-codemirror@0.3.6...conventional-changelog-codemirror@0.3.7) (2018-03-27)




**Note:** Version bump only for package conventional-changelog-codemirror

<a name="0.3.6"></a>
## [0.3.6](https://github.com/conventional-changelog/conventional-changelog/compare/conventional-changelog-codemirror@0.3.5...conventional-changelog-codemirror@0.3.6) (2018-03-27)




**Note:** Version bump only for package conventional-changelog-codemirror

<a name="0.3.5"></a>
## [0.3.5](https://github.com/conventional-changelog/conventional-changelog/compare/conventional-changelog-codemirror@0.3.4...conventional-changelog-codemirror@0.3.5) (2018-03-22)




**Note:** Version bump only for package conventional-changelog-codemirror

<a name="0.3.4"></a>
## [0.3.4](https://github.com/conventional-changelog/conventional-changelog/compare/conventional-changelog-codemirror@0.3.3...conventional-changelog-codemirror@0.3.4) (2018-02-24)




**Note:** Version bump only for package conventional-changelog-codemirror

<a name="0.3.3"></a>
## [0.3.3](https://github.com/conventional-changelog/conventional-changelog/compare/conventional-changelog-codemirror@0.3.2...conventional-changelog-codemirror@0.3.3) (2018-02-20)




**Note:** Version bump only for package conventional-changelog-codemirror

<a name="0.3.2"></a>
## [0.3.2](https://github.com/stevemao/conventional-changelog-codemirror/compare/conventional-changelog-codemirror@0.3.1...conventional-changelog-codemirror@0.3.2) (2018-02-13)




**Note:** Version bump only for package conventional-changelog-codemirror

<a name="0.3.1"></a>
## [0.3.1](https://github.com/stevemao/conventional-changelog-codemirror/compare/conventional-changelog-codemirror@0.3.0...conventional-changelog-codemirror@0.3.1) (2018-02-13)




**Note:** Version bump only for package conventional-changelog-codemirror

<a name="0.3.0"></a>
# [0.3.0](https://github.com/stevemao/conventional-changelog-codemirror/compare/conventional-changelog-codemirror@0.2.1...conventional-changelog-codemirror@0.3.0) (2017-12-18)


### Features

* **preset:** add recommended-bump opts into presets ([60815b5](https://github.com/stevemao/conventional-changelog-codemirror/commit/60815b5)), closes [#241](https://github.com/stevemao/conventional-changelog-codemirror/issues/241)




<a name="0.2.1"></a>
## [0.2.1](https://github.com/stevemao/conventional-changelog-codemirror/compare/conventional-changelog-codemirror@0.2.0...conventional-changelog-codemirror@0.2.1) (2017-11-13)




**Note:** Version bump only for package conventional-changelog-codemirror

<a name="0.2.0"></a>
# 0.2.0 (2017-07-17)


### Features

* migrate repo to lerna mono-repo ([793e823](https://github.com/stevemao/conventional-changelog-codemirror/commit/793e823))
