#!/usr/bin/env node
'use strict';

var generate = require('./');
var fs = require('fs');
var multiline = require('multiline');
var pkg = require('./package.json');
var options = require('minimist')(process.argv.slice(2), {
  string: [
    'file',
    'from',
    'to',
    'subtitle',
    'repository'
  ],
  boolean: [
    'version',
    'help',
    'no-write'
  ]
});

var args = options._;
delete options._;

function showHelp() {
  console.log(multiline(function() {/*

  Generate a changelog from git metadata, using the AngularJS commit
  conventions.

  Specify a version as first argument, or use 'next' as version number if no
  version is specified.

  Usage
    changelog
    changelog <version>
    changelog <version> --file <filename>
    changelog <version> --file <filename> --no-write

  Options
    --subtitle    A string to display after the version title in the changelog.
                  For example, it will show "## 1.0.0 "Super Version" if
                  codename "Super Version" is given.
    --repository  If this is provided, allows issues and commit hashes to be
                  linked to the actual commit. usually used with github
                  repositories. E.g. http://github.com/joyent/node
    --from        Which commit the changelog should start at. By default, uses
                  previous tag, or if no previous tag the first commit.
    --to          Which commit the changelog should end at. By default, uses
                  HEAD.
    --file        A file to read the current changelog from and prepend the new
                  changelog's contents to.
    --no-write    Don't write back to the file. Used in combination with --file.
    

  */}));
}

function toScreen(err, log) {
  console.log(log);
}

function toFile(err, log, filename) {
  fs.writeFileSync(filename, log);
}

function init(args, options) {
  if (options.version) {
    console.log(pkg.version);
    return;
  }

  if (options.help) {
    showHelp();
    return;
  }

  var version = args.length ? args[0] : 'next';
  if (!args.length) {
    console.warn('No version specified, using "' + version + '"');
  }

  function callback(err, log) {
    if (err) {
      console.error(err);
      return;
    }

    if (options.file && !options['no-write']) {
      toFile(err, log, options.file);
    } else {
      toScreen(err, log);
    }
  }

  generate({
    version: version,
    subtitle: options.subtitle || undefined,
    from: options.from,
    to: options.to,
    repository: options.repository || undefined,
    file: options.file
  }, callback);
}


init(args, options);
