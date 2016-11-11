'use strict';

var assert = require('chai').assert;
var expect = require('chai').expect;
var should = require('should');
var Hook = require('../lib/').Hook;
var TallyHook = require('../libtest/common.js').TallyHook;
var DelayableHook = require('../libtest/common.js').DelayableHook;

describe('Tests in ' + __filename, function () {
  describe('Hook standalone functionality', function () {
    it('hook default name is "Hook"', function () {
      var hook = new Hook();
      hook.should.have.property('name', 'Hook');
    });

    it('hook has assigned name \'foo\'', function () {
      var hook = new Hook({ name: 'foo' });
      hook.should.have.property('name', 'foo');
    });

    it('Hook process flags are all true', function () {
      var hook = new Hook();
      var flags = hook.flags;
      flags.should.have.property('execute', true);
      flags.should.have.property('hook', true);
      flags.should.have.property('postProcess', true);
    });

    it('Hook.setFlags() cascades', function () {
      var hook = new Hook({ name: 'hook' });
      var hook2 = new Hook({ name: 'hook2' });
      hook.setHook(hook2);
      // set all flags false
      hook.setFlags(false);

      var flags = hook.flags;
      flags.should.have.property('execute', false);
      flags.should.have.property('hook', false);
      flags.should.have.property('postProcess', false);

      flags = hook2.flags;
      flags.should.have.property('execute', false);
      flags.should.have.property('hook', false);
      flags.should.have.property('postProcess', false);
    });

    it('Hook added by setHook method', function () {
      var hook = new Hook({ name: 'hook' });
      var hook2 = new Hook({ name: 'hook2' });
      hook.setHook(hook2);
      expect(hook.isHook(hook.hook)).to.equal(true);
    });
  });

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

  describe('Class instance from string', function () {
    it('creates instance as expected', function () {
      var myString = "../test/myclass";
      var hook = new Hook();
      var obj = hook.classInstanceFromString(myString);
      obj.should.have.property('name', 'MyClass');
      var temp = require(myString);
      obj.should.be.instanceof(temp, 'The object should be of the extpected instanceOf.');
      obj = hook.classInstanceFromString(myString, { 'name': 'foo' });
      obj.should.have.property('name', 'foo');
    });
  });

  describe('Passing a class name to setHook()', function () {
    it('creates instance as expected', function () {
      var myString = "../test/myhookclass";
      var hook = new Hook();
      var obj = hook.setHook(myString);
      expect(hook.isHook(obj)).to.equal(true);
      obj.should.have.property('name', 'Hook');
    });
  });

  describe('Passing a class name to and options to setHook()', function () {
    it('creates instance named foo, as expected', function () {
      var myString = "../test/myhookclass";
      var hook = new Hook();
      var obj = hook.setHook(myString, { name: 'foo' });
      expect(hook.isHook(obj)).to.equal(true);
      obj.should.have.property('name', 'foo');
    });
  });
});