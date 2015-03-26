#  [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url] [![Coverage Status][coverall-image]][coverall-url]

> Parse raw conventional commits


Adapted from code originally written by @ajoslin in [conventional-changelog](https://github.com/ajoslin/conventional-changelog).


## Conventional Commit Message Format

Each input commit message consists of a **hash** (optional), a **header**, a **body** (optional) and a **footer** (optional).

```
<hash>
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

[More details](CONVENTIONS.md)


## Install

```sh
$ npm install --save conventional-commits-parser
```


## Usage

```js
var conventionalCommitsParser = require('conventional-commits-parser');
var through = require('through2');

var rawCommits = [
  '9b1aff905b638aa274a5fc8f88662df446d374bd\n' +
  'feat(scope): broadcast $destroy event on scope destruction\n' +
  'Closes #1',
  '13f31602f396bc269076ab4d389cfd8ca94b20ba\n' +
  'feat(ng-list): Allow custom separator\n' +
  'bla bla bla\n\n' +
  'BREAKING CHANGE: some breaking change\n'
];
var stream = through();

stream.write(rawCommits[0]);
stream.write(rawCommits[1]);

stream
  .pipe(conventionalCommitsParser())
  .pipe(through.obj(function(chunk, enc, cb) {
    console.log(chunk);
    cb();
  }));

/*=>
{ hash: '9b1aff905b638aa274a5fc8f88662df446d374bd',
  header: 'feat(scope): broadcast $destroy event on scope destruction',
  body: '',
  footer: 'Closes #1',
  notes: [],
  references: [ { action: 'Closes', repository: null, issue: '1', raw: '#1' } ],
  type: 'feat',
  scope: 'scope',
  subject: 'broadcast $destroy event on scope destruction' }
{ hash: '13f31602f396bc269076ab4d389cfd8ca94b20ba',
  header: 'feat(ng-list): Allow custom separator',
  body: 'bla bla bla',
  footer: 'BREAKING CHANGE: some breaking change',
  notes: [ { title: 'BREAKING CHANGE', text: 'some breaking change' } ],
  references: [],
  type: 'feat',
  scope: 'ng-list',
  subject: 'Allow custom separator' }
*/
```


## API

### conventionalCommitsParser([options])

Returns an object stream. If there is any malformed commits it will be gracefully ignored (an empty data will be emitted so down stream can notice).

#### options

Type: `object`

##### maxSubjectLength

Type: `number` Default: `80`

The maximum subject length.

##### headerPattern

Type: `regex` or `string` Default: `/^(\w*)(?:\(([\w\$\.\-\* ]*)\))?\: (.*)$/`

Used to match header pattern. The first capturing group captures **type**, second captures **scope** and third captures **subject**. If it's a `string` it will be converted to a `regex`.

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

##### warn

Type: `function` or `boolean` Default: `function() {}`

What warn function to use. For example, `console.warn.bind(console)` or `grunt.log.writeln`. By default, it's a noop. If it is `true`, it will error if commit cannot be parsed (strict).


## CLI

You can use cli to practice writing commit messages or test from a file.

```sh
$ npm install --global conventional-commits-parser
```

If you run `conventional-commits-parser` without any arguments

```sh
$ conventional-commits-parser
```

You will enter an interactive shell. To show your parsed result enter "return" three times (or enter your specified separator).

```sh
> fix(title): a title is fixed


Result: {"hash":null,"header":"fix(title): a title is fixed","body":"","footer":"","notes":[],"references":[],"type":"fix","scope":"title","subject":"a title is fixed"}
```

You can also use cli to test commits from a file.

If you have log.txt

```text
9b1aff905b638aa274a5fc8f88662df446d374bd

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
{"hash":"9b1aff905b638aa274a5fc8f88662df446d374bd","header":"feat(ngMessages): provide support for dynamic message resolution","body":"Prior to this fix it was impossible to apply a binding to a the ngMessage directive to represent the name of the error.","footer":"BREAKING CHANGE: The `ngMessagesInclude` attribute is now its own directive and that must be placed as a **child** element within the element with the ngMessages directive.\nCloses #10036\nCloses #9338","notes":[{"title":"BREAKING CHANGE","text":"The `ngMessagesInclude` attribute is now its own directive and that must be placed as a **child** element within the element with the ngMessages directive."}],"references":[{"action":"Closes","repository":null,"issue":"10036","raw":"#10036"},{"action":"Closes","repository":null,"issue":"9338","raw":"#9338"}],"type":"feat","scope":"ngMessages","subject":"provide support for dynamic message resolution"}
]
```

Commits should be split by at least three newlines (`\n\n\n`) or you can specify a separator as the second argument.

Eg: in log2.txt

```text
2d0eda10e43f6b079b531c507282fad082ea0762

docs(ngMessageExp): split ngMessage docs up to show its alias more clearly
===
4374f892c6fa4af6ba1f2ed47c5f888fdb5fadc5

fix($animate): applyStyles from options on leave

Closes #10068
```

And you run

```sh
$ conventional-commits-parser log2.txt '==='
```

```sh
[
{"hash":"2d0eda10e43f6b079b531c507282fad082ea0762","header":"docs(ngMessageExp): split ngMessage docs up to show its alias more clearly","body":"","footer":"","notes":[],"references":[],"type":"docs","scope":"ngMessageExp","subject":"split ngMessage docs up to show its alias more clearly"}
,
{"hash":"4374f892c6fa4af6ba1f2ed47c5f888fdb5fadc5","header":"fix($animate): applyStyles from options on leave","body":"","footer":"Closes #10068","notes":[],"references":[{"action":"Closes","repository":null,"issue":"10068","raw":"#10068"}],"type":"fix","scope":"$animate","subject":"applyStyles from options on leave"}
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
[coverall-image]: https://coveralls.io/repos/stevemao/conventional-commits-parser/badge.svg
[coverall-url]: https://coveralls.io/r/stevemao/conventional-commits-parser
