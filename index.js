'use strict';
var fs = require('fs');
var git = require('./lib/git');
var writeLog = require('./lib/writeLog');
var extend = require('lodash').assign;

function generate(options, done) {
  function getChangelogCommits() {
    git.getCommits(options, function(err, commits) {
      if (err) {
        return done('Failed to read git log.\n' + err);
      }
      writeChangelog(commits);
    });
  }

  function writeChangelog(commits) {
    options.log('Parsed %d commits.', commits.length);
    writeLog(commits, options, function(err, changelog) {
      if (err) {
        return done('Failed to write changelog.\n' + err);
      }

      if (options.file && fs.existsSync(options.file)) {
        fs.readFile(options.file, {
          encoding: 'UTF-8'
        }, function(err, contents) {
          if (err) {
            return done('Failed to read ' + options.file + '.\n' + err);
          }
          done(null, changelog + '\n' + String(contents));
        });
      } else {
        done(null, changelog);
      }
    });
  }

  options = extend({
    file: 'CHANGELOG.md',
    log: console.log.bind(console),
    warn: console.warn.bind(console)
  }, options || {});

  getChangelogCommits();
}

module.exports = generate;
