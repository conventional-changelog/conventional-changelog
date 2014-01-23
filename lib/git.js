var extend = require('lodash.assign');
var cp = require('child_process');
var es = require('event-stream');
var util = require('util'); 
module.exports = {
  parseRawCommit: parseRawCommit,
  getCommits: getCommits,
  latestTag: latestTag
};

//Get latest tag, or if no tag first commit
function latestTag(done) {
  //Get tags sorted by date
  cp.exec("git describe --tags `git rev-list --tags --max-count=1`", function(err, stdout, stderr) {
    if (err) {
      getFirstCommit(done);
    } else {
      done(null, String(stdout).trim());
    }
  });
}

function getFirstCommit(done) {
  //Error --> no tag, get first commit
  cp.exec('git log --format="%H" --pretty=oneline --reverse', function(err, stdout, stderr) {
    if (stderr || !String(stdout).trim()) {
      done('No commits found!');
    } else {
      done(null, String(stdout).split('\n')[0].split(' ')[0].trim());
    }
  });
}

function filterExists(data, cb) {
  if (data) cb(null, data);
  else cb();  //get rid of blank lines
}

function getCommits(options, done) {
  options = extend({
    grep: '^feat|^fix|BREAKING',
    format: '%H%n%s%n%b%n==END==',
    from: '',
    to: 'HEAD'
  }, options || {});

  var cmd = 'git log --grep="%s" -E --format=%s %s';
  cmd = util.format(
    cmd, 
    options.grep,
    options.format, 
    options.from ? options.from+'..'+options.to : ''
  );

  return es.child(cp.exec(cmd))
    .pipe(es.split('\n==END==\n'))
    .pipe(es.map(function(data, cb) {
      var commit = parseRawCommit(data, options);
      if (commit) cb(null, commit);
      else cb();
    }))
    .pipe(es.writeArray(done));
}

var COMMIT_PATTERN = /^(\w*)(\(([\w\$\.\-\*]*)\))?\: (.*)$/;
var MAX_SUBJECT_LENGTH = 80;
function parseRawCommit(raw, options) {
  if (!raw) {
    return null;
  }

  var lines = raw.split('\n');
  var msg = {}, match;

  msg.hash = lines.shift();
  msg.subject = lines.shift();
  msg.closes = [];
  msg.breaks = [];

  msg.subject = msg.subject.replace(/\s*(?:Closes|Fixes)\s#(\d+)/, function(_, i) {
    msg.closes.push(parseInt(i, 10));
    return '';
  });

  lines.forEach(function(line) {
    match = line.match(/(?:Closes|Fixes)\s((?:#\d+(?:\,\s)?)+)/);

    if (match) {
      match[1].replace(/[\s#]/g, '').split(',').forEach(function(i) {
        msg.closes.push(parseInt(i, 10));
      });
    }
  });

  match = raw.match(/BREAKING CHANGE:\s([\s\S]*)/);
  if (match) {
    msg.breaks.push(match[1]);
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
