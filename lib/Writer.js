var dateFormat = require('dateformat');
var extend = require('lodash.assign');
var fs = require('fs');
var normalizeData = require('normalize-package-data');
var parseGithubUrl = require('github-url-from-git');
var url = require('url');
var util = require('util');

var VERSION = '## %s%s';
var PATCH_VERSION = '### %s%s';
var LINK_ISSUE = '[#%s](%s/issues/%s)';
var ISSUE = '(#%s)';
var LINK_COMMIT = '[%s](%s/commit/%s)';
var COMMIT = '(%s)';
var HEADER_TPL = '<a name="%s"></a>\n%s (%s)\n\n';
var EMPTY_COMPONENT = '$$';

function parseNonGithubUrl(nonGithubUrl) {
  try {
    var idx = nonGithubUrl.indexOf('@');
    if (idx !== -1) {
      nonGithubUrl = nonGithubUrl.slice(idx + 1).replace(/:([^\d]+)/, '/$1');
    }
    nonGithubUrl = url.parse(nonGithubUrl);
    var protocol = nonGithubUrl.protocol === 'https:' ?
      'https:' : 'http:';
    return protocol + '//' + (nonGithubUrl.host || '') +
      nonGithubUrl.path.replace(/\.git$/, '');
  } catch (e) {}
}

function getVersion(version, subtitle) {
  subtitle = subtitle ? ' ' + subtitle : '';
  return util.format(VERSION, version, subtitle);
}

function getPatchVersion(version, subtitle) {
  subtitle = subtitle ? ' ' + subtitle : '';
  return util.format(PATCH_VERSION, version, subtitle);
}

function getIssueLink(repository, issue) {
  return repository ?
    util.format(LINK_ISSUE, issue, repository, issue) :
    util.format(ISSUE, issue);
}

function getCommitLink(repository, hash) {
  var shortHash = hash.substring(0, 8); // no need to show super long hash in log
  return repository ?
    util.format(LINK_COMMIT, shortHash, repository, hash) :
    util.format(COMMIT, shortHash);
}

function getPackageData(pkg) {
  var pkgData = JSON.parse(fs.readFileSync(pkg, {
    encoding: 'utf8'
  })) || {};
  normalizeData(pkgData);
  return pkgData;
}

function getPackageRepository(pkgData) {
  var repository = pkgData.repository;
  if (!repository) {
    return null;
  }

  var repoUrl = repository.url;

  repoUrl = (repoUrl && repoUrl.indexOf('github') > -1) ?
    parseGithubUrl(repoUrl) : parseNonGithubUrl(repoUrl);

  return repoUrl;
}

function Writer(stream, options) {
  var pkg = options.pkg || 'package.json';
  var pkgData = getPackageData(pkg);
  var repoUrl = options.repository || getPackageRepository(pkgData);

  options = extend({
    version: pkgData.version,
    versionText: getVersion,
    patchVersionText: getPatchVersion,
    issueLink: getIssueLink.bind(null, repoUrl),
    commitLink: getCommitLink.bind(null, repoUrl)
  }, options || {});

  this.header = function(version) {
    version = version || options.version;
    if (!version) {
      return false;
    }
    var subtitle = options.subtitle || '';
    var versionText = version.split('.')[2] === '0' ?
      options.versionText(version, subtitle) :
      options.patchVersionText(version, subtitle);
    var now = new Date();
    var currentDate = dateFormat(now, 'yyyy-mm-dd');

    stream.write(util.format(HEADER_TPL, version, versionText, currentDate));
    return true;
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
}

module.exports = Writer;
