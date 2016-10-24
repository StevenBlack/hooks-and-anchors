const assert = require('chai').assert;
const expect = require('chai').expect;
const Hook = require('../src/').Hook;
const TallyHook = require('./common.js').TallyHook;

describe('Hook standalone functionality', function(){
  it('hook default name is "Hook"', function(){
    const hook = new Hook();
    expect(hook.name).to.equal('Hook');
  });

  it('hook has assigned name', function(){
    const hook = new Hook({name:'foo'});
    expect(hook.name).to.equal('foo');
  });

  it('Hook process flags are all true', function(){
    const hook = new Hook();
    const f = hook.flags;
    expect(f.execute).to.equal(true);
    expect(f.hook).to.equal(true);
    expect(f.postProcess).to.equal(true);
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

    expect(obj.preTally).to.equal(3);
    expect(obj.postTally).to.equal(3);
  });
});

