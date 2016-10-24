const assert = require('chai').assert;
const expect = require('chai').expect;
const Anchor = require('../src/').Anchor;
const TallyHook = require('./common.js').TallyHook;

describe('Anchor standalone functionality', function(){
  it('anchor default name is "Anchor"', function(){
    const anchor = new Anchor();
    expect(anchor.name).to.equal('Anchor');
  });

  it('anchor has assigned name', function(){
    const anchor = new Anchor({name:'foo'});
    expect(anchor.name).to.equal('foo');
  });

  it('anchor process flags are all true', function(){
    const anchor = new Anchor();
    const f = anchor.flags;
    expect(f.execute).to.equal(true);
    expect(f.hook).to.equal(true);
    expect(f.postProcess).to.equal(true);
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

    expect(obj.preTally).to.equal(4);
    expect(obj.postTally).to.equal(4);
  });
});
