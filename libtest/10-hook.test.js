'use strict';

var assert = require('chai').assert;
var expect = require('chai').expect;
var should = require('should');
var Hook = require('../lib/').Hook;
var TallyHook = require('./common.js').TallyHook;
var DelayableHook = require('./common.js').DelayableHook;

describe('Hook standalone functionality', function () {
  it('hook default name is "Hook"', function () {
    var hook = new Hook();
    hook.should.have.property('name', 'Hook');
  });

  it('hook has assigned name', function () {
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
    var hook = new Hook();
    var hook2 = new Hook();
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
    var hook = new Hook();
    var hook2 = new Hook();
    hook.setHook(hook2);
    expect(hook.isHook(hook.hook)).to.equal(true);
  });
});

describe('Hook functionality test', function () {
  it('Hook methods all fire', function () {
    var obj = {
      preTally: 0,
      postTally: 0
    };
    var hook = new TallyHook();
    var hookA = new TallyHook();
    var hookB = new TallyHook();
    hook.setHook(hookA).setHook(hookB);
    var promise = hook.process(obj);
    promise.should.be.a.Promise();

    promise.then(function (obj) {
      obj.should.have.property('preTally', 3);
    });

    promise.then(function (obj) {
      obj.should.have.property('postTally', 3);
    });

    promise.catch(function (reason) {
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

describe('Hook execution sequence', function () {
  it('is as expected', function () {
    var hook1 = new DelayableHook();
    var hook2 = new DelayableHook();
    hook1.setHook(hook2);
    var thing = {};

    var p = hook1.process(thing);

    p.then(function () {
      console.log('Done!');console.dir(thing);console.log(new Date());
    }).catch(function (err) {
      console.dir(err);
    });
  });
});