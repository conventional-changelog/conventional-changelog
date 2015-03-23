'use strict';
var dargs = require('dargs');
var es = require('event-stream');
var exec = require('child_process').exec;
var gitLatestTag = require('git-latest-tag');
var _ = require('lodash');

function getLatestTag(done) {
  gitLatestTag(true, function(err, tag) {
    done(null, tag);
  });
}

function gitRawCommits(options, done) {
  var noCommits = true;
  if (typeof options === 'function') {
    done = options;
    options = {};
  } else {
    done = done || function() {};
  }

  var throughStream = es.through(function(data) {
    noCommits = false;
    this.queue(data);
  }, function() {
    if (noCommits) {
      done('No commits found');
      this.emit('error', 'No commits found');
    } else {
      this.emit('end');
    }
  });

  getLatestTag(function(err, latestTag) {
    options = _.extend({
      from: latestTag,
      to: 'HEAD'
    }, options);
    var args = dargs(options, {
      excludes: ['from', 'to']
    });
    var cmd = _.template(
      'git log --format=%H%n%s%n%b%n==END== ' +
      '<%= from ? [from, to].join("..") : to %>'
    )(options) + args.join(' ');

    var stream = es.child(exec(cmd))
      .pipe(es.split('\n==END==\n'))
      .pipe(es.map(function(data, callback) {
        if (data) {
          callback(null, data);
        } else {
          callback();
        }
      }));

    stream
      .pipe(throughStream)
      .pipe(es.writeArray(done));
  });

  return throughStream;
}

module.exports = gitRawCommits;
