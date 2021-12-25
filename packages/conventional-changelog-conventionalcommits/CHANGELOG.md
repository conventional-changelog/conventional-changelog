# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [4.5.0](https://github.com/conventional-changelog/conventional-changelog/compare/conventional-changelog-conventionalcommits@4.4.0...conventional-changelog-conventionalcommits@4.5.0) (2020-11-05)


### Features

* **conventionalcommits:** allow matching scope ([#669](https://github.com/conventional-changelog/conventional-changelog/issues/669)) ([e01e027](https://github.com/conventional-changelog/conventional-changelog/commit/e01e027af60f5fa3e9146223b96797793930aeb4))





# [4.4.0](https://github.com/conventional-changelog/conventional-changelog/compare/conventional-changelog-conventionalcommits@4.3.1...conventional-changelog-conventionalcommits@4.4.0) (2020-08-12)


### Features

* **templates:** if hash is nullish, do not display in CHANGELOG ([#664](https://github.com/conventional-changelog/conventional-changelog/issues/664)) ([f10256c](https://github.com/conventional-changelog/conventional-changelog/commit/f10256c635687de0a85c4db2bf06292902924f77))





## [5.0.0](https://github.com/conventional-changelog/conventional-changelog/compare/conventional-changelog-conventionalcommits-v4.6.2...conventional-changelog-conventionalcommits-v5.0.0) (2021-12-25)


### ⚠ BREAKING CHANGES

* drop support for Node 8 (#599)
* drop support for Node 6 (#558)
* moved BREAKING CHANGES to top of template.
* if ! is in the commit header, it now indicates a BREAKING CHANGE, and the description is used as the body.
* a ! character at the end of type will now be omitted

### Features

* ! without BREAKING CHANGE should be treated as major ([#443](https://github.com/conventional-changelog/conventional-changelog/issues/443)) ([cf22d70](https://github.com/conventional-changelog/conventional-changelog/commit/cf22d70fbccaea0ab0130c011d7d203593f19fcb))
* add support for ! ([#441](https://github.com/conventional-changelog/conventional-changelog/issues/441)) ([0887940](https://github.com/conventional-changelog/conventional-changelog/commit/0887940e9103dca111e43337332913b37e1ee02a))
* add support for 'feature' as alias for 'feat' ([#582](https://github.com/conventional-changelog/conventional-changelog/issues/582)) ([94c40f7](https://github.com/conventional-changelog/conventional-changelog/commit/94c40f755e6c329311d89a47c634b91cf0276da3))
* BREAKING CHANGES are important and should be prioritized ([#464](https://github.com/conventional-changelog/conventional-changelog/issues/464)) ([f8adba2](https://github.com/conventional-changelog/conventional-changelog/commit/f8adba2f7dc84fd73adafb695371e0624b922792))
* conventionalcommits preset, preMajor config option ([#434](https://github.com/conventional-changelog/conventional-changelog/issues/434)) ([dde12fe](https://github.com/conventional-changelog/conventional-changelog/commit/dde12fe347d8c008c6ba3361e2f6357274537a77))
* **conventionalcommits:** allow matching scope ([#669](https://github.com/conventional-changelog/conventional-changelog/issues/669)) ([e01e027](https://github.com/conventional-changelog/conventional-changelog/commit/e01e027af60f5fa3e9146223b96797793930aeb4))
* **conventionalcommits:** include Release-As commits in CHANGELOG ([#796](https://github.com/conventional-changelog/conventional-changelog/issues/796)) ([9a0b9a7](https://github.com/conventional-changelog/conventional-changelog/commit/9a0b9a7f7ba5edd68b3476de706672d82e42b9e0))
* creating highly configurable preset, based on conventionalcommits.org ([#421](https://github.com/conventional-changelog/conventional-changelog/issues/421)) ([f2fb240](https://github.com/conventional-changelog/conventional-changelog/commit/f2fb240391e10c79756a590eb6aea1e235ccb0a2))
* **preset, conventionalcommits:** add handling of issue prefixes ([#498](https://github.com/conventional-changelog/conventional-changelog/issues/498)) ([85c17bb](https://github.com/conventional-changelog/conventional-changelog/commit/85c17bb9b08329b1f7f4822429f43836e7d8f7c4))
* sort sections of CHANGELOG based on priority ([#513](https://github.com/conventional-changelog/conventional-changelog/issues/513)) ([a3acc32](https://github.com/conventional-changelog/conventional-changelog/commit/a3acc3222135b17af0ee9785605d21b104ed0aef))
* **templates:** if hash is nullish, do not display in CHANGELOG ([#664](https://github.com/conventional-changelog/conventional-changelog/issues/664)) ([f10256c](https://github.com/conventional-changelog/conventional-changelog/commit/f10256c635687de0a85c4db2bf06292902924f77))


### Bug Fixes

* add add-bang-notes to files list ([7e4e4d2](https://github.com/conventional-changelog/conventional-changelog/commit/7e4e4d2ef38537f55926aa1d91eb482d574609c1))
* address discrepancies between cc preset and spec ([#429](https://github.com/conventional-changelog/conventional-changelog/issues/429)) ([18f71d2](https://github.com/conventional-changelog/conventional-changelog/commit/18f71d228c9676af13b736cb46614f23b66e796e))
* adhere to config spec ([#432](https://github.com/conventional-changelog/conventional-changelog/issues/432)) ([4eb1f55](https://github.com/conventional-changelog/conventional-changelog/commit/4eb1f558d6b855e0caf66cc294407e6ab2527d75))
* **conventional-commits-parser:** address CVE-2021-23425 ([#841](https://github.com/conventional-changelog/conventional-changelog/issues/841)) ([02b3d53](https://github.com/conventional-changelog/conventional-changelog/commit/02b3d53a0c142f0c28ee7d190d210c76a62887c2))
* **deps:** update dependency compare-func to v2 ([#647](https://github.com/conventional-changelog/conventional-changelog/issues/647)) ([de4f630](https://github.com/conventional-changelog/conventional-changelog/commit/de4f6309403ca0d46b7c6235052f4dca61ea15bc))
* **deps:** update lodash to fix security issues ([#535](https://github.com/conventional-changelog/conventional-changelog/issues/535)) ([ac43f51](https://github.com/conventional-changelog/conventional-changelog/commit/ac43f51de1f3b597c32f7f8442917a2d06199018))
* **docs:** template examples ([#866](https://github.com/conventional-changelog/conventional-changelog/issues/866)) ([5917ad2](https://github.com/conventional-changelog/conventional-changelog/commit/5917ad2bd95a83c2a047b2f5692c8e8e442a23f5))
* don't require 'host' and 'repository' when deciding whether to render URLs ([#447](https://github.com/conventional-changelog/conventional-changelog/issues/447)) ([83dff7a](https://github.com/conventional-changelog/conventional-changelog/commit/83dff7aff782a2a24685f1a0b9c42ffb98ec6a3e))
* don't use multiple H1 tags ([#440](https://github.com/conventional-changelog/conventional-changelog/issues/440)) ([3d79263](https://github.com/conventional-changelog/conventional-changelog/commit/3d792639815e4c4ae7758e0e84ba72a9cb535f37))
* Downgrade node 10.x dependency to 6.9.0 dependency ([#437](https://github.com/conventional-changelog/conventional-changelog/issues/437)) ([ded5a30](https://github.com/conventional-changelog/conventional-changelog/commit/ded5a304cd0b53100f94fff6b225c7178f5eb449))
* if ! and BREAKING CHANGE were used, notes would populate twice ([#446](https://github.com/conventional-changelog/conventional-changelog/issues/446)) ([63d8cbe](https://github.com/conventional-changelog/conventional-changelog/commit/63d8cbedd24d957c759865211dd2341fd4a3e1f2))
* pass config to parserOpts and writerOpts ([73c7a1b](https://github.com/conventional-changelog/conventional-changelog/commit/73c7a1b92c2a47c498f42972acbffa156172a341))
* **preset, conventionalcommits:** Ensure proper substitutions for the conventionalcommit preset by using commit context for values where possible. ([#463](https://github.com/conventional-changelog/conventional-changelog/issues/463)) ([0b7ed0b](https://github.com/conventional-changelog/conventional-changelog/commit/0b7ed0b73b6728173c8df744abdfa4466a7f0cc5))
* **preset, conventionalcommits:** fix handling conventionalcommits preset without config object ([c0566ce](https://github.com/conventional-changelog/conventional-changelog/commit/c0566ce05c03c6274d6efcb01a2eff42e660a9bc)), closes [#512](https://github.com/conventional-changelog/conventional-changelog/issues/512)
* **preset, conventionalcommits:** pass issuePrefixes to parser ([#510](https://github.com/conventional-changelog/conventional-changelog/issues/510)) ([958d243](https://github.com/conventional-changelog/conventional-changelog/commit/958d243c3f1702eea91ddca40c1550d12fd81aa0))
* Recommend a patch bump for features when preMajor is enabled ([#452](https://github.com/conventional-changelog/conventional-changelog/issues/452)) ([3d0a520](https://github.com/conventional-changelog/conventional-changelog/commit/3d0a52036a82ee11415ca777c005d84fa4169d2f))
* revertPattern match default git revert format ([#545](https://github.com/conventional-changelog/conventional-changelog/issues/545)) ([fe449f8](https://github.com/conventional-changelog/conventional-changelog/commit/fe449f899567574a36d1819b313e2caa899052ff))
* use full commit hash in commit link ([7a60dec](https://github.com/conventional-changelog/conventional-changelog/commit/7a60decb6979efb5026e399e962313e69b005b22)), closes [#476](https://github.com/conventional-changelog/conventional-changelog/issues/476)


### Code Refactoring

* drop support for Node 6 ([#558](https://github.com/conventional-changelog/conventional-changelog/issues/558)) ([fd80738](https://github.com/conventional-changelog/conventional-changelog/commit/fd80738a46760753a61cb6929bd899ada1ab1e04))


### Miscellaneous Chores

* drop support for Node 8 ([#599](https://github.com/conventional-changelog/conventional-changelog/issues/599)) ([b9f5057](https://github.com/conventional-changelog/conventional-changelog/commit/b9f50573f292ea29ff51627646ca7825bf182d52))

### [4.6.2](https://github.com/conventional-changelog/conventional-changelog/compare/conventional-changelog-conventionalcommits-v4.6.1...conventional-changelog-conventionalcommits-v4.6.2) (2021-12-24)


### Bug Fixes

* **docs:** template examples ([#866](https://github.com/conventional-changelog/conventional-changelog/issues/866)) ([5917ad2](https://github.com/conventional-changelog/conventional-changelog/commit/5917ad2bd95a83c2a047b2f5692c8e8e442a23f5))

### [4.6.1](https://www.github.com/conventional-changelog/conventional-changelog/compare/conventional-changelog-conventionalcommits-v4.6.0...conventional-changelog-conventionalcommits-v4.6.1) (2021-09-09)


### Bug Fixes

* **conventional-commits-parser:** address CVE-2021-23425 ([#841](https://www.github.com/conventional-changelog/conventional-changelog/issues/841)) ([02b3d53](https://www.github.com/conventional-changelog/conventional-changelog/commit/02b3d53a0c142f0c28ee7d190d210c76a62887c2))

## [4.6.0](https://www.github.com/conventional-changelog/conventional-changelog/compare/conventional-changelog-conventionalcommits-vconventional-changelog-conventionalcommits@4.5.0...conventional-changelog-conventionalcommits-v4.6.0) (2021-04-30)


### Features

* **conventionalcommits:** include Release-As commits in CHANGELOG ([#796](https://www.github.com/conventional-changelog/conventional-changelog/issues/796)) ([9a0b9a7](https://www.github.com/conventional-changelog/conventional-changelog/commit/9a0b9a7f7ba5edd68b3476de706672d82e42b9e0))

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
