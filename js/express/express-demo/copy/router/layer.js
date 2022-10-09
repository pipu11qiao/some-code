const pathRegexp = require('path-to-regexp');
const debug = require('debug')('express:router:layer');
const hasOwnProperty = Object.prototype.hasOwnProperty;

module.exports = Layer;

function Layer(path, options, fn) {
  if (!(this instanceof Layer)) {
    return new Layer(path, options, fn)
  }
  debug('new %o', path);
  const opts = options || {};
  this.handle = fn;
  this.name = fn.name || '<anonymous';

}