'use strict';

const debug = require('debug')('HNA');
const Hook = require("../src/").Hook;

class TallyHook extends Hook {

  preProcess(thing, resolve, reject)  {
    debug(`Hook ${this.name} - PreProcess()`);
    setTimeout(this.randomTimeProcess.bind(this, thing, resolve, 'pre'), Math.random()*1000);
  }

  execute(thing, resolve, reject)  {
    debug(`Hook ${this.name} - execute()`);
    setTimeout(this.randomTimeProcess.bind(this, thing, resolve, 'exe'), Math.random()*1000);
  }

  postProcess(thing, resolve, reject) {
    debug(`Hook ${this.name} - postProcess()`);
    setTimeout(this.randomTimeProcess.bind(this, thing, resolve, 'post'), Math.random()*1000);
  }

  randomTimeProcess(thing, resolve, stage) {
    thing[stage + 'Tally'] = thing[stage + 'Tally'] || 0;
    thing[stage + 'Tally'] = thing[stage + 'Tally'] + 1;
    debug(`${this.name} ${stage} ${thing[stage + 'Tally']}`);
    resolve(thing);
  }
}

module.exports = {
  TallyHook
};
