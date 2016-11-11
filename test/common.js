'use strict';

const debug = require('debug')('HNA');
const Hook = require("../src/").Hook;

class TallyHook extends Hook {

  preProcess(thing, resolve, reject)  {
    setTimeout( this.promiseTimeout, 2000, thing, this.name, resolve, reject);
  }

  promiseTimeout(thing, name, resolve, reject) {
    debug(`Hook ${name} - preProcess() xxxxx`);
    resolve(thing);
  }

  execute(thing, resolve, reject)  {
    debug(`Hook ${this.name} - execute()`);
    setTimeout(this.randomTimeProcess.bind(this, thing, resolve, 'exe'), Math.random()*1000)
  }

  postProcess(thing, resolve, reject) {
    debug(`Hook ${this.name} - postProcess()`);
    setTimeout(this.randomTimeProcess.bind(this, thing, resolve, 'post'), Math.random()*1000)
  }

  randomTimeProcess(thing, resolve, stage) {
    thing[stage + 'Tally'] = thing[stage + 'Tally'] || 0;
    thing[stage + 'Tally'] = thing[stage + 'Tally'] + 1;
    debug(`${this.name} ${stage} ${thing[stage + 'Tally']}`);
    resolve(thing);
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
    debug(`Hook ${this.name} - preProcess()`);
    thing[this.name] = thing[this.name] || [];
    this.delay( this.settings.preprocess || 500, "preProcess");
    return true
  }

  execute(thing) {
    debug(`Hook ${this.name} - execute()`);
    this.delay(this.settings.execute || 200, "execute");
  }

  postProcess(thing) {
    debug(`Hook ${this.name} - postProcess()`);
    this.delay(this.settings.postprocess || 100, "postProcess");
  }


  delay(ms, str){
    var ctr, rej, p = new Promise((resolve, reject) => {
        ctr = setTimeout(() => {
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
