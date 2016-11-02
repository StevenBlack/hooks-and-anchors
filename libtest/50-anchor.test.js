'use strict';

var assert = require('chai').assert;
var expect = require('chai').expect;
var should = require('should');
var Anchor = require('../lib/').Anchor;
var Hook = require('../lib/').Hook;
var TallyHook = require('./common.js').TallyHook;

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
    var hookA = new TallyHook();
    var hookB = new TallyHook();
    var hookC = new TallyHook();
    var hookD = new TallyHook();
    var hookE = new TallyHook();

    anchor.hooks.push(hookA);
    anchor.hooks.push(hookB);
    anchor.hooks.push(hookC);
    anchor.setHook(hookD);
    anchor.setHook(hookE);

    var promise = anchor.process(testObj);
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