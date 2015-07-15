<a name="0.1.0-beta.1"></a>
# 0.1.0-beta.1 (2015-07-15)


### Bug Fixes

* **stream:** is object mode if writerOpts.includeDetails is true ([38e3faa](https://github.com/ajoslin/conventional-changelog/commit/38e3faa))

### Features

* **owner:** add context.owner support ([87d60b4](https://github.com/ajoslin/conventional-changelog/commit/87d60b4))



<a name="0.1.0-alpha.3"></a>
# 0.1.0-alpha.3 (2015-07-06)


### Bug Fixes

* conventional-commits-writer -> conventional-changelog-writer ([aa6cbd6](https://github.com/ajoslin/conventional-changelog/commit/aa6cbd6))
* **hosts:** spelling mistake of host bitbucket ([1e30d54](https://github.com/ajoslin/conventional-changelog/commit/1e30d54)), closes [#68](https://github.com/ajoslin/conventional-changelog/issues/68) [#69](https://github.com/ajoslin/conventional-changelog/issues/69)

### Features

* **angular:** add new revert opts for the parser ([9e15f01](https://github.com/ajoslin/conventional-changelog/commit/9e15f01))
* **preset:** add jshint ([384e6ce](https://github.com/ajoslin/conventional-changelog/commit/384e6ce))



<a name="0.1.0-alpha.2"></a>
# 0.1.0-alpha.2 (2015-06-29)

Bump deps and fix https://github.com/ajoslin/conventional-changelog/issues/64



<a name="0.1.0-alpha.1"></a>
# 0.1.0-alpha.1 (2015-06-24)


### Bug Fixes

* **err:** emit error if there is any in gitRawCommits and conventionalCommitsParser ([00ac3c1](https://github.com/ajoslin/conventional-changelog/commit/00ac3c1))

### Features

* **cli:** first commit of cli ([d74b96b](https://github.com/ajoslin/conventional-changelog/commit/d74b96b)), closes [#31](https://github.com/ajoslin/conventional-changelog/issues/31)
* **issuePrefixes:** default for the hosts ([b1c3ee9](https://github.com/ajoslin/conventional-changelog/commit/b1c3ee9)), closes [#59](https://github.com/ajoslin/conventional-changelog/issues/59) [#60](https://github.com/ajoslin/conventional-changelog/issues/60)
* **rewrite:** rewrite this module ([7c48e0d](https://github.com/ajoslin/conventional-changelog/commit/7c48e0d)), closes [#50](https://github.com/ajoslin/conventional-changelog/issues/50) [#45](https://github.com/ajoslin/conventional-changelog/issues/45) [#40](https://github.com/ajoslin/conventional-changelog/issues/40) [#22](https://github.com/ajoslin/conventional-changelog/issues/22) [#13](https://github.com/ajoslin/conventional-changelog/issues/13) [#12](https://github.com/ajoslin/conventional-changelog/issues/12) [#54](https://github.com/ajoslin/conventional-changelog/issues/54) [#51](https://github.com/ajoslin/conventional-changelog/issues/51)


### BREAKING CHANGES

* This module is rewritten so API is changed and it is not backward compatible. Please check docs and all the submodules including git-raw-commits, conventional-commits-parser and conventional-changelog-writer for more information.



<a name"0.0.17"></a>
### 0.0.17 (2015-04-03)


#### Bump deps


<a name"0.0.16"></a>
### 0.0.16 (2015-03-19)


#### Bug Fixes

* **git:** generate the correct cmd of git log when there is no tags ([dcd7551f](https://github.com/ajoslin/conventional-changelog/commit/dcd7551f), closes [#47](https://github.com/ajoslin/conventional-changelog/issues/47), [#48](https://github.com/ajoslin/conventional-changelog/issues/48))


<a name"0.0.15"></a>
### 0.0.15 (2015-03-19)


#### Bug Fixes

* **log:** correct out put for `options.from` and `options.to` ([31ddb112](https://github.com/ajoslin/conventional-changelog/commit/31ddb112), closes [#47](https://github.com/ajoslin/conventional-changelog/issues/47))


<a name"0.0.14"></a>
### 0.0.14 (2015-03-14)


#### Bug Fixes

* **writeLog:** fix require statement for Writer ([a478f806](https://github.com/ajoslin/conventional-changelog/commit/a478f806))


<a name"0.0.13"></a>
### 0.0.13 (2015-03-13)


#### Bug Fixes

* **first commit:** add first commit to changelog ([386cd404](https://github.com/ajoslin/conventional-changelog/commit/386cd404))
* **git:** use --abbrev=0 to only get tag from same branch ([69cfb5c6](https://github.com/ajoslin/conventional-changelog/commit/69cfb5c6))
* **header:** fix no `<a>` if options.repository is provided ([7cb5cb56](https://github.com/ajoslin/conventional-changelog/commit/7cb5cb56), closes [#26](https://github.com/ajoslin/conventional-changelog/issues/26))
* **pkg:** handle the situation where package.json cannot be found ([518bc56e](https://github.com/ajoslin/conventional-changelog/commit/518bc56e))
* **version:** default version is read from package.json properly ([f684b9be](https://github.com/ajoslin/conventional-changelog/commit/f684b9be))


#### Features

* **defaults:** version and repository are read from package.json ([cb1feb7d](https://github.com/ajoslin/conventional-changelog/commit/cb1feb7d), closes [#38](https://github.com/ajoslin/conventional-changelog/issues/38))


### 0.0.11 "reorder" (2014-05-28)


#### Features

* **changelog:** add versionText, patchVersionText options ([9d8e0548](https://github.com/ajoslin/conventional-changelog/commit/9d8e05480771f881c33e535f922401637f11861c))


#### Breaking Changes

* 
Removed versionLink and patchVersionLink options, and went back to the
default title output from 0.0.9.

If you wish to have a link to your version, simply customize the versionText
and patchVersionText options.

 ([9d8e0548](https://github.com/ajoslin/conventional-changelog/commit/9d8e05480771f881c33e535f922401637f11861c))


### 0.0.10 "revise" (2014-05-28)


#### Bug Fixes

* **changelog:** put commit range into quotes so it can fetch commits with special characters ([76e2f185](https://github.com/ajoslin/conventional-changelog/commit/76e2f185b6542e7fe731c4666323fac68b9e2202), closes [#10](https://github.com/ajoslin/conventional-changelog/issues/10))


#### Features

* **changelog:** add support for scope with spaces ([b5e43b75](https://github.com/ajoslin/conventional-changelog/commit/b5e43b75c6caabc357e4bce0eb64316fbe153ecf), closes [#9](https://github.com/ajoslin/conventional-changelog/issues/9))
* **git:** allow period-separated closing and lowercase closing ([6835af55](https://github.com/ajoslin/conventional-changelog/commit/6835af55d57b62ff6dcebf624f3c6108cbc36b8e))
* **writer:** add tag hyperlink support ([9640cc27](https://github.com/ajoslin/conventional-changelog/commit/9640cc279ca9c513b1378eb55b5a7d576fd78bf5))


<a name="0.0.9"></a>
### 0.0.9 "change" (2014-05-06)


#### Bug Fixes

* **changelog:** make sure breaking changes are separated by two newlines ([85152160](https://github.com/ajoslin/conventional-changelog/commit/8515216093eaa7f997dc506675d729a0e41578d6))


#### Features

* **changelog:** also add `Resolves #xx` to closes section ([06ff3ea9](https://github.com/ajoslin/conventional-changelog/commit/06ff3ea9b0c8baf2fae6167a99b6826a44a0c768))


<a name="0.0.8"></a>
### 0.0.8 "refine" (2014-04-10)


#### Features

* **changelog:** change options.codename to options.subtitle ([a00fea52](https://github.com/ajoslin/conventional-changelog/commit/a00fea521667533809419af6a66b20ae4ce96e3b))


<a name="0.0.7"></a>
### 0.0.7 "delta" (2014-04-10)


#### Features

* **changelog:** add options.codename ([01f40cb6](https://github.com/ajoslin/conventional-changelog/commit/01f40cb6efe2180ede9c1e520da76877eb895759))


<a name="0.0.6"></a>
### 0.0.6 (2014-01-23)

#### Bug Fixes

* **git:** sort tags correctly ([7318bb05](https://github.com/ajoslin/conventional-changelog/commit/7318bb05d335bfa6886e816bec4fc57cd395c2c6))

<a name="0.0.5"></a>
### 0.0.5 (2014-01-23)

#### Miscellaneous

* More specific errors given through done callback
* Improved logging

<a name="0.0.4"></a>
### 0.0.4 (2014-01-04)

#### Bug Fixes

* **version:** do not try to figure out version ([5c99b7279b97352a93eca0ee37f198783d64f423](https://github.com/ajoslin/conventional-changelog/commit/5c99b7279b97352a93eca0ee37f198783d64f423))

<a name="0.0.2"></a>
### 0.0.2 (2014-01-04)

#### Features

* create conventional-changelog module ([dd1959d7b2c18846b12b088b47345a2a171c1309](https://github.com/ajoslin/conventional-changelog/commit/dd1959d7b2c18846b12b088b47345a2a171c1309))

