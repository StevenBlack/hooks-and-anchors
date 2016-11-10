'use strict';

const assert = require('chai').assert;
const expect = require('chai').expect;
const should = require('should');
const Hook = require('../lib/').Hook;
const TallyHook = require('../libtest/common.js').TallyHook;
const DelayableHook = require('../libtest/common.js').DelayableHook;

describe(`Tests in ${__filename}`, () => {
  describe('Hook standalone functionality', () => {
    it('hook default name is "Hook"', () => {
      const hook = new Hook();
      hook.should.have.property('name', 'Hook');
    });

    it(`hook has assigned name 'foo'`, () => {
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
      const hook = new Hook({name:'hook'});
      const hook2 = new Hook({name:'hook2'});
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
      const hook = new Hook({name:'hook'});
      const hook2 = new Hook({name:'hook2'});
      hook.setHook(hook2);
      expect(hook.isHook(hook.hook)).to.equal(true);
    });
  });

  describe('Hook functionality test', () => {
    it('Hook methods all fire', () => {
      let obj = {
        preTally: 0,
        exeTally: 0,
        postTally: 0
      };
      const hook = new TallyHook({name:'tallyHook'});
      const hookA = new TallyHook({name:'tallyHookA'});
      const hookB = new TallyHook({name:'tallyHookB'});
      hook.setHook(hookA).setHook(hookB);
      return hook.process(obj)
        .then((obj) => {
          obj.should.have.property('preTally', 3);
          obj.should.have.property('exeTally', 3);
          obj.should.have.property('postTally', 3);
        })
        .catch((reason) => {console.dir(reason);});
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

  describe('Passing a class name to and options to setHook()', () => {
    it('creates instance named foo, as expected', () => {
      const myString = "../test/myhookclass";
      const hook = new Hook();
      let obj= hook.setHook(myString, {name:'foo'})
      expect(hook.isHook(obj)).to.equal(true);
      obj.should.have.property('name', 'foo');
    });
  });

  describe('Hook execution sequence', () => {
    it('is as expected', () => {
      const hook1 = new DelayableHook();
      const hook2 = new DelayableHook();
      hook1.setHook(hook2);
      let thing = {};

      return hook1.process(thing)
        .then(() => {console.log('Done!');console.dir(thing);console.log(new Date());})
        .catch((err) =>{
          console.dir(err);
        });
    });
  });
});
