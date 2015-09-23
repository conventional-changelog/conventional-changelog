<a name="0.4.0"></a>
# [0.4.0](https://github.com/stevemao/conventional-changelog-writer/compare/v0.3.2...v0.4.0) (2015-09-23)


### Bug Fixes

* **cli:** require file with absolute path ([e9d9702](https://github.com/stevemao/conventional-changelog-writer/commit/e9d9702)), closes [#13](https://github.com/stevemao/conventional-changelog-writer/issues/13)
* **notesSort:** defaults to sort on `text` ([6d3d564](https://github.com/stevemao/conventional-changelog-writer/commit/6d3d564))

### Features

* **notes:** attach the commit to the note ([2977336](https://github.com/stevemao/conventional-changelog-writer/commit/2977336)), closes [#12](https://github.com/stevemao/conventional-changelog-writer/issues/12)


### BREAKING CHANGES

* `notes` in `noteGroups` is not an array of simple string any more but object. You must use `note.text` to access the equivalent of previous `note`.



