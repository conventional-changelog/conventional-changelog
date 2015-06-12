#  [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url] [![Coverage Status][coveralls-image]][coveralls-url]

> Generate a changelog from git metadata


## Why

- Used by AngularJS and related projects.
- Everything internally or externally is Pluggable.
- High performant. It doesn't spawn any extra child process to fetch data.
- Fully configurable. There are several presets that you can use if you just want to use the same conventions. But it is also possible to configure if you want to go down to the nth degree.
- Task runner integrations.
- Actively maintained.


## Install

```sh
$ npm install conventional-changelog
```

Adapted from code originally written by @vojtajina and @btford in [grunt-conventional-changelog](https://github.com/btford/grunt-conventional-changelog).


## Example output

- https://github.com/ajoslin/conventional-changelog/blob/master/CHANGELOG.md
- https://github.com/karma-runner/karma/blob/master/CHANGELOG.md


## Usage

```js
var conventionalChangelog = require('conventional-changelog');

conventionalChangelog({
  preset: 'angular'
})
  .pipe(process.stdout);
```


## API

### conventionalChangelog([options, [context, [gitRawCommitsOpts, [parserOpts, [writerOpts]]]]])

Returns a readable stream.

#### options

##### preset

Type: `string` Possible values: `'angular'`

A set of preset options of a popular project.

##### pkg

Type: `string` Default: `'package.json'`

The location of your "package.json".

##### append

Type: `boolean` Default: `false`

Should the log be appended.

##### allBlocks

Type: `boolean` Default: `false`

Set to `true` if you want to generate all blocks of the log. `false` if you just want to generate the current one.

##### warn

Type: `function` Default: `function() {}`

A warn function. EG: `grunt.verbose.writeln`

##### transform

Type: `object` Default: `through.obj()`

A transform stream that applies after the parser and before the writer.

#### context

See the [conventional-commits-writer](https://github.com/stevemao/conventional-commits-writer) docs.

#### gitRawCommitsOpts

See the [git-raw-commits](https://github.com/stevemao/git-raw-commits) docs.

#### parserOpts

See the [conventional-commits-parser](https://github.com/stevemao/conventional-commits-parser) docs.

#### writerOpts

See the [conventional-commits-writer](https://github.com/stevemao/conventional-commits-writer) docs.


### CLI

```sh
$ npm install -g conventional-changelog
```

```sh
$ conventional-changelog --help

  Generate a changelog from git metadata

  Usage
    conventional-changelog

  Example
    conventional-changelog -i CHANGELOG.md --overwrite

  Options
    -i, --infile              Read the CHANGELOG from this file.
    -o, --outfile             Write the CHANGELOG to this file. If unspecified, it prints to stdout
    -w, --overwrite           Overwrite the infile
    -p, --preset              Name of the preset you want to use
    -k, --pkg                 A filepath of where your package.json is located
    -a, --append              Should the generated block be appended
    -b, --all-blocks          Generate all blocks
    -v, --verbose             Verbose output
    -c, --context             A filepath of a javascript that is used to define template variables
    --git-raw-commits-opts    A filepath of a javascript that is used to define git-raw-commits options
    --parser-opts             A filepath of a javascript that is used to define conventional-commits-parser options
    --writer-opts             A filepath of a javascript that is used to define conventional-commits-writer options
```


## License

BSD


[npm-image]: https://badge.fury.io/js/conventional-changelog.svg
[npm-url]: https://npmjs.org/package/conventional-changelog
[travis-image]: https://travis-ci.org/ajoslin/conventional-changelog.svg?branch=master
[travis-url]: https://travis-ci.org/ajoslin/conventional-changelog
[daviddm-image]: https://david-dm.org/ajoslin/conventional-changelog.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/ajoslin/conventional-changelog
[coveralls-image]: https://coveralls.io/repos/ajoslin/conventional-changelog/badge.svg
[coveralls-url]: https://coveralls.io/r/ajoslin/conventional-changelog
