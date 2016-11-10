'use strict';

var assert = require('chai').assert;
var expect = require('chai').expect;
var should = require('should');
var Hook = require('../lib/').Hook;
var TallyHook = require('../libtest/common.js').TallyHook;

describe('Tests in ' + __filename, function () {
  describe('TallyHook test', function () {
    it('.process(thing) returns a promise', function () {
      var obj = {
        preTally: 0,
        postTally: 0,
        exeTally: 0
      };
      var hook = new TallyHook({ name: 'tallyHook' });
      var promise = hook.process(obj);
      promise.should.be.a.Promise();
    });

    it('tallies hits as expected', function () {
      var obj = {
        preTally: 0,
        postTally: 0,
        exeTally: 0
      };
      var hook = new TallyHook({ name: 'tallyHook' });
      var promise = hook.process(obj);
      promise.then(function () {
        obj.should.have.property('preTally', 1);
        obj.should.have.property('postTally', 1);
      }).catch(function (reason) {
        console.dir(reason);
      });
    });
  });
});