'use strict';

const assert = require('chai').assert;
const expect = require('chai').expect;
const should = require('should');
const Anchor = require('../lib/').Anchor;
const Hook   = require('../lib/').Hook;
const TallyHook = require('./common.js').TallyHook;

describe('Anchor standalone functionality', function(){
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
    const hookA = new TallyHook();
    const hookB = new TallyHook();
    const hookC = new TallyHook();
    const hookD = new TallyHook();
    const hookE = new TallyHook();

    anchor.hooks.push(hookA);
    anchor.hooks.push(hookB);
    anchor.hooks.push(hookC);
    anchor.setHook(hookD);
    anchor.setHook(hookE);

    let promise = anchor.process(testObj);
    promise.should.be.a.Promise();
    promise.then((testObj) => {
      should(testObj).have.property('preTally', 5);
      should(testObj).have.property('exeTally', 5);
      should(testObj).have.property('postTally', 5);
    })
    .catch((err) =>{
      console.dir(err);
    });
  });

});
