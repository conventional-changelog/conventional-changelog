conventional-changelog
----------------------

```sh
$ npm install conventional-changelog
```

Generate a changelog from git metadata, using [these commit conventions](https://docs.google.com/document/d/1QrDFcIiPjSLDn3EL15IJygNPiHORgU1_OOAqWjiDU5Y/).  

View [CONVENTIONS.md](https://github.com/ajoslin/conventional-changelog/blob/master/CONVENTIONS.md) for a synposis of the conventions with commit examples.

Adapted from code originally written by @vojtajina, from grunt-conventional-changelog.

## Example output
- https://github.com/ajoslin/conventional-changelog/blob/master/CHANGELOG.md
- https://github.com/karma-runner/karma/blob/master/CHANGELOG.md

Recommended usage: use in your workflow with [https://github.com/btford/grunt-conventional-changelog](grunt-conventional-changelog) or [https://github.com/tomchentw/gulp-conventional-changelog](gulp-conventional-changelog).

## Documentation

Simple usage: 

```js
require('changelog')({
  repository: 'https://github.com/joyent/node',
  version: require('./package.json').version
}, function(err, log) {
  console.log('Here is your changelog!', log);
});
```

#### `changelog(options, callback)`

By default, calls the callback with a string containing a changelog from the previous tag to HEAD, using pkg.version, prepended to existing CHANGELOG.md (if it exists).

`callback` is the second parameter, and takes two parameters: `(err, log)`. `log` is a string containing the newly generated changelog, and `err` is either an error or null.

`options` is the first parameter, an object.  The following fields are available:

* `version` `{string}` - The version to be written to the changelog. For example, `{version: require('./package.json').version}`

* `repository` `{string}` - If this is provided, allows issues and commit hashes to be linked to the actual commit.  Usually used with github repositories.  For example, `{repository: 'http://github.com/joyent/node'}`

* `commitLink` `{function(commitHash)}` - If repository is provided, this function will be used to link to commits. By default, returns a github commit link based on options.repository: `opts.repository + '/commit/' + hash`

* `issueLink` `{function(issueId)}` - If repository is provided, this function will be used to link to issues.  By default, returns a github issue link based on options.repository: `opts.repository + '/issues/' + id`

* `from` `{string}` - Which commit the changelog should start at. By default, uses previous tag, or if no previous tag the first commit.

* `to` `{string}` - Which commit the changelog should end at.  By default, uses HEAD.

* `file` `{string}` - Which file to read the current changelog from and prepend the new changelog's contents to.  By default, uses `'CHANGELOG.md'`.

* `log` `{function()}` - What logging function to use. For example, `{log: grunt.log.ok}`. By default, uses `console.log`.

* `warn` `{function()}` - What warn function to use. For example, `{warn: grunt.log.writeln}`. By default, uses `console.warn`.

## License
BSD
