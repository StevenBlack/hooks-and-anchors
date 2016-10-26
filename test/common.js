'use strict';

const hookModule = require("../src/");
class TallyHook extends hookModule.Hook {
  preProcess(thing) {
    thing.preTally = thing.preTally ? thing.preTally + 1 : 1;
    return true;
  }

  postProcess(thing) {
    thing.postTally = thing.postTally ? thing.postTally + 1 : 1;
  }
}

module.exports = {
  TallyHook
};
