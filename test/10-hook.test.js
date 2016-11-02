'use strict';

const assert = require('chai').assert;
const expect = require('chai').expect;
const should = require('should');
const Hook = require('../lib/').Hook;
const TallyHook = require('./common.js').TallyHook;
const DelayableHook = require('./common.js').DelayableHook;

describe('Hook standalone functionality', () => {
  it('hook default name is "Hook"', () => {
    const hook = new Hook();
    hook.should.have.property('name', 'Hook');
  });

  it('hook has assigned name', () => {
    const hook = new Hook({name: 'foo'});
    hook.should.have.property('name', 'foo');
  });

  it('Hook process flags are all true', () => {
    const hook = new Hook();
    const flags = hook.flags;
    flags.should.have.property('execute', true);
    flags.should.have.property('hook', true);
    flags.should.have.property('postProcess', true);
  });

  it('Hook.setFlags() cascades', () => {
    const hook = new Hook();
    const hook2 = new Hook();
    hook.setHook(hook2);
    // set all flags false
    hook.setFlags(false);

    let flags = hook.flags;
    flags.should.have.property('execute', false);
    flags.should.have.property('hook', false);
    flags.should.have.property('postProcess', false);

    flags = hook2.flags;
    flags.should.have.property('execute', false);
    flags.should.have.property('hook', false);
    flags.should.have.property('postProcess', false);
  });

  it('Hook added by setHook method', () => {
    const hook = new Hook();
    const hook2 = new Hook();
    hook.setHook(hook2);
    expect(hook.isHook(hook.hook)).to.equal(true);
  });
});

describe('Hook functionality test', () => {
  it('Hook methods all fire', () => {
    let obj = {
      preTally: 0,
      postTally: 0
    };
    const hook = new TallyHook();
    const hookA = new TallyHook();
    const hookB = new TallyHook();
    hook.setHook(hookA).setHook(hookB);
    const promise = hook.process(obj);
    promise.should.be.a.Promise();

    promise.then((obj) => {
      obj.should.have.property('preTally', 3)
    });

    promise.then((obj) => {
      obj.should.have.property('postTally', 3)
    });

    promise.catch((reason) => {console.dir(reason);} )
  });
});

describe('Class instance from string', () => {
  it('creates instance as expected', () => {
    const myString = "../test/myclass";
    const hook = new Hook();
    let obj = hook.classInstanceFromString(myString);
    obj.should.have.property('name', 'MyClass');
    const temp = require(myString);
    obj.should.be.instanceof(temp, 'The object should be of the extpected instanceOf.');
    obj = hook.classInstanceFromString(myString, {'name': 'foo'});
    obj.should.have.property('name', 'foo');
  });
});

describe('Passing a class name to setHook()', () => {
  it('creates instance as expected', () => {
    const myString = "../test/myhookclass";
    const hook = new Hook();
    let obj= hook.setHook(myString)
    expect(hook.isHook(obj)).to.equal(true);
    obj.should.have.property('name', 'Hook');
  });
});

describe('Hook execution sequence', () => {
  it('is as expected', () => {
    const hook1 = new DelayableHook();
    const hook2 = new DelayableHook();
    hook1.setHook(hook2);
    let thing = {};

    let p = hook1.process(thing);

    p.then(() => {console.log('Done!');console.dir(thing);console.log(new Date());})
    .catch((err) =>{
      console.dir(err);
    });
  });
});
