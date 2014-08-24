var es = require('event-stream');
var extend = require('lodash.assign');
var sprintf = require("sprintf-js").sprintf;
var dialectJSON;

module.exports = {
  writeLog: writeLog,
  Writer: Writer
};

function getVersion (version, subtitle) {
  subtitle = subtitle ? ' ' + subtitle : '';
  return sprintf(dialectJSON.VERSION, version, subtitle);
}
function getPatchVersion (version, subtitle) {
  subtitle = subtitle ? ' ' + subtitle : '';
  return sprintf(dialectJSON.PATCH_VERSION, version, subtitle);
}
function getIssueLink(repository, issue) {
  return repository ?
    sprintf(dialectJSON.LINK_ISSUE, issue, repository, issue) :
    sprintf(dialectJSON.ISSUE, issue);
}
function getCommitLink(repository, hash) {
  var shortHash = hash.substring(0,8); // no need to show super long hash in log
  return repository ?
    sprintf(dialectJSON.LINK_COMMIT, shortHash, repository, hash) :
    sprintf(dialectJSON.COMMIT, shortHash);
}

function writeLog(commits, options, done) {

  var log = '';
  var stream = es.through(function(data) {
    log += data;
  }, function() {
    done(null, log);
  });

  var writer = new Writer(stream, options);
  var sections = {
    fix: {},
    feat: {},
    breaks: {}
  };

  commits.forEach(function(commit) {
    var section = sections[commit.type];
    var component = commit.component || dialectJSON.EMPTY_COMPONENT;

    if (section) {
      section[component] = section[component] || [];
      section[component].push(commit);
    }

    commit.breaks.forEach(function(breakMsg) {
      sections.breaks[dialectJSON.EMPTY_COMPONENT] = sections.breaks[dialectJSON.EMPTY_COMPONENT] || [];

      sections.breaks[dialectJSON.EMPTY_COMPONENT].push({
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
}

function Writer(stream, options) {
  options = extend({
    versionText: getVersion,
    patchVersionText: getPatchVersion,
    issueLink: getIssueLink.bind(null, options.repository),
    commitLink: getCommitLink.bind(null, options.repository)
  }, options || {});

  dialectJSON = options.dialectJSON;

  this.header = function(version) {
    var subtitle = options.subtitle || '';
    var versionText = version.split('.')[2] === '0' ?
      options.versionText(version, subtitle) :
      options.patchVersionText(version, subtitle);

    if (options.repository) {
      stream.write(sprintf(dialectJSON.LINK_HEADER_TPL, versionText, currentDate()));
    } else {
      stream.write(sprintf(dialectJSON.PLAIN_HEADER_TPL, version, versionText, currentDate()));
    }
  };

  this.section = function(title, section) {
    var components = Object.getOwnPropertyNames(section).sort();

    if (!components.length) {
      return;
    }

    stream.write(sprintf(dialectJSON.SECTION_TPL, title));

    components.forEach(function(name) {
      var prefix = dialectJSON.EMPTY_COMPONENT_PREFIX;
      var nested = section[name].length > 1;

      if (name !== dialectJSON.EMPTY_COMPONENT) {
        if (nested) {
          stream.write(sprintf(dialectJSON.COMPONENT_PREFIX+'\n', name));
          prefix = dialectJSON.SUB_COMPONENT_PREFIX;
        } else {
          prefix = sprintf(dialectJSON.COMPONENT_PREFIX, name);
        }
      }

      section[name].forEach(function(commit) {
        stream.write(sprintf(
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
}

function currentDate() {
  var now = new Date();
  var pad = function(i) {
    return ('0' + i).substr(-2);
  };

  return sprintf('%d-%s-%s', now.getFullYear(), pad(now.getMonth() + 1), pad(now.getDate()));
}
