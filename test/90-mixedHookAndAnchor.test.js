const assert = require('chai').assert;
const expect = require('chai').expect;
const should = require('should');
const Anchor = require('../lib/').Anchor;
const Hook   = require('../libtest/common.js').TallyHook;

describe(`Tests in ${__filename}`, () => {
  describe('Mix of Anchor and Hook functionality', function(){
    it('hook methods all fire', function(){
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

      const promise = a1.process(obj);

      promise.should.be.a.Promise();
      promise.then((testObj) => {
        should(testObj).have.property('preTally', 5);
        should(testObj).have.property('exeTally', 5);
        should(testObj).have.property('postTally', 5);
      })
      .catch((err) =>{
        console.dir(err);
      });
    });
  });
});
