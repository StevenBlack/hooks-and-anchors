'use strict';

const Hook = require('../libtest/common.js').TallyHook;
const Anchor = require('../src').Anchor;

const a1 = new Anchor({'name': 'a1'});
const h1 = new Hook({'name': 'h1'});
const h2 = new Hook({'name': 'h2'});
const h3 = new Hook({'name': 'h3'});
const h4 = new Hook({'name': 'h4'});
const h5 = new Hook({'name': 'h5'});

h1.setHook(h2).setHook(h3);

a1.setHook(h1);
a1.hooks.push(h4);
a1.hooks.push(h5);

const obj = {
  preTally: 0,
  postTally: 0,
  exeTally: 0
};
const bar = a1.process(obj);

bar.then(() => {console.dir(obj);});
