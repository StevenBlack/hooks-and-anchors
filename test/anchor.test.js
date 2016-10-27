'use strict';

const assert = require('chai').assert;
const expect = require('chai').expect;
const should = require('should');
const Anchor = require('../src/').Anchor;
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

  it('anchor hook added by setHook method', function(){
    const anchor = new Anchor();
    const anchor2 = new Anchor();
    anchor.setHook(anchor2);
    expect(anchor.isHook(anchor.hook)).to.equal(true);
  });
});

describe('Anchor array functionality', function(){
  it('array hook methods all fire', function(){
    let obj = {
      preTally: 0,
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

    let p = new Promise((resolve, reject) => resolve(anchor.process(obj)));
    p.then(() => {
      obj.should.have.property('preTally', 5);
      obj.should.have.property('postTally', 5);
    });
  });

});
