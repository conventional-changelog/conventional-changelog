'use strict';
var dateFormat = require('dateformat');
var extend = require('lodash').assign;
var fs = require('fs');
var normalizeData = require('normalize-package-data');
var parseGithubUrl = require('github-url-from-git');
var partial = require('lodash').partial;
var template = require('lodash').template;
var url = require('url');

/*
 * NOTE:
 * We use lodash.template a lot in the not-the-most-efficient manner, for the sake
 * of clarity.
 * The difference between compiling a template once and in a function is negligible
 * for our library.
 */

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

var versionTemplate = function(version, subtitle) {
  return template('## <%= version %><%= subtitle ? (" " + subtitle) : "" %>')({
    version: version,
    subtitle: subtitle
  });
};
var patchVersionTemplate = function(version, subtitle) {
  return template('### <%= version %><%= subtitle ? (" " + subtitle) : "" %>')({
    version: version,
    subtitle: subtitle
  });
};

var issueTemplate = function(repository, issue) {
  var templateFn = repository ?
    template('[#<%= issue %>](<%= repository %>/issues/<%= issue %>)') :
    template('#<%= issue %>');
  return templateFn({
    repository: repository,
    issue: issue
  });
};
var commitTemplate = function(repository, commit) {
  var templateFn = repository ?
    template('[<%= commit %>](<%= repository %>/commit/<%= commit %>)') :
    template('<%= commit %>');
  return templateFn({
    repository: repository,
    commit: commit.substring(0,8) // no need to show super long hash in log
  });
};

function getPackageData(pkg) {
  var pkgData;
  try {
    pkgData = fs.readFileSync(pkg, {
      encoding: 'utf8'
    });
  } catch (e) {
    return null;
  }
  pkgData = JSON.parse(pkgData);
  normalizeData(pkgData);
  return pkgData;
}

function getPackageRepository(pkgData) {
  var url = pkgData && pkgData.repository && pkgData.repository.url;
  if (typeof url !== 'string') {
    return;
  }

  return url.indexOf('github') > -1 ?
    parseGithubUrl(url) :
    parseNonGithubUrl(url);
}

function Writer(stream, options) {
  var pkg = options.pkg || 'package.json';
  var pkgData = getPackageData(pkg) || {};
  var repoUrl = options.repository || getPackageRepository(pkgData);

  options = extend({
    repository: repoUrl,
    version: pkgData.version,
    versionText: versionTemplate,
    patchVersionText: patchVersionTemplate,
    subtitle: '',
    issueLink: partial(issueTemplate, repoUrl),
    commitLink: partial(commitTemplate, repoUrl)
  }, options || {});

  this.header = function() {
    if (!options.version) {
      return false;
    }
    var isMajor = options.version.split('.')[2] === '0';
    var versionTextFn = isMajor ? options.versionText : options.patchVersionText;

    var headerText = template(
      '<a name"<%= version %>"></a>\n<%= versionText %> (<%= date %>)\n\n'
    )({
      version: options.version,
      date: dateFormat(new Date(), 'yyyy-mm-dd'),
      versionText: versionTextFn(options.version, options.subtitle)
    });

    stream.write(headerText);
    return true;
  };

  this.section = function(title, section) {
    var components = Object.getOwnPropertyNames(section).sort();

    if (!components.length) {
      return;
    }

    stream.write( template('\n#### <%= title %>\n\n')({ title: title }) );

    var componentTemplate = template('* **<%= name %>:**');
    var listItemTemplate = template(
      '<%= prefix %> <%= commitSubject %> (<%= commitLink %>' +
      '<%= closes ? (", closes " + closes) : "" %>)\n'
    );
    components.forEach(function(name) {
      var prefix = '*';
      var nested = section[name].length > 1;

      if (name !== EMPTY_COMPONENT) {
        var componentText = componentTemplate({ name: name });
        if (nested) {
          componentText += '\n';
          prefix = '  *';
          stream.write(componentText);
        } else {
          prefix = componentText;
        }
      }

      section[name].forEach(function(commit) {
        stream.write(listItemTemplate({
          prefix: prefix,
          commitSubject: commit.subject,
          commitLink: options.commitLink(commit.hash),
          closes: commit.closes.map(options.issueLink).join(', ')
        }));
      });
    });

    stream.write('\n');
  };

  this.end = function() {
    stream.end();
  };
}

module.exports = Writer;
