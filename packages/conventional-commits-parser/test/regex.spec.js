'use strict';
var expect = require('chai').expect;
var regex = require('../lib/regex');

describe('regex', function() {
  describe('getBreaksRegex', function() {
    it('should generate correct regex', function() {
      var re = regex.getBreaksRegex(['Breaking News', 'Breaking Change']);
      expect(re).to.eql(/(Breaking News|Breaking Change):\s([\s\S]*)/);
    });

    it('should ignore whitespace', function() {
      var re = regex.getBreaksRegex([' Breaking News', 'Breaking Change ', '', ' Breaking SOLUTION ']);
      expect(re).to.eql(/(Breaking News|Breaking Change|Breaking SOLUTION):\s([\s\S]*)/);
    });
  });

  describe('getClosesRegex', function() {
    it('should generate correct regex', function() {
      var re = regex.getClosesRegex(['Closes', 'amends']);
      expect(re).to.eql(/(?:Closes|amends)\s((?:#\d+(?:\,\s)?)+)/gi);
    });

    it('should ignore whitespace', function() {
      var re = regex.getClosesRegex([' Closes', 'amends ', '', ' fixes ']);
      expect(re).to.eql(/(?:Closes|amends|fixes)\s((?:#\d+(?:\,\s)?)+)/gi);
    });
  });
});
