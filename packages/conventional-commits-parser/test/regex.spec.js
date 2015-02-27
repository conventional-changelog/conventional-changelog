'use strict';
var expect = require('chai').expect;
var regex = require('../lib/regex');

describe('regex', function() {
  it('getBreaksRegex', function() {
    var re = regex.getBreaksRegex(['Breaking News', 'Breaking Change']);
    expect(re).to.eql(/(Breaking News|Breaking Change):\s([\s\S]*)/);
  });

  it('getClosesRegex', function() {
    var re = regex.getClosesRegex(['Closes', 'amends']);
    expect(re).to.eql(/(?:Closes|amends)\s((?:#\d+(?:\,\s)?)+)/gi);
  });
});
