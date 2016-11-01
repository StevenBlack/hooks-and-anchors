'use strict';

const Hook = require("../lib/").Hook;

class TallyHook extends Hook {

  preProcess(thing, resolve, reject)  {
    setTimeout(this.randomTimeProcess.bind(this, thing, resolve, 'pre') , Math.random()*1000)
  }

  execute(thing, resolve, reject)  {
    setTimeout(this.randomTimeProcess.bind(this, thing, resolve, 'exe') , Math.random()*1000)
  }

  postProcess(thing, resolve, reject) {
    setTimeout(this.randomTimeProcess.bind(this, thing, resolve, 'post') , Math.random()*1000)
  }

  randomTimeProcess(thing, resolve, stage) {
    thing[stage + 'Tally'] = thing[stage + 'Tally'] || 0;
    thing[stage + 'Tally'] = thing[stage + 'Tally'] + 1;
    console.log(`${this.name} ${stage} ${thing[stage + 'Tally']}`);
    resolve(thing);
    return thing;
  }
}

class DelayableHook extends Hook {
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
    console.log(`executing Hook depth ${this.depth}`);
    this.delay(this.settings.execute || 200, "execute");
  }

  postProcess(thing) {
    this.delay(this.settings.postprocess || 100, "postProcess");
  }


  delay(ms, str){
    var ctr, rej, p = new Promise((resolve, reject) => {
        // console.log( `setting Hook depth ${this.depth} delayed ${str} by ${ms}ms ` + new Date());
        ctr = setTimeout(() => {
          console.log( `delayed ${str} by ${ms}ms`)
          thing[this.name].push(`Hook ${this.depth} ${str}`)
          done();
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
