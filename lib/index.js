'use strict';

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var debug = require('debug')('HNA');

var Hook = function () {
  function Hook() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Hook);

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
    this.defaults = { 'name': 'Hook' };
    Object.assign(this.settings, this.defaults, options);
    this.selfConfig();
  }

  _createClass(Hook, [{
    key: 'selfConfig',
    value: function selfConfig() {
      debug('Hook ' + this.name + ' - selfConfig()');
      if (this.settings.name) {
        this.name = this.settings.name;
      }
    }
  }, {
    key: 'process',
    value: function process(thing) {
      var _this = this;

      debug('Hook ' + this.name + ' - process()');
      // set all flags to signal go!
      this.setFlags(true);

      // this function embodies the process implementation
      // as a chain of function calls
      var implementation = function implementation(thing) {
        var proc = [];
        var postProc = [];
        _this.loadP(proc, postProc);

        // Wrap our thing in a promise
        var p = Promise.resolve(thing);

        proc.forEach(function (f) {
          p.then(f(thing));
        });
        postProc.forEach(function (f) {
          p.then(f(thing));
        });
        return p;
      };

      return implementation(thing).catch(function (e) {
        console.log(e);
      });
    }
  }, {
    key: '_preProcess',
    value: function _preProcess(thing) {
      var _this2 = this;

      return function (thing) {
        debug('Hook ' + _this2.name + ' - _preProcess()');
        return new Promise(function (resolve, reject) {
          try {
            _this2.preProcess(thing, resolve, reject);
          } catch (e) {
            console.log(e);reject(e);
          }
        });
      };
    }
  }, {
    key: '_execute',
    value: function _execute(thing) {
      var _this3 = this;

      return function (thing) {
        debug('Hook ' + _this3.name + ' - _execute()');
        if (_this3.flags.execute) {
          return new Promise(function (resolve, reject) {
            try {
              _this3.execute(thing, resolve, reject);
            } catch (e) {
              reject(e);
            }
          });
        } else {
          return Promise.resolve(thing);
        }
      };
    }
  }, {
    key: '_postProcess',
    value: function _postProcess(thing) {
      var _this4 = this;

      return function (thing) {
        debug('Hook ' + _this4.name + ' - _postProcess()');
        if (_this4.flags.postProcess) {
          return new Promise(function (resolve, reject) {
            try {
              _this4.postProcess(thing, resolve, reject);
            } catch (e) {
              reject(e);
            }
          });
        } else {
          return Promise.resolve(thing);
        }
      };
    }

    // just template methods here.

  }, {
    key: 'preProcess',
    value: function preProcess(thing, resolve, reject) {
      debug('Hook ' + this.name + ' - preProcess()');
      resolve(thing);
    }
  }, {
    key: 'execute',
    value: function execute(thing, resolve, reject) {
      debug('Hook ' + this.name + ' - execute()');
      resolve(thing);
    }
  }, {
    key: 'postProcess',
    value: function postProcess(thing, resolve, reject) {
      debug('Hook ' + this.name + ' - postProcess()');
      resolve(thing);
    }
  }, {
    key: 'setHook',
    value: function setHook(hook) {
      debug('Hook ' + this.name + ' - setHook()');
      // append a hook to the hook chain.

      for (var _len = arguments.length, a = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        a[_key - 1] = arguments[_key];
      }

      if (this.isHook(this.hook)) {
        var _hook;

        (_hook = this.hook).setHook.apply(_hook, [hook].concat(a));
      } else {
        // hook could be a package name
        if (typeof hook === 'string') {
          return this.setHook(this.classInstanceFromString.apply(this, [hook].concat(a)));
        }
        // only allow hooks as hooks
        if (this.isHook(hook)) {
          this.hook = hook;
        }
      }
      return hook;
    }
  }, {
    key: 'setFlags',
    value: function setFlags() {
      var flag = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

      debug('Hook ' + this.name + ' - setFlags() with ' + flag);
      for (var key in this.flags) {
        this.flags[key] = flag;
      }
      // setFlags down the hook chain
      if (this.isHook(this.hook)) {
        this.hook.setFlags(flag);
      }
    }
  }, {
    key: 'isHook',
    value: function isHook(hook) {
      var type = typeof hook === 'undefined' ? 'undefined' : _typeof(hook);
      return hook !== null && (type === 'object' || type === 'function') && 'hook' in hook;
    }
  }, {
    key: 'classInstanceFromString',
    value: function classInstanceFromString(packageLocation) {
      var Temp = require(packageLocation);

      for (var _len2 = arguments.length, a = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        a[_key2 - 1] = arguments[_key2];
      }

      return new (Function.prototype.bind.apply(Temp, [null].concat(a)))();
    }
  }, {
    key: 'loadP',
    value: function loadP() {
      var proc = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
      var postProc = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

      debug('Hook ' + this.name + ' - loadP()');
      proc.push(this._preProcess.bind(this));
      proc.push(this._execute.bind(this));
      postProc.unshift(this._postProcess.bind(this));

      // go down the hook chain.
      if (this.isHook(this.hook)) {
        this.hook.loadP(proc, postProc);
      }
      return;
    }
  }]);

  return Hook;
}();

var Anchor = function (_Hook) {
  _inherits(Anchor, _Hook);

  function Anchor() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Anchor);

    options.name = options.name || 'Anchor';

    // anchors have this additional hooks array and flag
    var _this5 = _possibleConstructorReturn(this, (Anchor.__proto__ || Object.getPrototypeOf(Anchor)).call(this, options));

    _this5.hooks = [];
    _this5.flags.hooks = true;
    return _this5;
  }

  _createClass(Anchor, [{
    key: 'loadP',
    value: function loadP() {
      var _this6 = this;

      var proc = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
      var postProc = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

      _get(Anchor.prototype.__proto__ || Object.getPrototypeOf(Anchor.prototype), 'loadP', this).call(this, proc, postProc);

      // iterate the hooks collection
      this.hooks.forEach(function (hook) {
        if (_this6.isHook(hook)) {
          hook.loadP(proc, postProc);
        }
      });
      return;
    }
  }, {
    key: 'setFlags',
    value: function setFlags() {
      var _this7 = this;

      var flag = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

      _get(Anchor.prototype.__proto__ || Object.getPrototypeOf(Anchor.prototype), 'setFlags', this).call(this, flag);

      this.hooks.forEach(function (hook) {
        // setFlags through the collection
        if (_this7.isHook(hook)) {
          hook.setFlags(flag);
        }
      });
    }
  }]);

  return Anchor;
}(Hook);

module.exports = {
  Hook: Hook,
  Anchor: Anchor
};