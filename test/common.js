'use strict';

const hookModule = require("../src/");
class TallyHook extends hookModule.Hook {

  preProcess(thing) {
    thing.preTally = thing.preTally + 1;
    return true;
  }

  postProcess(thing) {
    thing.postTally = thing.postTally + 1;
  }
}

class DelayableHook extends hookModule.Hook {
  constructor(options) {
    super(options);
    this.depth = 0;
  }

  setHook(hook) {
    if (this.isHook(hook)){
      hook.depth = hook.depth + 1;
    }
    super.setHook(hook);
  }

  preProcess(thing) {
    thing[this.name] = thing[this.name] || [];
    this.delay( this.settings.preprocess || 500, "preProcess");
    return true
  }

  execute(thing) {
    this.delay(this.settings.execute || 200, "execute");
  }

  postProcess(thing) {
    this.delay(this.settings.postprocess || 100, "postProcess");
  }


  delay(ms, str){
    var ctr, rej, p = new Promise((resolve, reject) => {
        console.log( `setting Hook ${this.depth} delayed ${str} by ${ms}ms`);
        ctr = setTimeout(() => {
          console.log( `delayed ${str} by ${ms}ms`)
          thing[this.name].push(`Hook ${this.depth} ${str}`)
          resolve();
          }, ms);
        rej = reject;
    });


    p.cancel = function(){ clearTimeout(ctr); rej(Error("Cancelled"))};
    return p;
  }
}


module.exports = {
  TallyHook,
  DelayableHook
};
