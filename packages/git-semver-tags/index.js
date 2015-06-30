'use strict';
var exec = require('child_process').exec;
var semverValid = require('semver').valid;
var regex = /tag:\s*(.+?)[,\)]/gi;
var cmd = 'git log --date-order --tags --simplify-by-decoration --pretty=format:"%d"';

module.exports = function(callback) {
  exec(cmd, function(err, data) {
    if (err) {
      callback(err);
      return;
    }

    var tags = [];

    data.split('\n').forEach(function(decorations) {
      var match;
      while (match = regex.exec(decorations)) {
        var tag = match[1];
        if (semverValid(tag)) {
          tags.push(tag);
        }
      }
    });

    callback(null, tags);
  });
};
