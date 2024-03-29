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
  this.name = fn.name || '<anonymous>';
  this.params = undefined;
  this.path = undefined;
  this.regexp = pathRegexp(path, this.keys = [], opts);
  this.regexp.fast_star = path === '*';
  this.regexp.fast_slash = path === '/' && opts.end === false;
}
Layer.prototype.handle_error = function handle_error(error, req, res, next) {
  var fn = this.handle;
  if (fn.length !== 4) {
    return next(error)
  }
  try {
    fn(error, req, res, next)
  } catch (err) {
    next(err)
  }
}
Layer.prototype.handle_request = function handle_request(req, res, next) {
  var fn = this.handle;
  if (fn.length > 3) {
    return next()
  }
  try {
    fn(req, res, next);
  } catch (err) {
    next(err)
  }
}
Layer.prototype.match = function match(path) {
  var match
  if (path !== null) {
    if (this.regexp.fast_slash) {
      this.params = {};
      this.path = '';
      return true
    }
    if (this.regexp.fast_star) {
      this.params = { '0': decode_param(path) }
      this.path = path;
      return true
    }
    match = this.regexp.exec(path)
  }
  if (!match) {
    this.params = undefined;
    this.path = undefined;
    return false
  }
  this.params = {}
  this.path = match[0];
  var keys = this.keys;
  var params = this.params;
  for (var i = 0; i < match.length; i++) {
    var key = keys[i - 1];
    var prop = key.name;
    var val = decode_param(match[i]);
    if (val !== undefined || !(hasOwnProperty.call(params, prop))) {
      params[prop] = val;
    }
  }
  return true
}

function decode_param(val) {
  if (typeof val !== 'string' || val.length === 0) {
    return val;
  }
  try {
    return decodeURIComponent(val);
  } catch (err) {
    if (err instanceof URIError) {
      err.message = 'Failed to decode param \'' + val + '\'';
      err.status = err.statusCode = 400;
    }
    throw err;
  }
}
