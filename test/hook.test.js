'use strict';

const assert = require('chai').assert;
const expect = require('chai').expect;
const should = require('should');
const Hook = require('../src/').Hook;
const TallyHook = require('./common.js').TallyHook;
const DelayableHook = require('./common.js').DelayableHook;

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
    let obj = {
      preTally: 0,
      postTally: 0
    };
    const hook = new TallyHook();
    const hookA = new TallyHook();
    const hookB = new TallyHook();
    hook.setHook(hookA).setHook(hookB);
    let p = new Promise((resolve,reject) => {
      resolve(hook.process(obj));
    });
    p.then(() => {
      obj.should.have.property('preTally', 3);
      obj.should.have.property('postTally', 3);
    })
    .catch((err) =>{
      console.dir(err);
    });;
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

describe('Hook execution sequence', function(){
  it('is as expected', function(){
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
