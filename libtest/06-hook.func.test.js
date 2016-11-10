'use strict';

var assert = require('chai').assert;
var expect = require('chai').expect;
var should = require('should');
var Hook = require('../lib/').Hook;
var TallyHook = require('../libtest/common.js').TallyHook;
var DelayableHook = require('../libtest/common.js').DelayableHook;

describe('Tests in ' + __filename, function () {

  describe('Hook functionality test', function () {
    it('Hook methods all fire', function () {
      var obj = {
        preTally: 0,
        exeTally: 0,
        postTally: 0
      };
      var hook = new TallyHook({ name: 'tallyHook' });
      var hookA = new TallyHook({ name: 'tallyHookA' });
      var hookB = new TallyHook({ name: 'tallyHookB' });
      hook.setHook(hookA).setHook(hookB);
      return hook.process(obj).then(function (obj) {
        obj.should.have.property('preTally', 3);
        obj.should.have.property('exeTally', 3);
        obj.should.have.property('postTally', 3);
      }).catch(function (reason) {
        console.dir(reason);
      });
    });
  });
});