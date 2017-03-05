'use strict';
var conventionalChangelogCore = require('conventional-changelog-core');
var config = require('./');
var expect = require('chai').expect;
var shell = require('shelljs');
var through = require('through2');
var writeFileSync = require('fs').writeFileSync;

describe('jquery preset', function() {
  before(function() {
    shell.config.silent = true;
    shell.rm('-rf', 'tmp');
    shell.mkdir('tmp');
    shell.cd('tmp');
    shell.mkdir('git-templates');
    shell.exec('git init --template=./git-templates');

    writeFileSync('test1', '');
    shell.exec('git add --all && git commit -m"Core: Make jQuery objects iterable"');
    writeFileSync('test2', '');
    shell.exec('git add --all && git commit -m"CSS: Don\'t name the anonymous swap function"');
    writeFileSync('test3', '');
    shell.exec('git add --all && git commit -m"Event: Remove an internal argument to the on method" -m"Fixes #2, #4, gh-200"');
    writeFileSync('test4', '');
    shell.exec('git add --all && git commit -m"Manipulation: Remove an internal argument to the remove method" -m"Closes #22"');
    writeFileSync('test5', '');
    shell.exec('git add --all && git commit -m"Bad commit"');
    writeFileSync('test6', '');
    shell.exec('git add --all && git commit -m"Core: Create jQuery.ajax" -m"Closes gh-100"');
  });

  it('should generate a changelog', function(done) {
    conventionalChangelogCore({
      config: config
    })
      .on('error', function(err) {
        done(err);
      })
      .pipe(through(function(chunk) {
        chunk = chunk.toString();

        expect(chunk).to.include('Create jQuery.ajax');
        expect(chunk).to.include(', closes [gh-100](https://github.com/conventional-changelog/conventional-changelog-jquery/issues/100)');
        expect(chunk).to.include(')\n* Make jQuery objects iterable');
        expect(chunk).to.include('### CSS');
        expect(chunk).to.include('Remove an internal argument to the on method');
        expect(chunk).to.include(', closes [#2](https://bugs.jquery.com/ticket/2) [#4](https://bugs.jquery.com/ticket/4) [gh-200](https://github.com/conventional-changelog/conventional-changelog-jquery/issues/200)');
        expect(chunk).to.include('### Manipulation');

        expect(chunk).to.not.include('Bad');

        done();
      }));
  });
});
