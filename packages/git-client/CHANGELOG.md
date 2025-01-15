# Changelog

## [2.0.0](https://github.com/conventional-changelog/conventional-changelog/compare/git-client-v1.0.1...git-client-v2.0.0) (2025-01-15)


### ⚠ BREAKING CHANGES

* **git-client:** ability to pass additional git params is removed

### Bug Fixes

* **conventional-changelog-writer,git-client:** move `@types/semver` to dev dependencies ([#1268](https://github.com/conventional-changelog/conventional-changelog/issues/1268)) ([4ca2b86](https://github.com/conventional-changelog/conventional-changelog/commit/4ca2b86ebe22f312ebc492eead0ad859e519f43b))
* **git-client:** ability to pass additional git params is removed by security reasons ([#1325](https://github.com/conventional-changelog/conventional-changelog/issues/1325)) ([d95c9ff](https://github.com/conventional-changelog/conventional-changelog/commit/d95c9ffac05af58228bd89fa0ba37ad65741c6a2))
* **git-client:** close the generator used by getLastSemverTag ([#1281](https://github.com/conventional-changelog/conventional-changelog/issues/1281)) ([a1764d6](https://github.com/conventional-changelog/conventional-changelog/commit/a1764d61ef85244563b3a46215007fdae8083f8b))
* **git-client:** match semver better in unstable tag regex ([#1277](https://github.com/conventional-changelog/conventional-changelog/issues/1277)) ([9f0895b](https://github.com/conventional-changelog/conventional-changelog/commit/9f0895bed4c4eab6d3788f9843ed087ceb219adf))

## [1.0.1](https://github.com/conventional-changelog/conventional-changelog/compare/git-client-v1.0.0...git-client-v1.0.1) (2024-05-06)


### Bug Fixes

* **git-client:** trigger update peer dependencies versions ([79eda8b](https://github.com/conventional-changelog/conventional-changelog/commit/79eda8b2ef17a11b8d6a44a587cdbb27e273e479))

## 1.0.0 (2024-04-26)


### ⚠ BREAKING CHANGES

* Node >= 18 is required
* **conventional-recommended-bump:** new `Bumper` exported class ([#1218](https://github.com/conventional-changelog/conventional-changelog/issues/1218))
* **git-raw-commits:** refactored to use @conventional-changelog/git-client ([#1199](https://github.com/conventional-changelog/conventional-changelog/issues/1199))
* **git-semver-tags,conventional-recommended-bump:** gitSemverTags and conventionalRecommendedBump now return promises
* **standard-changelog:** createIfMissing method now returns a promise

### Features

* **conventional-recommended-bump:** new `Bumper` exported class ([#1218](https://github.com/conventional-changelog/conventional-changelog/issues/1218)) ([0ddc8cd](https://github.com/conventional-changelog/conventional-changelog/commit/0ddc8cdceb91f838f9f73e0bff8e3f140176a13a))
* drop node 16 support ([#1226](https://github.com/conventional-changelog/conventional-changelog/issues/1226)) ([ec69cfd](https://github.com/conventional-changelog/conventional-changelog/commit/ec69cfdf0040f73ec0eadc4779c37874e71f3dff))
* **git-client:** GitClient#getLastTag and ConventionalGitClient#getLastSemverTag methods are added. GitClient#getRawCommits ignore param is added. ([#1217](https://github.com/conventional-changelog/conventional-changelog/issues/1217)) ([53254b3](https://github.com/conventional-changelog/conventional-changelog/commit/53254b3e14258e1f6779a2b4462199dda630f96e))
* **git-raw-commits:** refactored to use @conventional-changelog/git-client ([#1199](https://github.com/conventional-changelog/conventional-changelog/issues/1199)) ([ba03ffc](https://github.com/conventional-changelog/conventional-changelog/commit/ba03ffc3c05e794db48b18a508f296d4d662a5d9))
* **git-semver-tags,conventional-recommended-bump:** refactoring to use promises instead of callbacks ([#1112](https://github.com/conventional-changelog/conventional-changelog/issues/1112)) ([1697ecd](https://github.com/conventional-changelog/conventional-changelog/commit/1697ecdf4c2329732e612cc1bd3323e84f046f3a))
* **standard-changelog:** use promises ([#1111](https://github.com/conventional-changelog/conventional-changelog/issues/1111)) ([5015ab7](https://github.com/conventional-changelog/conventional-changelog/commit/5015ab71de7a3db9cbcbbabd0cc25502f1cd0109))
