'use strict';
var extend = require('lodash').assign;
var cp = require('child_process');
var es = require('event-stream');
var template = require('lodash').template;

var COMMIT_PATTERN = /^(\w*)(\(([\w\$\.\-\* ]*)\))?\: (.*)$/;
var MAX_SUBJECT_LENGTH = 80;

function getFirstCommit(done) {
  // error --> no tag, get first commit
  cp.exec('git log --format="%H" --pretty=oneline --reverse', function(err, stdout, stderr) {
    if (stderr || !String(stdout).trim()) {
      done('No commits found!');
    } else {
      // return empty string for first commit to appear in changelog
      done(null, '');
    }
  });
}

// get latest tag, or if no tag first commit
function getLatestTag(done) {
  // get tags sorted by date
  cp.exec('git describe --tags --abbrev=0', function(err, stdout) {
    if (err) {
      getFirstCommit(done);
    } else {
      done(null, String(stdout).trim());
    }
  });
}

function parseRawCommit(raw) {
  if (!raw) {
    return null;
  }

  var lines = raw.split('\n');
  var msg = {};
  var match;

  msg.hash = lines.shift();
  msg.subject = lines.shift();
  msg.closes = [];
  msg.breaks = [];

  msg.subject = msg.subject.replace(/\s*(?:Closes|Fixes|Resolves)\s#(\d+)/ig, function(_, i) {
    msg.closes.push(parseInt(i, 10));
    return '';
  });

  lines.forEach(function(line) {
    match = line.match(/(?:Closes|Fixes|Resolves)\s((?:#\d+(?:\,\s)?)+)/ig);

    if (match) {
      match.forEach(function(m) {
        if (m) {
          m.split(',').forEach(function(i) {
            var issue = i.match(/\d+/);
            if (issue) {
              msg.closes.push(parseInt(issue[0], 10));
            }
          });
        }
      });
    }
  });

  match = raw.match(/BREAKING CHANGE:\s([\s\S]*)/);
  if (match) {
    msg.breaks.push(match[1] + '\n');
  }

  msg.body = lines.join('\n');
  match = msg.subject.match(COMMIT_PATTERN);

  if (!match || !match[1] || !match[4]) {
    return null;
  }

  if (match[4].length > MAX_SUBJECT_LENGTH) {
    match[4] = match[4].substr(0, MAX_SUBJECT_LENGTH);
  }

  msg.type = match[1];
  msg.component = match[3];
  msg.subject = match[4];

  return msg;
}

function getCommits(options, done) {
  getLatestTag(function(err, latestTag) {
    if (err || latestTag === undefined) {
      return done('Failed to read git tags.\n' + err);
    }

    options = extend({
      grep: '^feat|^fix|BREAKING',
      format: '%H%n%s%n%b%n==END==',
      from: latestTag,
      to: 'HEAD'
    }, options || {});

    options.log('Generating changelog from %s to %s...', options.from, options.to);

    var cmd = template(
      'git log --grep="<%= grep %>" -E --format=<%= format %> ' +
      '<%= from ? [from,to].join("..") : "" %> '
    )(options);

    return es.child(cp.exec(cmd))
      .pipe(es.split('\n==END==\n'))
      .pipe(es.map(function(data, cb) {
        var commit = parseRawCommit(data, options);
        if (commit) {
          cb(null, commit);
        } else {
          cb();
        }
      }))
      .pipe(es.writeArray(done));
  });
}

module.exports = {
  parseRawCommit: parseRawCommit,
  getCommits: getCommits
};
