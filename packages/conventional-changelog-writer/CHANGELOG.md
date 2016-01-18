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



