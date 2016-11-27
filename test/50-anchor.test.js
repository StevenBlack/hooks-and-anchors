'use strict';

const assert = require('chai').assert;
const expect = require('chai').expect;
const should = require('should');
const Anchor = require('../lib/').Anchor;
const Hook   = require('../lib/').Hook;
const TallyHook = require('../libtest/common.js').TallyHook;

describe(`Tests in ${__filename}`, () => {
  describe.skip('Anchor standalone functionality', function(){
    it('anchor default name is "Anchor"', function(){
      const anchor = new Anchor();
      anchor.should.have.property('name', 'Anchor');
    });

    it('anchor has assigned name', function(){
      const anchor = new Anchor({name:'foo'});
      anchor.should.have.property('name', 'foo');
    });

    it('anchor process flags are all true', function(){
      const anchor = new Anchor();
      const flags = anchor.flags;
      flags.should.have.property('execute', true);
      flags.should.have.property('hook', true);
      flags.should.have.property('postProcess', true);
    });

    it('Anchor.setFlags() cascades', () => {
      const anchor = new Anchor();
      const hook = new Hook();
      const hook2 = new Hook();
      const hook3 = new Hook();

      anchor.setHook(hook).setHook(hook2);
      anchor.hooks.push(hook3);

      // set all flags false
      anchor.setFlags(false);

      let flags = anchor.flags;
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


    it('anchor hook added by setHook method', function(){
      const anchor = new Anchor();
      const anchor2 = new Anchor();
      anchor.setHook(anchor2);
      expect(anchor.isHook(anchor.hook)).to.equal(true);
    });
  });

  describe('Anchor array functionality', function(){
    it('array hook methods all fire', function(){
      let testObj = {
        preTally: 0,
        exeTally: 0,
        postTally: 0
      };
      const anchor = new Anchor();
      const hookA = new TallyHook({name: "hookChain_1"});
      const hookB = new TallyHook({name: "hookChain_2"});
      const hookC = new TallyHook({name: "hookCollection_1"});
      const hookD = new TallyHook({name: "hookCollection_2"});
      const hookE = new TallyHook({name: "hookCollection_3"});

      anchor.setHook(hookA);
      anchor.setHook(hookB);

      anchor.hooks.push(hookC);
      anchor.hooks.push(hookD);
      anchor.hooks.push(hookE);

      return anchor.process(testObj)
        .then((testObj) => {
          should(testObj).have.property('preTally', 5);
          should(testObj).have.property('exeTally', 5);
          should(testObj).have.property('postTally', 5);
        })
        .catch((err) => {
          console.dir(err);
        });
    });
  });
});
