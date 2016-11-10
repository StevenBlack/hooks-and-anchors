'use strict';

var Hook = require('../libtest/common.js').TallyHook;
var Anchor = require('../src').Anchor;

var a1 = new Anchor({ 'name': 'a1' });
var h1 = new Hook({ 'name': 'h1' });
var h2 = new Hook({ 'name': 'h2' });
var h3 = new Hook({ 'name': 'h3' });
var h4 = new Hook({ 'name': 'h4' });
var h5 = new Hook({ 'name': 'h5' });

h1.setHook(h2).setHook(h3);

a1.setHook(h1);
a1.hooks.push(h4);
a1.hooks.push(h5);

var obj = {
  preTally: 0,
  postTally: 0,
  exeTally: 0
};
var bar = a1.process(obj);

bar.then(function () {
  console.dir(obj);
});