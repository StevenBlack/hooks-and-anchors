'use strict';

var assert = require('chai').assert;
var expect = require('chai').expect;
var should = require('should');
var Hook = require('../lib/').Hook;

describe('Tests in ' + __filename, function () {
  describe('Hook standalone functionality', function () {
    it('Simple hook all methods fire', function () {
      var hook = new Hook({ name: 'simpleHook' });
      hook.process({});
    });
  });
});