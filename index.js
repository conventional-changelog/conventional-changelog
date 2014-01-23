
var fs = require('fs');
var git = require('./lib/git');
var writer = require('./lib/writer');
var extend = require('lodash.assign');

module.exports = generate;

function generate(options, done) {
  options = extend({
    version: null,
    to: 'HEAD',
    file: 'CHANGELOG.md',
    log: console.log.bind(console),
  }, options || {});

  if (!options.version) {
    return done('No version specified');
  }

  git.getTags(function(err, tags) {
    if (err) return done('Failed to read git tags\n'+err);
    getChangelogCommits(tags);
  });

  function getChangelogCommits(tags) {
    if (!tags.length) {
      return done('There exist no commits or tags for this repository!');
    }

    var fromIndex = tags.indexOf(options.from);
    var toIndex = tags.indexOf(options.to);
    if (fromIndex === -1) {
      options.from = tags[0]; //if no from, start at latest tag
    }
    if (toIndex === -1) {
      //if no to, start at the first tag after from, or just use HEAD
      options.to = tags[fromIndex - 1] || 'HEAD';
    }
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

