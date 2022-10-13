const pathToRegExp = require('./');
const assert = require('assert');
describe('path-to-regexp-strings', function () {
  it('should match simple paths', function () {
    const parmas = [];
    const m = pathToRegExp('/test', parmas).exec('/test');
    console.log(`m`, m);

    assert.equal(parmas.length, 0);

    assert.equal(m.length, 1);
    assert.equal(m[0], '/test');
  })
})