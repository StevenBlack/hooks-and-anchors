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
    // set all flags to signal go!
    this.setFlags(true);

    // preProcess() controls whether this hook executes
    return Promise.resolve(this.preProcess(thing))
      .then((preProcessResult) => {
        if (preProcessResult) {
          if (this.flags.execute) {
            return Promise.resolve(this.execute(thing));
          }
        }
        return Promise.resolve(true);
      })
      .then(() => {
        // down the hook chain
        if (this.flags.hook && this.isHook(this.hook)) {
          return Promise.resolve( this.hook.process(thing));
        }
      })
      .then(() => {
        // fire the post process as appropriate
        if (this.flags.postProcess) {
            return Promise.resolve(this.postProcess(thing));
        }
      });
  }

  preProcess(thing) {
    return Promise.resolve(true);
  }

  execute(thing) {
    return Promise.resolve();
  }

  postProcess(thing) {
    return Promise.resolve();
  }

  setHook(hook) {
    // append a hook to the hook chain.
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
    return Promise.resolve(this.preProcess(thing))
      .then((preProcessResult) => {
        if (preProcessResult) {
          if (this.flags.execute) {
            return Promise.resolve(this.execute(thing));
          }
        }
        return Promise.resolve(true);
      })
      .then(() => {
        // down the hook chain
        if (this.flags.hook && this.isHook(this.hook)) {
          return Promise.resolve( this.hook.process(thing));
        }
      })
      .then(() => {
        // process the hook array
        if(this.flags.hook && this.hooks.length > 0){
          this.hooks.forEach( (hook) => {
            if (this.isHook(hook)) {
              hook.process(thing);
            }
          });
        }
        return new Promise((resolve, reject) => {return resolve();});
      })
      .then(() => {
        // fire the post process as appropriate
        if (this.flags.postProcess) {
          return new Promise((resolve, reject) => {
            return this.postProcess(thing);
          });
        }
        Promise.resolve();
      });
  }
}

module.exports = {
  Hook,
  Anchor
};
