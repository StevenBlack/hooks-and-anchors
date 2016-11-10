'use strict';

var assert = require('chai').assert;
var expect = require('chai').expect;
var should = require('should');
var Anchor = require('../lib/').Anchor;
var Hook = require('../libtest/common.js').TallyHook;

describe('Tests in ' + __filename, function () {
  describe('Mix of Anchor and Hook functionality', function () {
    it('hook methods all fire', function () {
      var a1 = new Anchor({ 'name': 'a1' });
      var h1 = new Hook({ 'name': 'h1' });
      var h2 = new Hook({ 'name': 'h2' });
      var h3 = new Hook({ 'name': 'h3' });
      var h4 = new Hook({ 'name': 'h4' });
      var h5 = new Hook({ 'name': 'h5' });

      h1.setHook(h2).setHook(h3);

      a1.setHook(h1);
      a1.hooks.push(h4);
      a1.hooks.push(h5);

      var obj = {
        preTally: 0,
        postTally: 0,
        exeTally: 0
      };

      var promise = a1.process(obj);

      promise.should.be.a.Promise();
      promise.then(function (testObj) {
        should(testObj).have.property('preTally', 5);
        should(testObj).have.property('exeTally', 5);
        should(testObj).have.property('postTally', 5);
      }).catch(function (err) {
        console.dir(err);
      });
    });
  });
});