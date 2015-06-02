#  [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url] [![Coverage Status][coveralls-image]][coveralls-url]

> Parse raw conventional commits


Adapted from code originally written by @ajoslin in [conventional-changelog](https://github.com/ajoslin/conventional-changelog).


## Conventional Commit Message Format

A minimum input should contain the raw message.

Each commit message consists of a a **header**, a **body** (optional) and a **footer** (optional).

```
<header>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

### header

The header has a special format that includes a **type**, a **scope** (optional) and a **subject**

```
<type>(<scope>): <subject>
```

### footer

The footer should contain any information about **Important Notes** (optional) and is also the place to reference GitHub issues that this commit **references** (optional).

```
<important note>
<BLANK LINE>
<references>
```

This module will just parse the message itself. However, it is possible to include other fields such as hash, committer or date.

```
My commit message
-sideNotes-
It should warn the correct unfound file names.
Also it should continue if one file cannot be found.
Tests are added for these
```

Then `sideNotes` will be `It should warn the correct unfound file names.\nAlso it should continue if one file cannot be found.\nTests are added for these`. You can customize the `fieldPattern`.

[More details](CONVENTIONS.md)


## Install

```sh
$ npm install --save conventional-commits-parser
```


## Usage

```js
var conventionalCommitsParser = require('conventional-commits-parser');

conventionalCommitsParser(options);
```

It returns a transform stream and expects an upstream that looks something like this:

```
'feat(scope): broadcast $destroy event on scope destruction\nCloses #1'
'feat(ng-list): Allow custom separator\nbla bla bla\n\nBREAKING CHANGE: some breaking change\n'
```

Each chunk should be a commit. The downstream will look something like this:

```js
{ type: 'feat',
  scope: 'scope',
  subject: 'broadcast $destroy event on scope destruction',
  header: 'feat(scope): broadcast $destroy event on scope destruction',
  body: null,
  footer: 'Closes #1',
  notes: [],
  references: [ { action: 'Closes', repository: null, issue: '1', raw: '#1' } ] }
{ type: 'feat',
  scope: 'ng-list',
  subject: 'Allow custom separator',
  header: 'feat(ng-list): Allow custom separator',
  body: 'bla bla bla',
  footer: 'BREAKING CHANGE: some breaking change',
  notes: [ { title: 'BREAKING CHANGE', text: 'some breaking change' } ],
  references: [] }
```


## API

### conventionalCommitsParser([options])

Returns an transform stream. If there is any malformed commits it will be gracefully ignored (an empty data will be emitted so down stream can notice).

#### options

Type: `object`

##### headerPattern

Type: `regex` or `string` Default: `/^(\w*)(?:\(([\w\$\.\-\* ]*)\))?\: (.*)$/`

Used to match header pattern.

##### headerCorrespondence:

Type: `array` of `string` or `string` Default `['type', 'scope', 'subject']`

Used to define what capturing group of `headerPattern` captures what header part. The order of the array should correspond to the order of `headerPattern`'s capturing group. If the part is not captured it is `null`. If it's a `string` it will be converted to an `array` separated by a comma.

##### referenceKeywords

Type: `array` of `string` or `string` Default:
`[
  'close',
  'closes',
  'closed',
  'fix',
  'fixes',
  'fixed',
  'resolve',
  'resolves',
  'resolved'
]`

Keywords for references. This value is case **insensitive**. If it's a `string` it will be converted to an `array` separated by a comma.

##### noteKeywords

Type: `array` of `string` or `string` Default: `['BREAKING CHANGE']`

Keywords for important notes. If it's a `string` it will be converted to an `array` separated by a comma.

##### fieldPattern

Type: `regex` or `string` Default: `/^-(.*?)-$/`

Pattern to match other fields.

##### warn

Type: `function` or `boolean` Default: `function() {}`

What warn function to use. For example, `console.warn.bind(console)` or `grunt.log.writeln`. By default, it's a noop. If it is `true`, it will error if commit cannot be parsed (strict).


## CLI

You can use cli to practice writing commit messages or parse messages from files.

```sh
$ npm install --global conventional-commits-parser
```

If you run `conventional-commits-parser` without any arguments

```sh
$ conventional-commits-parser
```

You will enter an interactive shell. To show your parsed output enter "return" three times (or enter your specified separator).

```sh
> fix(title): a title is fixed


{"type":"fix","scope":"title","subject":"a title is fixed","header":"fix(title): a title is fixed\n","body":null,"footer":null,"notes":[],"references":[]}
```

You can also use cli to parse messages from files.

If you have log.txt

```text
feat(ngMessages): provide support for dynamic message resolution

Prior to this fix it was impossible to apply a binding to a the ngMessage directive to represent the name of the error.

BREAKING CHANGE: The `ngMessagesInclude` attribute is now its own directive and that must be placed as a **child** element within the element with the ngMessages directive.

Closes #10036
Closes #9338
```

And you run

```sh
$ conventional-commits-parser log.txt
# or
$ cat log.txt | conventional-commits-parser
```

An array of json will be printed to stdout.

```sh
[
{"type":"feat","scope":"ngMessages","subject":"provide support for dynamic message resolution","header":"feat(ngMessages): provide support for dynamic message resolution\n","body":"Prior to this fix it was impossible to apply a binding to a the ngMessage directive to represent the name of the error.\n","footer":"BREAKING CHANGE: The `ngMessagesInclude` attribute is now its own directive and that must be placed as a **child** element within the element with the ngMessages directive.\nCloses #10036\nCloses #9338\n","notes":[{"title":"BREAKING CHANGE","text":"The `ngMessagesInclude` attribute is now its own directive and that must be placed as a **child** element within the element with the ngMessages directive.\n"}],"references":[{"action":"Closes","repository":null,"issue":"10036","raw":"#10036"},{"action":"Closes","repository":null,"issue":"9338","raw":"#9338"}]}
]
```

Commits should be split by at least three newlines (`\n\n\n`) or you can specify a separator as the second argument.

Eg: in log2.txt

```text

docs(ngMessageExp): split ngMessage docs up to show its alias more clearly
===

fix($animate): applyStyles from options on leave

Closes #10068
```

And you run

```sh
$ conventional-commits-parser log2.txt '==='
```

```sh
[
{"type":"docs","scope":"ngMessageExp","subject":"split ngMessage docs up to show its alias more clearly","header":"docs(ngMessageExp): split ngMessage docs up to show its alias more clearly\n","body":null,"footer":null,"notes":[],"references":[]}
,
{"type":"fix","scope":"$animate","subject":"applyStyles from options on leave","header":"fix($animate): applyStyles from options on leave\n","body":null,"footer":"Closes #10068\n","notes":[],"references":[{"action":"Closes","repository":null,"issue":"10068","raw":"#10068"}]}
]
```

Will be printed out.

You can specify one or more files. The output array will be in order of the input file paths. If you specify more than one separator, the last one will be used.


## License

MIT © [Steve Mao](https://github.com/stevemao)


[npm-image]: https://badge.fury.io/js/conventional-commits-parser.svg
[npm-url]: https://npmjs.org/package/conventional-commits-parser
[travis-image]: https://travis-ci.org/stevemao/conventional-commits-parser.svg?branch=master
[travis-url]: https://travis-ci.org/stevemao/conventional-commits-parser
[daviddm-image]: https://david-dm.org/stevemao/conventional-commits-parser.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/stevemao/conventional-commits-parser
[coveralls-image]: https://coveralls.io/repos/stevemao/conventional-commits-parser/badge.svg
[coveralls-url]: https://coveralls.io/r/stevemao/conventional-commits-parser
