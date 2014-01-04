conventional-changelog
----------------------

Generate a changelog from git metadata, using [these](https://docs.google.com/document/d/1QrDFcIiPjSLDn3EL15IJygNPiHORgU1_OOAqWjiDU5Y/) conventions.

## Example output
- https://github.com/btford/conventional-changelog/blob/master/CHANGELOG.md
- https://github.com/karma-runner/karma/blob/master/CHANGELOG.md

Recommended usage: use in your workflow with (TODO: LINKS) grunt-conventional-changelog and gulp-conventional-changelog.

## Documentation

Simple usage: 

```js
var log = require('changelog')({
  repository: 'https://github.com/joyent/node'
});
fs.writeFileSync('CHANGELOG.md', log);
```

#### `string` `changelog(options)`

By default, returns a string containing a changelog from the previous tag to HEAD, using pkg.version, prepended to existing CHANGELOG.md (if it exists).

`options` is an object which can be passed to the changelog function.  The following fields are available *(all are optional)*:

* `repository` `{string}` - If this is provided, allows issues and commit hashes to be linked to the actual commit.  Usually used with github repositories.  For example, `{repository: 'http://github.com/joyent/node'}`

* `commitLink` `{function(commitHash)}` - If repository is provided, this function will be used to link to commits. By default, returns a github commit link based on options.repository: `opts.repository + '/commit/' + hash`

* `issueLink` `{function(issueId)}` - If repository is provided, this function will be used to link to issues.  By default, returns a github issue link based on options.repository: `opts.repository + '/issues/' + id`

* `version` `{string}` - The version to be written to the changelog. By default, tries to use package.json `version` field.

* `from` `{string}` - Which commit the changelog should start at. By default, uses previous tag, or if no previous tag the first commit.

* `to` `{string}` - Which commit the changelog should end at.  By default, uses HEAD.

* `file` `{string}` - Which file to read the current changelog from and prepend the new changelog's contents to.  By default, uses `'CHANGELOG.md'`.

* `log` `{function()}` - What logging function to use. For example, `{log: grunt.log.ok}`. By default, uses `console.log`.

* `warn` `{function()}` - What warn function to use. For example, `{warn: grunt.log.writeln}`. By default, uses `console.warn`.

## License
BSD
