# conventional-changelog

[![ESM-only package][package]][package-url]
[![NPM version][npm]][npm-url]
[![Node version][node]][node-url]
[![Dependencies status][deps]][deps-url]
[![Install size][size]][size-url]
[![Build status][build]][build-url]
[![Coverage status][coverage]][coverage-url]

[package]: https://img.shields.io/badge/package-ESM--only-ffe536.svg
[package-url]: https://nodejs.org/api/esm.html

[npm]: https://img.shields.io/npm/v/conventional-changelog.svg
[npm-url]: https://npmjs.com/package/conventional-changelog

[node]: https://img.shields.io/node/v/conventional-changelog.svg
[node-url]: https://nodejs.org

[deps]: https://img.shields.io/librariesio/release/npm/conventional-changelog
[deps-url]: https://libraries.io/npm/conventional-changelog/tree

[size]: https://packagephobia.com/badge?p=conventional-changelog
[size-url]: https://packagephobia.com/result?p=conventional-changelog

[build]: https://img.shields.io/github/actions/workflow/status/conventional-changelog/conventional-changelog/tests.yaml?branch=master
[build-url]: https://github.com/conventional-changelog/conventional-changelog/actions

[coverage]: https://coveralls.io/repos/github/conventional-changelog/conventional-changelog/badge.svg?branch=master
[coverage-url]: https://coveralls.io/github/conventional-changelog/conventional-changelog?branch=master

Generate a changelog from git metadata.

