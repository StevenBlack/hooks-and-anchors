'use strict';

const assert = require('chai').assert;
const expect = require('chai').expect;
const should = require('should');
const Hook = require('../src/').Hook;
const TallyHook = require('./common.js').TallyHook;

describe('Hook standalone functionality', function(){
  it('hook default name is "Hook"', function(){
    const hook = new Hook();
    hook.should.have.property('name', 'Hook');
  });

  it('hook has assigned name', function(){
    const hook = new Hook({name:'foo'});
    hook.should.have.property('name', 'foo');
  });

  it('Hook process flags are all true', function(){
    const hook = new Hook();
    const flags = hook.flags;
    flags.should.have.property('execute', true);
    flags.should.have.property('hook', true);
    flags.should.have.property('postProcess', true);
  });

  it('Hook added by setHook method', function(){
    const hook = new Hook();
    const hook2 = new Hook();
    hook.setHook(hook2);
    expect(hook.isHook(hook.hook)).to.equal(true);
  });
});

describe('Hook chain functionality', function(){
  it('Hook methods all fire', function(){
    let obj = {};
    const hook = new TallyHook();
    const hookA = new TallyHook();
    const hookB = new TallyHook();
    hook.setHook(hookA).setHook(hookB);
    hook.process(obj);

    obj.should.have.property('preTally', 3);
    obj.should.have.property('postTally', 3);
  });
});

describe('Class instance from string', function(){
  it('creates instance as expected', function(){
    const myString = "../test/myclass";
    const hook = new Hook();
    let obj = hook.classInstanceFromString(myString);
    obj.should.have.property('name', 'MyClass');
    const J = require(myString);
    obj.should.be.instanceof(J, 'The object should be of the extpected instanceOf.');
    obj = hook.classInstanceFromString(myString, {'name': 'foo'});
    obj.should.have.property('name', 'foo');
  });
});

describe('Passing a class name to setHook()', function(){
  it('creates instance as expected', function(){
    const myString = "../test/myhookclass";
    const hook = new Hook();
    let obj= hook.setHook(myString)
    expect(hook.isHook(obj)).to.equal(true);
    obj.should.have.property('name', 'Hook');
  });
});
