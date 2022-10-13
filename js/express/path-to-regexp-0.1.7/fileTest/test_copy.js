const pathToRegExp = require('./');
const assert = require('assert');
describe('path-to-regexp-strings', function () {
  it('should match simple paths', function () {
    const parmas = [];
    const m = pathToRegExp('/test', parmas).exec('/test');

    assert.equal(parmas.length, 0);

    assert.equal(m.length, 1);
    assert.equal(m[0], '/test');
  })
  it('should match express format params', function () {

    const parmas = [];
    const m = pathToRegExp('/:test', parmas).exec('/pathname');

    assert.equal(parmas.length, 1);
    assert.equal(parmas[0].name, 'test');
    assert.equal(parmas[0].optional, false);

    assert.equal(m.length, 2);
    assert.equal(m[0], '/pathname');
    assert.equal(m[1], 'pathname');
  })

})