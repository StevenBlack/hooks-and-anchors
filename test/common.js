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
    super(options)
  }

  preProcess() {
    this.delay( this.settings.preprocess || 500, "preProcess");
    return true
  }

  execute() {
    this.delay(this.settings.execute || 200, "execute");
  }

  postProcess() {
    this.delay(this.settings.postprocess || 100, "postProcess");
  }


  delay(ms, str){
    var ctr, rej, p = new Promise((resolve, reject) => {
        ctr = setTimeout(() => {
          console.log( `delayed ${str} by ${ms}ms`)
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
