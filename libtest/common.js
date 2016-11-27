'use strict';

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
      debug('Hook ' + this.name + ' - PreProcess()');
      setTimeout(this.randomTimeProcess.bind(this, thing, resolve, 'pre'), Math.random() * 400);
    }
  }, {
    key: 'execute',
    value: function execute(thing, resolve, reject) {
      debug('Hook ' + this.name + ' - execute()');
      setTimeout(this.randomTimeProcess.bind(this, thing, resolve, 'exe'), Math.random() * 400);
    }
  }, {
    key: 'postProcess',
    value: function postProcess(thing, resolve, reject) {
      debug('Hook ' + this.name + ' - postProcess()');
      setTimeout(this.randomTimeProcess.bind(this, thing, resolve, 'post'), Math.random() * 400);
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

module.exports = {
  TallyHook: TallyHook
};