// TODO(vojta): nicer breaking changes (https://github.com/angular/angular.js/commit/07a58dd7669431d33b61f8c3213c31eff744d02a)
// TODO(vojta): ignore "Merge pull request..." messages, or ignore them in git log ? (--no-merges)

/*
 * @ajoslin says: Most of this script originally crated by @vojtajina
 */

var cp = require('child_process');
var util = require('util');
var es = require('event-stream');
var fs = require('fs');
var pkg;

var GIT_TAG_CMD = 'git describe --tags --abbrev=0';

var EMPTY_COMPONENT = '$$';
var MAX_SUBJECT_LENGTH = 80;

var PATTERN = /^(\w*)(\(([\w\$\.\-\*]*)\))?\: (.*)$/;

var warn = function() {
  console.log('WARNING:', util.format.apply(null, arguments));
};
var log = function() {
  console.log(util.format.apply(null, arguments));
};


function getGitLogCommand(grep, format, from, to) {
  var cmd = 'git log --grep="%s" -E --format=%s';

  if (from) {
    cmd += ' %s..%s';
    return util.format(cmd, grep, format, from, to);
  } else {
    return util.format(cmd, grep, format);
  }
  return cmd;
}

function parseRawCommit(raw) {
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
  match = msg.subject.match(PATTERN);

  if (!match || !match[1] || !match[4]) {
    warn('Incorrect message: %s %s', msg.hash, msg.subject);
    return null;
  }

  if (match[4].length > MAX_SUBJECT_LENGTH) {
    warn('Too long subject: %s %s', msg.hash, msg.subject);
    match[4] = match[4].substr(0, MAX_SUBJECT_LENGTH);
  }

  msg.type = match[1];
  msg.component = match[3];
  msg.subject = match[4];

  return msg;
}


function currentDate() {
  var now = new Date();
  var pad = function(i) {
    return ('0' + i).substr(-2);
  };

  return util.format('%d-%s-%s', now.getFullYear(), pad(now.getMonth() + 1), pad(now.getDate()));
}

function readGitLog(grep, from, to, callback) {
  log('Reading git log from %s to %s', from || 'root', to);

  return es.child(cp.exec(getGitLogCommand(grep, '%H%n%s%n%b%n==END==', from, to)))
    .pipe(es.split('\n==END==\n'))
    .pipe(es.map(function(data, callback) {
      var commit = parseRawCommit(data);
      if (commit) {
        callback(null, commit);
      } else {
        callback(); //drop data if no proper commit
      }
    })).pipe(es.writeArray(function(err, commits) {
      log('Parsed %s commits', commits.length);
      callback(commits);
    }));
}


var PATCH_HEADER_TPL = '<a name="%s"></a>\n### %s (%s)\n\n';
var MINOR_HEADER_TPL = '<a name="%s"></a>\n## %s (%s)\n\n';

var Writer = function(stream, options) {

  this.header = function(version) {
    var header = version.split('.')[2] === '0' ? MINOR_HEADER_TPL : PATCH_HEADER_TPL;
    stream.write(util.format(header, version, version, currentDate()));
  };

  this.section = function(title, section) {
    var components = Object.getOwnPropertyNames(section).sort();

    if (!components.length) {
      return;
    }

    stream.write(util.format('\n#### %s\n\n', title));

    components.forEach(function(name) {
      var prefix = '*';
      var nested = section[name].length > 1;

      if (name !== EMPTY_COMPONENT) {
        if (nested) {
          stream.write(util.format('* **%s:**\n', name));
          prefix = '  *';
        } else {
          prefix = util.format('* **%s:**', name);
        }
      }

      section[name].forEach(function(commit) {
        stream.write(util.format(
          '%s %s (%s',
          prefix, commit.subject, options.commitLink(commit.hash)
        ));
        if (commit.closes.length) {
          stream.write(', closes ' + commit.closes.map(options.issueLink).join(', '));
        }
        stream.write(')\n');
      });
    });

    stream.write('\n');
  };

  this.end = function() {
    stream.end();
  };
};

var makeChangelog = function(commits, options, callback) {

  var writeStream = es.through()
    .pipe(es.wait(function(err, data) {
      callback(data);
    }));

  var writer = new Writer(writeStream, options);
  var sections = {
    fix: {},
    feat: {},
    breaks: {}
  };

  commits.forEach(function(commit) {
    var section = sections[commit.type];
    var component = commit.component || EMPTY_COMPONENT;

    if (section) {
      section[component] = section[component] || [];
      section[component].push(commit);
    }

    commit.breaks.forEach(function(breakMsg) {
      sections.breaks[EMPTY_COMPONENT] = sections.breaks[EMPTY_COMPONENT] || [];

      sections.breaks[EMPTY_COMPONENT].push({
        subject: breakMsg,
        hash: commit.hash,
        closes: []
      });
    });
  });

  writer.header(options.version);
  writer.section('Bug Fixes', sections.fix);
  writer.section('Features', sections.feat);
  writer.section('Breaking Changes', sections.breaks);
  writer.end();
};


function getPreviousTag(callback) {
  cp.exec(GIT_TAG_CMD, function(code, stdout) {
    if (code) {
      //No tag, we'll use head
      callback();
    } else {
      callback(stdout.replace('\n', ''));
    }
  });
}

var LINK_ISSUE = '[#%s](%s/issues/%s)';
var ISSUE = '(#%s)';
var LINK_COMMIT = '[%s](%s/commit/%s)';
var COMMIT = '(%s)';

module.exports = function generate(options, callback) {
  options = options || {};
  options.commitLink = options.commitLink || getCommitLink;
  options.issueLink = options.issueLink || getIssueLink;

  //Allow users to pass their own log fn (eg grunt.log, gulp.util.log)
  if (options.log) {
    log = options.log;
  }
  if (options.warn) {
    warn = options.warn;
  }

  options.version = options.version ||
    (fs.existsSync('package.json') && require('./package.json').version) ||
    'NOVERSION';
  options.to = options.to || 'HEAD';
  options.file = options.file || 'CHANGELOG.md';

  if (options.from) {
    makeLog(options.from);
  } else {
    getPreviousTag(function(from) {
      options.from = from;
      makeLog();
    });
  }

  function makeLog() {
    readGitLog('^feat|^fix|BREAKING', options.from, options.to, function(commits) {
      makeChangelog(commits, options, function(changelog) {
        if (options.file && fs.existsSync(options.file)) {
          fs.readFile(options.file, {encoding:'UTF-8'}, function(err, contents) {
            callback(changelog + '\n' + String(contents));
          });
        } else {
          callback(changelog);
        }
      });
    });
  }

  function getIssueLink(issue) {
    return options.repository ?
      util.format(LINK_ISSUE, issue, options.repository, issue) :
      util.format(ISSUE, issue);
  }
  function getCommitLink(hash) {
    return options.repository ?
      util.format(LINK_COMMIT, hash, options.repository, hash) :
      util.format(COMMIT, hash);
  }

};

// publish for testing
module.exports.parseRawCommit = parseRawCommit;
