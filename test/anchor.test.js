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
    let obj = {};
    const anchor = new Anchor();
    const hookA = new TallyHook();

    anchor.hooks.push(hookA);
    anchor.hooks.push(hookA);
    anchor.hooks.push(hookA);
    anchor.setHook(hookA);
    anchor.process(obj)

    obj.should.have.property('preTally', 4);
    obj.should.have.property('postTally', 4);
  });
});
