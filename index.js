
var fs = require('fs');
var git = require('./lib/git');
var writer = require('./lib/writer');
var extend = require('lodash.assign');

module.exports = generate;
module.exports.bump = bump;

function generate(options, done) {
  options = extend({
    version: null,
    to: 'HEAD',
    file: 'CHANGELOG.md',
    subtitle: '',
    log: console.log.bind(console),
  }, options || {});

  if (!options.version) {
    return done('No version specified');
  }

  readCommits(options, function writeLog(err, commits) {
    if (err) return done(err);

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
  });
}

function bump(options, done) {
  options = extend({
    version: null,
    to: 'HEAD',
    log: console.log.bind(console),
  }, options || {});

  readCommits(options, function writeLog(err, commits) {
    if (err) return done(err);

    var levels = ['major', 'minor', 'patch'];
    var bump = 2;

    commits.forEach(function (commit) {
      if (commit.breaks.length) {
        bump = Math.min(bump, 0);
      }
      else if (commit.type === 'feat') {
        bump = Math.min(bump, 1);
      }
    });

    done(null, levels[bump]);
  });
}

function readCommits(options, done) {
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

      options.log('Parsed %d commits.', commits.length);
      done(null, commits);
    });
  }
}
