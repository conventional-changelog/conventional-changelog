'use strict';
var conventionalCommitsParser = require('../');
var expect = require('chai').expect;
var forEach = require('lodash').forEach;
var through = require('through2');

describe('conventionalCommitsParser', function() {
  it('should parse raw commits', function(done) {
    var stream = through();
    var commits = [
      'feat(ng-list): Allow custom separator\n' +
      'bla bla bla\n\n' +
      'Closes #123\nCloses #25\nFixes #33\n',

      'feat(ng-list): Allow custom separator\n' +
      'bla bla bla\n\n' +
      'BREAKING CHANGE: some breaking change\n',

      'fix(zzz): Very cool commit\n' +
      'bla bla bla\n\n' +
      'Closes #2, #3. Resolves #4. Fixes #5. Fixes #6.\n' +
      'What not ?\n',

      'chore(scope with spaces): some chore\n' +
      'bla bla bla\n\n' +
      'BREAKING CHANGE: some breaking change\n'
    ];

    forEach(commits, function(commit) {
      stream.write(commit);
    });
    stream.end();

    var i = 0;

    stream
      .pipe(conventionalCommitsParser())
      .pipe(through.obj(function(chunk, enc, cb) {
        if (i === 0) {
          expect(chunk.header).to.equal('feat(ng-list): Allow custom separator\n');
        } else if (i === 1) {
          expect(chunk.header).to.equal('feat(ng-list): Allow custom separator\n');
        } else if (i === 2) {
          expect(chunk.header).to.equal('fix(zzz): Very cool commit\n');
        } else if (i === 3) {
          expect(chunk.header).to.equal('chore(scope with spaces): some chore\n');
        }

        i++;
        cb();
      }, function() {
        expect(i).to.equal(4);
        done();
      }));
  });

  it('should ignore malformed commits', function(done) {
    var stream = through();
    var commits = [
      'chore(scope with spaces): some chore\n',

      '\n' +
      ' \n\n',

      'fix(zzz): Very cool commit\n' +
      'bla bla bla\n\n'
    ];

    forEach(commits, function(commit) {
      stream.write(commit);
    });
    stream.end();

    var i = 0;

    stream
      .pipe(conventionalCommitsParser())
      .pipe(through.obj(function(chunk, enc, cb) {
        ++i;
        cb();
      }, function() {
        expect(i).to.equal(3);
        done();
      }));
  });

  it('should warn if malformed commits found', function(done) {
    var stream = through();
    var commit = ' \n\n';

    stream.write(commit);
    stream.end();

    stream
      .pipe(conventionalCommitsParser({
        warn: function(warning) {
          expect(warning).to.equal('TypeError: Expected a raw commit');
          done();
        }
      }))
      .pipe(through.obj(function(chunk, enc, cb) {
        cb();
      }));
  });

  it('should error if malformed commits found and `options.warn === true`', function(done) {
    var stream = through();
    var commit = ' \n\n';

    stream.write(commit);
    stream.end();

    stream
      .pipe(conventionalCommitsParser({
        warn: true
      }))
      .on('error', function(err) {
        expect(err.toString()).to.equal('TypeError: Expected a raw commit');
        done();
      });
  });

  var commits = [
    'feat(ng-list) Allow custom separator\n' +
    'bla bla bla\n\n' +
    'Fix #123\nCloses #25\nfix #33\n',

    'fix(ng-list) Another custom separator\n' +
    'bla bla bla\n\n' +
    'BREAKING CHANGES: some breaking changes\n'
  ];

  it('should take options', function(done) {
    var stream = through();
    var i = 0;

    forEach(commits, function(commit) {
      stream.write(commit);
    });
    stream.end();

    stream
      .pipe(conventionalCommitsParser({
        headerPattern: /^(\w*)(?:\(([\w\$\.\-\* ]*)\))?\ (.*)$/,
        noteKeywords: ['BREAKING CHANGES'],
        referenceKeywords: ['fix']
      }))
      .pipe(through.obj(function(chunk, enc, cb) {
        if (i === 0) {
          expect(chunk.type).to.equal('feat');
          expect(chunk.scope).to.equal('ng-list');
          expect(chunk.subject).to.equal('Allow custom separator');
          expect(chunk.references).to.eql([{
            action: 'Fix',
            issue: '123',
            raw: '#123',
            repository: null
          }, {
            action: 'fix',
            issue: '33',
            raw: '#33',
            repository: null
          }]);
        } else if (i === 1) {
          expect(chunk.type).to.equal('fix');
          expect(chunk.scope).to.equal('ng-list');
          expect(chunk.subject).to.equal('Another custom separator');
          expect(chunk.notes[0]).to.eql({
            title: 'BREAKING CHANGES',
            text: 'some breaking changes\n'
          });
        }

        i++;
        cb();
      }, function() {
        expect(i).to.equal(2);
        done();
      }));
  });

  it('should take string options', function(done) {
    var stream = through();
    var length = commits.length;

    forEach(commits, function(commit) {
      stream.write(commit);
    });
    stream.write('blabla\n-hash-\n9b1aff905b638aa274a5fc8f88662df446d374bd');
    stream.end();

    stream
      .pipe(conventionalCommitsParser({
        fieldPattern: '^-(.*?)-$',
        headerPattern: '^(\\w*)(?:\\(([\\w\\$\\.\\-\\* ]*)\\))?\\ (.*)$',
        headerCorrespondence: 'subject,type,  scope,',
        noteKeywords: 'BREAKING CHANGES',
        referenceKeywords: 'fix'
      }))
      .pipe(through.obj(function(chunk, enc, cb) {
        if (length === 2) {
          expect(chunk.subject).to.equal('feat');
          expect(chunk.type).to.equal('ng-list');
          expect(chunk.scope).to.equal('Allow custom separator');
          expect(chunk.references).to.eql([{
            action: 'Fix',
            issue: '123',
            raw: '#123',
            repository: null
          }, {
            action: 'fix',
            issue: '33',
            raw: '#33',
            repository: null
          }]);
        } else if (length === 1) {
          expect(chunk.type).to.equal('ng-list');
          expect(chunk.scope).to.equal('Another custom separator');
          expect(chunk.subject).to.equal('fix');
          expect(chunk.notes[0]).to.eql({
            title: 'BREAKING CHANGES',
            text: 'some breaking changes\n'
          });
        } else {
          expect(chunk.header).to.equal('blabla\n');
          expect(chunk.hash).to.equal('9b1aff905b638aa274a5fc8f88662df446d374bd\n');

          done();
        }
        --length;
        cb();
      }));
  });
});
