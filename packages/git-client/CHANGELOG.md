# Changelog

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
