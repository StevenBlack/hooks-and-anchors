'use strict';

var assert = require('chai').assert;
var expect = require('chai').expect;
var should = require('should');
var Anchor = require('../lib/').Anchor;
var Hook = require('../lib/').Hook;
var TallyHook = require('../libtest/common.js').TallyHook;

describe('Tests in ' + __filename, function () {
  describe('Anchor standalone functionality', function () {
    it('anchor default name is "Anchor"', function () {
      var anchor = new Anchor();
      anchor.should.have.property('name', 'Anchor');
    });

    it('anchor has assigned name', function () {
      var anchor = new Anchor({ name: 'foo' });
      anchor.should.have.property('name', 'foo');
    });

    it('anchor process flags are all true', function () {
      var anchor = new Anchor();
      var flags = anchor.flags;
      flags.should.have.property('execute', true);
      flags.should.have.property('hook', true);
      flags.should.have.property('postProcess', true);
    });

    it('Anchor.setFlags() cascades', function () {
      var anchor = new Anchor();
      var hook = new Hook();
      var hook2 = new Hook();
      var hook3 = new Hook();

      anchor.setHook(hook).setHook(hook2);
      anchor.hooks.push(hook3);

      // set all flags false
      anchor.setFlags(false);

      var flags = anchor.flags;
      flags.should.have.property('execute', false);
      flags.should.have.property('hook', false);
      flags.should.have.property('postProcess', false);

      flags = hook.flags;
      flags.should.have.property('execute', false);
      flags.should.have.property('hook', false);
      flags.should.have.property('postProcess', false);

      flags = hook2.flags;
      flags.should.have.property('execute', false);
      flags.should.have.property('hook', false);
      flags.should.have.property('postProcess', false);

      flags = anchor.hooks[0].flags;
      flags.should.have.property('execute', false);
      flags.should.have.property('hook', false);
      flags.should.have.property('postProcess', false);
    });

    it('anchor hook added by setHook method', function () {
      var anchor = new Anchor();
      var anchor2 = new Anchor();
      anchor.setHook(anchor2);
      expect(anchor.isHook(anchor.hook)).to.equal(true);
    });
  });

  describe('Anchor array functionality', function () {
    it('array hook methods all fire', function () {
      var testObj = {
        preTally: 0,
        exeTally: 0,
        postTally: 0
      };
      var anchor = new Anchor();
      var hookA = new TallyHook({ name: "hookChain_1" });
      var hookB = new TallyHook({ name: "hookChain_2" });
      var hookC = new TallyHook({ name: "hookCollection_1" });
      var hookD = new TallyHook({ name: "hookCollection_2" });
      var hookE = new TallyHook({ name: "hookCollection_3" });

      anchor.setHook(hookA);
      anchor.setHook(hookB);

      anchor.hooks.push(hookC);
      anchor.hooks.push(hookD);
      anchor.hooks.push(hookE);

      return anchor.process(testObj).then(function (testObj) {
        should(testObj).have.property('preTally', 5);
        should(testObj).have.property('exeTally', 5);
        should(testObj).have.property('postTally', 5);
      }).catch(function (err) {
        console.dir(err);
      });
    });
  });
});