'use strict';

class Hook {
  constructor(options) {
    this.name = options ? (options.name ? options.name : 'Hook') : 'Hook';
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

  postProcess() {}

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
    super(options);
    this.name = options.name || 'HookAnchor';
    this.hooks = [];
  }
}

module.exports = {
  Hook,
  Anchor
};
