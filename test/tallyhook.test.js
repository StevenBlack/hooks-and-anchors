'use strict';

const assert = require('chai').assert;
const expect = require('chai').expect;
const should = require('should');
const Hook = require('../lib/').Hook;
const TallyHook = require('./common.js').TallyHook;

describe('TallyHook test', () => {
  it('.process(thing) returns a promise', () => {
    const obj = {
      preTally: 0,
      postTally: 0,
      exeTally: 0
    };
    const hook = new TallyHook();
    const promise = hook.process(obj);
    promise.should.be.a.Promise();
  });

  it('tallies hits as expected', () => {
    const obj = {
      preTally: 0,
      postTally: 0,
      exeTally: 0
    };
    const hook = new TallyHook();
    const promise = hook.process(obj);
    promise.then(() => {
      obj.should.have.property('preTally', 1);
      obj.should.have.property('postTally', 1);
    }).catch((reason) => {console.dir(reason);});
  });

});
