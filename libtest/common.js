'use strict';

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var debug = require('debug')('HNA');
var Hook = require("../src/").Hook;

var TallyHook = function (_Hook) {
  _inherits(TallyHook, _Hook);

  function TallyHook() {
    _classCallCheck(this, TallyHook);

    return _possibleConstructorReturn(this, (TallyHook.__proto__ || Object.getPrototypeOf(TallyHook)).apply(this, arguments));
  }

  _createClass(TallyHook, [{
    key: 'preProcess',
    value: function preProcess(thing, resolve, reject) {
      setTimeout(this.promiseTimeout, 2000, thing, this.name, resolve, reject);
    }
  }, {
    key: 'promiseTimeout',
    value: function promiseTimeout(thing, name, resolve, reject) {
      debug('Hook ' + name + ' - preProcess() xxxxx');
      resolve(thing);
    }
  }, {
    key: 'execute',
    value: function execute(thing, resolve, reject) {
      debug('Hook ' + this.name + ' - execute()');
      setTimeout(this.randomTimeProcess.bind(this, thing, resolve, 'exe'), Math.random() * 1000);
    }
  }, {
    key: 'postProcess',
    value: function postProcess(thing, resolve, reject) {
      debug('Hook ' + this.name + ' - postProcess()');
      setTimeout(this.randomTimeProcess.bind(this, thing, resolve, 'post'), Math.random() * 1000);
    }
  }, {
    key: 'randomTimeProcess',
    value: function randomTimeProcess(thing, resolve, stage) {
      thing[stage + 'Tally'] = thing[stage + 'Tally'] || 0;
      thing[stage + 'Tally'] = thing[stage + 'Tally'] + 1;
      debug(this.name + ' ' + stage + ' ' + thing[stage + 'Tally']);
      resolve(thing);
    }
  }]);

  return TallyHook;
}(Hook);

var DelayableHook = function (_Hook2) {
  _inherits(DelayableHook, _Hook2);

  function DelayableHook(options) {
    _classCallCheck(this, DelayableHook);

    var _this2 = _possibleConstructorReturn(this, (DelayableHook.__proto__ || Object.getPrototypeOf(DelayableHook)).call(this, options));

    _this2.depth = 0;
    return _this2;
  }

  _createClass(DelayableHook, [{
    key: 'setHook',
    value: function setHook(hook) {
      if (this.isHook(hook)) {
        hook.depth = hook.depth + 1;
      }
      _get(DelayableHook.prototype.__proto__ || Object.getPrototypeOf(DelayableHook.prototype), 'setHook', this).call(this, hook);
    }
  }, {
    key: 'preProcess',
    value: function preProcess(thing) {
      debug('Hook ' + this.name + ' - preProcess()');
      thing[this.name] = thing[this.name] || [];
      this.delay(this.settings.preprocess || 500, "preProcess");
      return true;
    }
  }, {
    key: 'execute',
    value: function execute(thing) {
      debug('Hook ' + this.name + ' - execute()');
      this.delay(this.settings.execute || 200, "execute");
    }
  }, {
    key: 'postProcess',
    value: function postProcess(thing) {
      debug('Hook ' + this.name + ' - postProcess()');
      this.delay(this.settings.postprocess || 100, "postProcess");
    }
  }, {
    key: 'delay',
    value: function delay(ms, str) {
      var _this3 = this;

      var ctr,
          rej,
          p = new Promise(function (resolve, reject) {
        ctr = setTimeout(function () {
          thing[_this3.name].push('Hook ' + _this3.depth + ' ' + str);
          done();
        }, ms);
        rej = reject;
      });

      p.cancel = function () {
        clearTimeout(ctr);rej(Error("Cancelled"));
      };
      return p;
    }
  }]);

  return DelayableHook;
}(Hook);

module.exports = {
  TallyHook: TallyHook,
  DelayableHook: DelayableHook
};