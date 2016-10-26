'use strict';

class Hook {
  constructor(options) {
    // native properties of all hooks
    options = options || {};
    this.name = options.name || 'Hook';
    this.settings = {};
    this.hook = undefined;
    this.flags = {
      execute: true,
      hook: true,
      postProcess: true
    };

    // reckon the settings
    this.defaults = {
      'name': 'Hook'
    }
    Object.assign(this.settings, this.defaults, options);
    this.selfConfig();
  }

  selfConfig() {
    if(this.settings.name) {
      this.name = this.settings.name;
    }
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
    }
    if (this.flags.postProcess) {
      this.postProcess(thing);
    }
  }

  preProcess(thing) {
    return true;
  }

  execute(thing) {}

  postProcess(thing) {}

  setHook(hook) {
    if (this.isHook(this.hook)) {
      this.hook.setHook(hook);
    } else {
      // hook could be a package name
      if(typeof hook === 'string' ) {
        return this.setHook(this.classInstanceFromString(hook));
      }
      // only allow hooks as hooks
      if (this.isHook(hook)) {
        this.hook = hook;
      }
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

  classInstanceFromString(packageLocation, ...a) {
    const Temp = require(packageLocation);
    return new Temp(...a);
  }
}

class Anchor extends Hook {
  constructor(options) {
    options = options || {};
    options.name = options.name || 'Anchor';
    super(options);
    this.hooks = [];
  }

  process(thing) {
    // set all flags to signal go!
    this.setFlags(true);

    // preProcess() controls whether this hook executes
    if (this.preProcess(thing)) {
      if (this.flags.execute) {
        this.execute(thing);
      }
    }

    // process the hook chain next
    if (this.flags.hook && this.isHook(this.hook)) {
      this.hook.process(thing);
    }

    // finally process the hook array
    if(this.flags.hook && this.hooks.length > 0){
      this.hooks.forEach( (hook) => {
        if (this.isHook(hook)) {
          hook.process(thing);
        }
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
