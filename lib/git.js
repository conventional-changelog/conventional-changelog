var extend = require('lodash.assign');
var cp = require('child_process');
var es = require('event-stream');
var util = require('util');

module.exports = {
  parseRawCommit: parseRawCommit,
  getCommits: getCommits,
  getTags: getTags
};

//Get all of the tags, and also get the very first commit
//Gives back an array like: ['v0.0.4', 'v0.0.3', 'v0.0.2', 'v0.0.1', '0b6927177c...']
function getTags(done) {
  //Get tags sorted by date
  return es.child(cp.exec('git for-each-ref --format="%(taggerdate): %(refname)" --sort=-taggerdate --count=10 refs/tags '))
    .pipe(es.split())
    .pipe(es.map(function(data, cb) {
      if (!data) {
        cb();
      } else {
        //: refs/tags/<tagname> --> <tagname>
        cb(null, data.replace(/^.*?refs.tags./,''));
      }
    }))
    .pipe(es.map(filterExists))
    .pipe(es.writeArray(function(err, tags) {
      //Also get very first commit and put it at start of array
      es.child(cp.exec('git log --format="%H" | tail -1'))
        .pipe(es.split())
        .pipe(es.map(filterExists))
        .pipe(es.writeArray(function(err, hashes) {
          done(null, tags.concat(hashes));
        }));
    }));
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
