'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Hook = function () {
  function Hook(options) {
    _classCallCheck(this, Hook);

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
    };
    Object.assign(this.settings, this.defaults, options);
    this.selfConfig();
  }

  _createClass(Hook, [{
    key: 'selfConfig',
    value: function selfConfig() {
      if (this.settings.name) {
        this.name = this.settings.name;
      }
    }
  }, {
    key: 'process',
    value: function process(thing) {
      var _this = this;

      // set all flags to signal go!
      this.setFlags(true);

      // preProcess() controls whether this hook executes
      return new Promise(function (resolve, reject) {
        return resolve(_this.preProcess(thing));
      }).then(function (preProcessResult) {
        if (preProcessResult) {
          if (_this.flags.execute) {
            return _this.execute(thing);
          }
        }
      }).then(function () {
        // down the hook chain
        if (_this.flags.hook && _this.isHook(_this.hook)) {
          return _this.hook.process(thing);
        }
      }).then(function () {
        // fire the post process as appropriate
        if (_this.flags.postProcess) {
          return _this.postProcess(thing);
        }
      });
    }
  }, {
    key: 'preProcess',
    value: function preProcess(thing) {
      return true;
    }
  }, {
    key: 'execute',
    value: function execute(thing) {}
  }, {
    key: 'postProcess',
    value: function postProcess(thing) {}
  }, {
    key: 'setHook',
    value: function setHook(hook) {
      if (this.isHook(this.hook)) {
        this.hook.setHook(hook);
      } else {
        // hook could be a package name
        if (typeof hook === 'string') {
          return this.setHook(this.classInstanceFromString(hook));
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

      for (var key in this.flags) {
        this.flags[key] = flag;
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

      for (var _len = arguments.length, a = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        a[_key - 1] = arguments[_key];
      }

      return new (Function.prototype.bind.apply(Temp, [null].concat(a)))();
    }
  }]);

  return Hook;
}();

var Anchor = function (_Hook) {
  _inherits(Anchor, _Hook);

  function Anchor(options) {
    _classCallCheck(this, Anchor);

    options = options || {};
    options.name = options.name || 'Anchor';

    var _this2 = _possibleConstructorReturn(this, (Anchor.__proto__ || Object.getPrototypeOf(Anchor)).call(this, options));

    _this2.hooks = [];
    return _this2;
  }

  _createClass(Anchor, [{
    key: 'process',
    value: function process(thing) {
      var _this3 = this;

      // set all flags to signal go!
      this.setFlags(true);

      // preProcess() controls whether this hook executes
      return new Promise(function (resolve, reject) {
        return resolve(_this3.preProcess(thing));
      }).then(function (preProcessResult) {
        if (preProcessResult) {
          if (_this3.flags.execute) {
            return _this3.execute(thing);
          }
        }
      }).then(function () {
        // down the hook chain
        if (_this3.flags.hook && _this3.isHook(_this3.hook)) {
          return _this3.hook.process(thing);
        }
      }).then(function () {
        // process the hook array
        if (_this3.flags.hook && _this3.hooks.length > 0) {
          _this3.hooks.forEach(function (hook) {
            if (_this3.isHook(hook)) {
              hook.process(thing);
            }
          });
        }
      }).then(function () {
        // fire the post process as appropriate
        if (_this3.flags.postProcess) {
          return _this3.postProcess(thing);
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