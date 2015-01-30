
var fs = require('fs');
var git = require('./lib/git');
var writer = require('./lib/writer');
var extend = require('lodash.assign');
var versioner = require('./lib/versioner');

module.exports = generate;

function generate(options, done) {
  options = extend({
    version: null,
    to: 'HEAD',
    file: 'CHANGELOG.md',
    subtitle: '',
    log: console.log.bind(console),
    currentVersion: null,
    bump: null
  }, options || {});

  if (!options.version && !(options.currentVersion && options.bump)) {
    return done('No version specified');
  } else if (!options.version) {
    options.version = versioner.nextVersion(options.currentVersion, options.bump);
  }

  git.latestTag(function(err, tag) {
    if (err || tag === undefined) return done('Failed to read git tags.\n'+err);
    getChangelogCommits(tag);
  });

  function getChangelogCommits(latestTag) {
    options.from = options.from || latestTag;
    options.to = options.to || 'HEAD';

    options.log('Generating changelog from %s to %s...', options.from, options.to);

    git.getCommits({
      from: options.from,
      to: options.to,
    }, function(err, commits) {
      if (err) return done('Failed to read git log.\n'+err);
      writeLog(commits);
    });
  }

  function writeLog(commits) {
    options.log('Parsed %d commits.', commits.length);
    writer.writeLog(commits, options, function(err, changelog) {
      if (err) return done('Failed to write changelog.\n'+err);

      if (options.file && fs.existsSync(options.file)) {
        fs.readFile(options.file, {encoding:'UTF-8'}, function(err, contents) {
          if (err) return done('Failed to read ' + options.file + '.\n'+err);
          done(null, changelog + '\n' + String(contents));
        });
      } else {
        done(null, changelog);
      }
    });
  }
}
