# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

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
