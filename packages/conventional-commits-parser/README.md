#  [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url] [![Coverage Status][coverall-image]][coverall-url]

> parse raw conventional commits


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

The footer should contain any information about **Breaking Changes** (optional) and is also the place to reference GitHub issues that this commit **Closes** (optional).

```
<breaking change>
<BLANK LINE>
<closes>
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

/*=> { hash: '9b1aff905b638aa274a5fc8f88662df446d374bd',
  header: 'feat(scope): broadcast $destroy event on scope destruction',
  body: '',
  footer: 'Closes #1',
  breaks: {},
  closes: [ 1 ],
  type: 'feat',
  scope: 'scope',
  subject: 'broadcast $destroy event on scope destruction' }
{ hash: '13f31602f396bc269076ab4d389cfd8ca94b20ba',
  header: 'feat(ng-list): Allow custom separator',
  body: 'bla bla bla',
  footer: 'BREAKING CHANGE: some breaking change',
  breaks: { 'BREAKING CHANGE': 'some breaking change' },
  closes: [],
  type: 'feat',
  scope: 'ng-list',
  subject: 'Allow custom separator' }
*/
```


## API

### conventionalCommitsParser([options])

Returns an object stream.

#### options

Type: `object`

##### maxSubjectLength

Type: `number` Default: `80`

The maximum subject length.

##### headerPattern

Type: `regex` Default: `/^(\w*)(?:\(([\w\$\.\-\* ]*)\))?\: (.*)$/`

Used to match header pattern. The first capturing group captures **type**, second captures **scope** and third captures **subject**

##### closeKeywords

Type: `array` or `string` Default:
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

This value is case **insensitive**.

Keywords that used to close issues.

##### breakKeywords

Type: `array` or `string` Default: `['BREAKING CHANGE']`

Keywords for breaking changes.


## CLI

You can use cli to practice writing commit messages or test from a file.

```sh
$ npm install --global conventional-commits-parser
```

```sh
$ conventional-commits-parser --help
```

If you run `conventional-commits-parser` without any arguments

```sh
$ conventional-commits-parser
```

You will enter an interactive shell. To show your parsed result enter "return" three times.

```sh
> fix(title): a title is fixed



result: {"hash":null,"header":"fix(title): a title is fixed","body":"","footer":"","breaks":{},"closes":[],"type":"fix","scope":"title","subject":"a title is fixed"}
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
conventional-commits-parser log.txt
```

An array of json will be printed to stdout.

```sh
[
{"hash":"9b1aff905b638aa274a5fc8f88662df446d374bd","header":"feat(ngMessages): provide support for dynamic message resolution","body":"Prior to this fix it was impossible to apply a binding to a the ngMessage directive to represent the name of the error.","footer":"BREAKING CHANGE: The `ngMessagesInclude` attribute is now its own directive and that must be placed as a **child** element within the element with the ngMessages directive.\nCloses #10036\nCloses #9338","breaks":{"BREAKING CHANGE":"The `ngMessagesInclude` attribute is now its own directive and that must be placed as a **child** element within the element with the ngMessages directive."},"closes":[10036,9338],"type":"feat","scope":"ngMessages","subject":"provide support for dynamic message resolution"}
]
```


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
