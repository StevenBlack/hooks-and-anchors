'use strict';

class Hook {
  constructor(options) {
    options = options || {};
    this.name = options.name ? options.name : 'Hook';
    this.flags = {
      execute: true,
      hook: true,
      postProcess: true
    };
    this.defaults = {};
    this.hook = undefined;
    this.settings = options;
  }

  execute(thing) {}

  process(thing) {
    this.setFlags(true);
    if (this.preProcess(thing)) {
      if (this.flags.execute) {
        this.execute(thing);
      }
    }
    if (this.flags.hook && this.isHook(this.hook)) {
      this.hook.process(thing);
    }
    if (this.flags.postProcess) {
      this.postProcess(thing);
    }
  }

  preProcess(thing) {
    return true;
  }

  postProcess(thing) {}

  setHook(hook) {
    if (this.isHook(this.hook)) {
      this.hook.setHook(hook);
    } else {
      this.hook = hook;
    }

    return hook;
  }

  setFlags(flag = true) {
    for (const key in this.flags) {
      this.flags[key] = flag;
    }
  }

  isHook(hook) {
    const type = typeof hook;
    return hook !== null && (type === 'object' || type === 'function') && ('hook' in hook);
  }
}

class Anchor extends Hook {
  constructor(options) {
    options = options || {};
    super(options);
    this.name = options.name ? options.name : 'Anchor';
    this.hooks = [];
  }

  process(thing) {
    this.setFlags(true);
    if (this.preProcess(thing)) {
      if (this.flags.execute) {
        this.execute(thing);
      }
    }
    if (this.flags.hook && this.isHook(this.hook)) {
      this.hook.process(thing);
      this.hooks.forEach( function(hook){
        hook.process(thing);
      });
    }
    if (this.flags.postProcess) {
      this.postProcess(thing);
    }
  }
}

module.exports = {
  Hook,
  Anchor
};
