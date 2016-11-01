"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MyClass = function MyClass() {
	var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

	_classCallCheck(this, MyClass);

	this.name = options.name || "MyClass";
};

exports.default = MyClass;
module.exports = exports["default"];