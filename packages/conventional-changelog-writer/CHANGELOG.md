<a name="1.4.1"></a>
## [1.4.1](https://github.com/conventional-changelog/conventional-changelog-writer/compare/v1.4.0...v1.4.1) (2016-05-10)


### Bug Fixes

* **context:** auto link references if repoUrl([30bb234](https://github.com/conventional-changelog/conventional-changelog-writer/commit/30bb234))



<a name="1.4.0"></a>
# [1.4.0](https://github.com/conventional-changelog/conventional-changelog-writer/compare/v1.3.0...v1.4.0) (2016-05-10)


### Features

* **context:** fallback to repoUrl([e504682](https://github.com/conventional-changelog/conventional-changelog-writer/commit/e504682))



<a name="1.3.0"></a>
# [1.3.0](https://github.com/conventional-changelog/conventional-changelog-writer/compare/v1.2.1...v1.3.0) (2016-05-08)


### Features

* **debug:** convient function for debugging([3b6233f](https://github.com/conventional-changelog/conventional-changelog-writer/commit/3b6233f))



<a name="1.2.1"></a>
## [1.2.1](https://github.com/conventional-changelog/conventional-changelog-writer/compare/v1.2.0...v1.2.1) (2016-04-19)


### Bug Fixes

* **templates:** generate correct url if only host exists ([bda0328](https://github.com/conventional-changelog/conventional-changelog-writer/commit/bda0328))



<a name="1.2.0"></a>
# [1.2.0](https://github.com/conventional-changelog/conventional-changelog-writer/compare/v1.1.1...v1.2.0) (2016-04-17)


### Features

* **transform:** also pass context as an arg ([9bd984c](https://github.com/conventional-changelog/conventional-changelog-writer/commit/9bd984c))



<a name="1.1.1"></a>
## [1.1.1](https://github.com/stevemao/conventional-changelog-writer/compare/v1.1.0...v1.1.1) (2016-02-29)




<a name="1.1.0"></a>
# [1.1.0](https://github.com/stevemao/conventional-changelog-writer/compare/v1.0.3...v1.1.0) (2016-02-08)


### Features

* **generate:** originalCommits as last argument ([186bfb9](https://github.com/stevemao/conventional-changelog-writer/commit/186bfb9))



<a name="1.0.3"></a>
## [1.0.3](https://github.com/stevemao/conventional-changelog-writer/compare/v1.0.2...v1.0.3) (2016-02-06)


### Bug Fixes

* **firstRelease:** correct logic ([43552a2](https://github.com/stevemao/conventional-changelog-writer/commit/43552a2))



<a name="1.0.2"></a>
## [1.0.2](https://github.com/stevemao/conventional-changelog-writer/compare/v1.0.1...v1.0.2) (2016-02-06)


### Bug Fixes

* **doFlush:** one it is the only potential release ([cc3b5db](https://github.com/stevemao/conventional-changelog-writer/commit/cc3b5db))



<a name="1.0.1"></a>
## [1.0.1](https://github.com/stevemao/conventional-changelog-writer/compare/v1.0.0...v1.0.1) (2016-02-06)


### Bug Fixes

* **doFlush:** correct logic ([54d96cc](https://github.com/stevemao/conventional-changelog-writer/commit/54d96cc)), closes [#19](https://github.com/stevemao/conventional-changelog-writer/issues/19)



<a name="1.0.0"></a>
# [1.0.0](https://github.com/stevemao/conventional-changelog-writer/compare/v0.5.1...v1.0.0) (2016-02-05)




<a name="0.5.1"></a>
## [0.5.1](https://github.com/stevemao/conventional-changelog-writer/compare/v0.5.0...v0.5.1) (2016-02-03)


### Bug Fixes

* **context.version:** only valid a semver can decide `context.isPatch` ([59ed325](https://github.com/stevemao/conventional-changelog-writer/commit/59ed325))



<a name="0.5.0"></a>
# [0.5.0](https://github.com/stevemao/conventional-changelog-writer/compare/v0.4.2...v0.5.0) (2016-02-02)


### Features

* **flush:** add `options.doFlush` to make it possible not to flush ([7850589](https://github.com/stevemao/conventional-changelog-writer/commit/7850589))



<a name="0.4.2"></a>
## [0.4.2](https://github.com/stevemao/conventional-changelog-writer/compare/v0.4.1...v0.4.2) (2016-01-18)


### Features

* **generateOn:** also pass commits, context and options to the function ([3146f66](https://github.com/stevemao/conventional-changelog-writer/commit/3146f66)), closes [ajoslin/conventional-changelog#135](https://github.com/ajoslin/conventional-changelog/issues/135)



<a name="0.4.1"></a>
## [0.4.1](https://github.com/stevemao/conventional-changelog-writer/compare/v0.4.0...v0.4.1) (2015-09-30)


### Bug Fixes

* **template:** default commit template should handle unkown host ([ef62bfd](https://github.com/stevemao/conventional-changelog-writer/commit/ef62bfd))

### Features

* **context:** linkReferences has nothing to do with context.host ([f5883a6](https://github.com/stevemao/conventional-changelog-writer/commit/f5883a6))


### BREAKING CHANGES

* `context.host` cannot change the default of `context.linkReferences` because if the host is unknown, `context.host` is `undefined` and all links will just use `context.repository`.



<a name="0.4.0"></a>
# [0.4.0](https://github.com/stevemao/conventional-changelog-writer/compare/v0.3.2...v0.4.0) (2015-09-23)


### Bug Fixes

* **cli:** require file with absolute path ([e9d9702](https://github.com/stevemao/conventional-changelog-writer/commit/e9d9702)), closes [#13](https://github.com/stevemao/conventional-changelog-writer/issues/13)
* **notesSort:** defaults to sort on `text` ([6d3d564](https://github.com/stevemao/conventional-changelog-writer/commit/6d3d564))

### Features

* **notes:** attach the commit to the note ([2977336](https://github.com/stevemao/conventional-changelog-writer/commit/2977336)), closes [#12](https://github.com/stevemao/conventional-changelog-writer/issues/12)


### BREAKING CHANGES

* `notes` in `noteGroups` is not an array of simple string any more but object. You must use `note.text` to access the equivalent of previous `note`.



