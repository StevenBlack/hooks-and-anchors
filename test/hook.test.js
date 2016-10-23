const assert = require('chai').assert;
const expect = require("chai").expect;
const hookModule = require("../");

describe('Hook standalone functionality', function(){
  it("hook default name is 'Hook'", function(){
    const hook= new hookModule.Hook();
    expect(hook.name).to.equal("Hook");
  });

  it("hook has assigned name", function(){
    const hook= new hookModule.Hook({name:"foo"});
    expect(hook.name).to.equal("foo");
  });

  it("Hook process flags are all true", function(){
    const hook= new hookModule.Hook();
    const f = hook.flags;
    expect(f.execute).to.equal(true);
    expect(f.hook).to.equal(true);
    expect(f.postProcess).to.equal(true);
  });

  it("Hook added by setHook method", function(){
    const hook= new hookModule.Hook();
    const hook2= new hookModule.Hook();
    hook.setHook(hook2);
    expect(hook.isHook(hook.hook)).to.equal(true);
  });
});

describe('Hook chain functionality', function(){
  class TallyHook extends hookModule.Hook {
    preProcess(thing) {
      thing.preTally = thing.preTally ? thing.preTally + 1 : 1;
      return true;
    }

    postProcess(thing) {
      thing.postTally = thing.postTally ? thing.postTally + 1 : 1;
    }
  }

  it("Hook methods all fire", function(){
    let obj = {};
    const hook= new hookModule.Hook();
    const hookA= new TallyHook();
    const hookB= new TallyHook();
    hook.setHook(hookA).setHook(hookB);
    hook.process(obj);

    expect(obj.preTally).to.equal(2);
    expect(obj.postTally).to.equal(2);
  });
});

