'use strict';

const assert = require('chai').assert;
const expect = require('chai').expect;
const should = require('should');
const Hook = require('../lib/').Hook;
const TallyHook = require('../test/common.js').TallyHook;

describe(`Tests in ${__filename}`, () => {

  describe('Hook functionality test', () => {
    it('Hook methods all fire', () => {
      let obj = {
        preTally: 0,
        exeTally: 0,
        postTally: 0
      };
      const hook = new TallyHook({name:'tallyHook'});
      const hookA = new TallyHook({name:'tallyHookA'});
      const hookB = new TallyHook({name:'tallyHookB'});
      hook.setHook(hookA).setHook(hookB);
      return hook.process(obj)
        .then((obj) => {
          obj.should.have.property('preTally', 3);
          obj.should.have.property('exeTally', 3);
          obj.should.have.property('postTally', 3);
        })
        .catch((reason) => {console.dir(reason);});
    });
  });
});
