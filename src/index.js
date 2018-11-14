'use strict';

const debug = require('debug')('HNA');
class Hook {
  constructor(options = {}) {
    // native properties of all hooks
    this.name = options.name || 'Hook';
    this.settings = {};
    this.hook = undefined;
    this.flags = {
      execute: true,
      hook: true,
      postProcess: true
    };

    // reckon the settings
    this.defaults = {'name': 'Hook'};
    Object.assign(this.settings, this.defaults, options);
    this.selfConfig();
  }

  selfConfig() {
    debug(`Hook ${this.name} - selfConfig()`);
    if (this.settings.name) {
      this.name = this.settings.name;
    }
  }

  process(thing) {
    debug(`Hook ${this.name} - process()`);
    // set all flags to signal go!
    this.setFlags(true);

    const implementation = (thing2) => {
      const postProc = [],
        proc = [];
      this.loadP(proc, postProc);

      let prom = proc.shift()(thing2);
      proc.forEach((func) => {
        prom = prom.then(() => func(thing2));
      });
      postProc.forEach((func) => {
        prom = prom.then(() => func(thing2));
      });

      return prom;
    };

    return implementation(thing).
      catch((err) => {
        console.log(err);
      });
  }

  _preProcess(thing) {
    debug(`Hook ${this.name} - _preProcess()`);

    return new Promise((resolve, reject) => {
      try {
        this.preProcess(thing, resolve, reject);
      } catch (err) {
        console.log(err);
        reject(err);
      }
    });
  }

  _execute(thing) {
    debug(`Hook ${this.name} - _execute()`);
    if (this.flags.execute) {
      return new Promise((resolve, reject) => {
        try {
          this.execute(thing, resolve, reject);
        } catch (err) {
          reject(err);
        }
      });
    }

    return Promise.resolve(thing);
  }

  _postProcess(thing) {
    debug(`Hook ${this.name} - _postProcess()`);
    if (this.flags.postProcess) {
      return new Promise((resolve, reject) => {
        try {
          this.postProcess(thing, resolve, reject);
        } catch (err) {
          reject(err);
        }
      });
    }

    return Promise.resolve(thing);
  }

  // just template methods here.
  preProcess(thing, resolve, reject) {
    debug(`Hook ${this.name} - preProcess()`);
    resolve(thing);
  }

  execute(thing, resolve, reject) {
    debug(`Hook ${this.name} - execute()`);
    resolve(thing);
  }

  postProcess(thing, resolve, reject) {
    debug(`Hook ${this.name} - postProcess()`);
    resolve(thing);
  }

  setHook(hook, ...otherArgs) {
    debug(`Hook ${this.name} - setHook()`);
    // append a hook to the hook chain.
    if (this.isHook(this.hook)) {
      this.hook.setHook(hook, ...otherArgs);
    } else {
      // hook could be a package name
      if (typeof hook === 'string') {
        return this.setHook(this.classInstanceFromString(hook, ...otherArgs));
      }
      // only allow hooks as hooks
      if (this.isHook(hook)) {
        this.hook = hook;
      }
    }

    return hook;
  }

  setFlags(flag = true) {
    debug(`Hook ${this.name} - setFlags() with ${flag}`);
    for (const key in this.flags) {
      this.flags[key] = flag;
    }
    // setFlags down the hook chain
    if (this.isHook(this.hook)) {
      this.hook.setFlags(flag);
    }
  }

  isHook(hook) {
    const type = typeof hook;

    return hook !== null && (type === 'object' || type === 'function') && ('hook' in hook);
  }

  classInstanceFromString(packageLocation, ...otherArgs) {
    const Temp = require(packageLocation);

    return new Temp(...otherArgs);
  }

  loadP(proc, postProc) {
    debug(`Hook ${this.name} - loadP()`);
    proc.push(this._preProcess.bind(this));
    proc.push(this._execute.bind(this));

    if (this.isHook(this.hook)) {
      postProc.unshift(this._postProcess.bind(this));
    } else {
      proc.push(this._postProcess.bind(this));
    }

    // go down the hook chain.
    if (this.isHook(this.hook)) {
      this.hook.loadP(proc, postProc);
    }
  }
}

class Anchor extends Hook {
  constructor(options = {}) {
    options.name = options.name || 'Anchor';
    super(options);
    // anchors have this additional hooks array and flag
    this.hooks = [];
    this.flags.hooks = true;
  }

  loadP(proc = [], postProc = []) {
    debug(`Hook ${this.name} - loadP()`);
    proc.push(this._preProcess.bind(this));
    proc.push(this._execute.bind(this));

    // go down the hook chain.
    if (this.isHook(this.hook)) {
      this.hook.loadP(proc, postProc);
    }

    // close out the hook chain
    while (postProc.length > 0) {
      proc.push(postProc.pop());
    }

    // iterate the hooks collection
    this.hooks.forEach((hook) => {
      if (this.isHook(hook)) {
        hook.loadP(proc, postProc);
      }
    });

    // close out the hook collection
    while (postProc.length > 0) {
      proc.push(postProc.pop());
    }

    // finally, this' postProcess
    proc.push(this._postProcess.bind(this));

  }

  setFlags(flag = true) {
    super.setFlags(flag);

    this.hooks.forEach((hook) => {
      // setFlags through the collection
      if (this.isHook(hook)) {
        hook.setFlags(flag);
      }
    });
  }
}

module.exports = {
  Hook,
  Anchor
};
