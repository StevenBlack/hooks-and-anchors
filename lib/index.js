'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Hook = function () {
  function Hook(options) {
    _classCallCheck(this, Hook);

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

  _createClass(Hook, [{
    key: 'execute',
    value: function execute(thing) {}
  }, {
    key: 'process',
    value: function process(thing) {
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
  }, {
    key: 'preProcess',
    value: function preProcess(thing) {
      return true;
    }
  }, {
    key: 'postProcess',
    value: function postProcess(thing) {}
  }, {
    key: 'setHook',
    value: function setHook(hook) {
      if (this.isHook(this.hook)) {
        this.hook.setHook(hook);
      } else {
        this.hook = hook;
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
  }]);

  return Hook;
}();

var Anchor = function (_Hook) {
  _inherits(Anchor, _Hook);

  function Anchor(options) {
    _classCallCheck(this, Anchor);

    options = options || {};

    var _this = _possibleConstructorReturn(this, (Anchor.__proto__ || Object.getPrototypeOf(Anchor)).call(this, options));

    _this.name = options.name ? options.name : 'Anchor';
    _this.hooks = [];
    return _this;
  }

  _createClass(Anchor, [{
    key: 'process',
    value: function process(thing) {
      this.setFlags(true);
      if (this.preProcess(thing)) {
        if (this.flags.execute) {
          this.execute(thing);
        }
      }
      if (this.flags.hook && this.isHook(this.hook)) {
        this.hook.process(thing);
        this.hooks.forEach(function (hook) {
          return hook.process(thing);
        });
      }
      if (this.flags.postProcess) {
        this.postProcess(thing);
      }
    }
  }]);

  return Anchor;
}(Hook);

module.exports = {
  Hook: Hook,
  Anchor: Anchor
};