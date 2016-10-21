'use strict';

class Hook {
  constructor(options) {
    this.defaults = {};
    this.hook = undefined;
    this.settings = options;
  }
  execute(thing) {
    console.dir(thing);
  }
  process(thing) {
    if (this.preProcess(thing)) {
      this.execute(thing);
      this.postProcess(thing);
    }
  }
  preProcess() {}
  postProcess() {}
  setHook(hook) {
    if (this.isHook(this.hook)) {
      this.hook.setHook(hook);
    } else {
      this.hook = hook;
    }
    return hook;
  }

  isHook(hook) {
    const type = typeof hook;
    return hook !== null && (type === 'object' || type === 'function') && ('hook' in hook);
  }
}

class Anchor extends Hook {
  constructor(options) {
    super(options);
    this.hooks = [];
  }
}

module.exports = {
  Hook,
  Anchor
};
