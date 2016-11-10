'use strict';

const assert = require('chai').assert;
const expect = require('chai').expect;
const should = require('should');
const Hook = require('../lib/').Hook;

describe(`Tests in ${__filename}`, () => {
  describe('Hook standalone functionality', () => {
    it('Simple hook all methods fire', function () {
      var hook = new Hook({name: 'simpleHook'});
      hook.process({});
    });

  });
});