*[Changelog?](https://speakerdeck.com/stevemao/compose-a-changelog)*

> [!NOTE]
> You don't have to use the angular commit convention. For the best result of the tool to tokenize your commit and produce flexible output, it's recommended to use a commit convention.

<hr />
<a href="#install">Install</a>
<span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
<a href="#usage">Usage</a>
<span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
<a href="#recommended-workflow">Recommended workflow</a>
<span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
<a href="#why">Why</a>
<span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
<a href="#presets">Presets</a>
<span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
<a href="#js-api">JS API</a>
<br />
<hr />

## Install

```bash
# pnpm
pnpm add conventional-changelog
# yarn
yarn add conventional-changelog
# npm
npm i conventional-changelog
```

## Usage

```sh
conventional-changelog -p angular
```

This will *not* overwrite any previous changelogs. The above generates a changelog based on commits since the last semver tag that matches the pattern of "Feature", "Fix", "Performance Improvement" or "Breaking Changes".

If this is your first time using this tool and you want to generate all previous changelogs, you could do

```sh
conventional-changelog -p angular -r 0
```

This *will* overwrite any previous changelogs if they exist.

All available command line parameters can be listed using CLI: `conventional-changelog --help`.

> [!TIP]
> You can alias your command or add it to your package.json. EG: `"changelog": "conventional-changelog -p angular -r 0"`.

## Recommended workflow

1. Make changes
2. Commit those changes
3. Make sure Travis turns green
4. Bump version in `package.json`
5. `conventional-changelog`
6. Commit `package.json` and `CHANGELOG.md` files
7. Tag
8. Push

The reason why you should commit and tag after `conventional-changelog` is that the CHANGELOG should be included in the new release, hence `commits.from` defaults to the latest semver tag.

### With `npm version`

Using the npm scripts to our advantage with the following hooks:

```json
{
  "scripts": {
    "version": "conventional-changelog -p angular && git add CHANGELOG.md"
  }
}
```

You could follow the following workflow

1. Make changes
2. Commit those changes
3. Pull all the tags
4. Run the [`npm version [patch|minor|major]`](https://docs.npmjs.com/cli/version) command
5. Push

You could optionally add a `preversion` script to package your project or running a full suit of test.
And a `postversion` script to clean your system and push your release and tags.

By adding a `.npmrc` you could also automate your commit message and set your tag prefix as such:

```
tag-version-prefix=""
message="chore(release): %s :tada:"
```

## Why

- Easy fully automate changelog generation. You could still add more points on top of it.
- Ignoring reverted commits, templating with [handlebars.js](https://github.com/handlebars-lang/handlebars.js) and links to references, etc.
- Intelligently setup defaults but yet fully configurable with presets of [popular projects](#presets).
- Everything internally or externally is pluggable.
- A lot of tests and actively maintained.

## Presets

- [angular](https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-angular)
- [atom](https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-atom)
- [codemirror](https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-codemirror)
- [conventionalcommits](https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-conventionalcommits)
- [ember](https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-ember)
- [eslint](https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-eslint)
- [express](https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-express)
- [jquery](https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-jquery)
- [jshint](https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-jshint)

## JS API

```js
import { ConventionalChangelog } from 'conventional-changelog'

const generator = new ConventionalChangelog()
  .readPackage()
  .loadPreset('angular')

generator
  .writeStream()
  .pipe(process.stdout)

// or

for await (const chunk of generator.write()) {
  console.log(chunk)
}
```

### `new ConventionalChangelog(cwdOrGitClient: string | ConventionalGitClient = process.cwd())`

Create a new instance of conventional-changelog generator. `cwdOrGitClient` is the current working directory or a `ConventionalGitClient` instance.

#### `generator.loadPreset(preset: PresetParams): this`

Load and set necessary params from a preset.

#### `generator.config(config: Preset | Promise<Preset>): this`

Set the config directly.

#### `generator.readPackage(transform?: PackageTransform): this`

Find `package.json` up the directory tree and read it. Optionally transform the package data.

#### `generator.readPackage(path: string, transform?: PackageTransform): this`

Read a `package.json` file from a specific path. Optionally transform the package data.

#### `generator.package(pkg: Record<string, unknown>): this`

Set the package data directly.

#### `generator.readRepository(): this`

Read and parse the repository URL from current git repository.

#### `generator.repository(infoOrGitUrl: string | Partial<HostedGitInfo>): this`

Set the repository info directly.

#### `generator.options(options: Options): this`

Set conventional-changelog options.

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| reset | `boolean` | `false` | Whether to reset the changelog or not. |
| append | `boolean` | `false`  | Should the log be appended to existing data. |
| releaseCount | `number` | 1 | How many releases of changelog you want to generate. It counts from the upcoming release. Useful when you forgot to generate any previous changelog. Set to `0` to regenerate all. |
| outputUnreleased | `boolean` | `true` if a different version than last release is given. Otherwise `false` | If this value is `true` and `context.version` equals last release then `context.version` will be changed to `'Unreleased'`. |
| transformCommit | `(commit: Commit, params: Params) => Partial<Commit> \| Promise<Partial<Commit> \| null> \| null` |  | A transform function that applies after the parser and before the writer. |
| warn | `function` |  | Logger for warnings |
| debug | `function` |  | Logger for debug messages |
| fromatDate | `(date: Date) => string` |  | Custom date formatter function. |

#### `generator.context(context: Context): this`

Set the [writer context](https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-writer#context).

#### `generator.tags(params: GetSemverTagsParams): this`

Set params to get semver tags.

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| prefix | `string \| RegExp` |  | Specify a prefix for the git tag that will be taken into account during the comparison. |
| skipUnstable | `boolean` | `false` | If set, unstable release tags will be skipped, e.g. x.x.x-rc. |
| clean | `boolean` | `false` | Clean version from prefix and trash. |

If you want to take package-prefixed tags, for example lerna-style tags, you should use `packagePrefix` utility function:

```js
import {
  ConventionalChangelog,
  packagePrefix
} from 'conventional-changelog'

const generator = new ConventionalChangelog()
  .readPackage()
  .loadPreset('angular')
  .tags({
    prefix: packagePrefix('foo-package')
  })
```

#### `generator.commits(params: GetCommitsParams, parserOptions?: ParserStreamOptions): this`

Set params to get commits.

- [GetCommitsParams](https://github.com/conventional-changelog/conventional-changelog/blob/master/packages/git-client/src/types.ts#L1-L41)
- [ParserStreamOptions](https://github.com/conventional-changelog/conventional-changelog/blob/master/packages/conventional-commits-parser/src/types.ts#L1-L68)

#### `generator.writer(params: WriterOptions): this`

Set [writer options](https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-writer#options).

#### `generator.write(includeDetails?: boolean): AsyncGenerator<string | Details<Commit>, void>`

Generate changelog.

#### `generator.writeStream(includeDetails?: boolean): Readable`

Generate changelog stream.

## License

MIT
