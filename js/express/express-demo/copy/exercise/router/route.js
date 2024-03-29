'use strict'

var debug = require('debug')('express:router:route');
var flattern = require('array-flatten');
var Layer = require('./layer');
var methods = require('methods');
var slice = Array.prototype.slice;
var toString = Object.prototype.toString;

module.export = Route;

function Route(path) {
  this.path = this.path
  this.stack = [];
  debug('new %o', path);
  this.methods = {};
}

Route.prototype._handles_method = function _handles_method(method) {
  if (this.methods._all) {
    return true
  }
  var name = method.toLowerCase();
  if (name === 'head' && !this.methods['head']) {
    name = 'get';
  }
  return Boolean(this.methods[name])
}
Route.prototype._options = function _options() {
  var methods = Object.keys(this.methods);
  if (this.methods.get && !this.methods.head) {
    methods.push('head');
  }
  for (var i = 0; i < methods.length; i++) {
    methods[i] = methods[i].toUpperCase();
  }
  return methods
}
Route.prototype.dispatch = function dispatch(req, res, done) {
  var idx = 0;
  var stack = this.stack;
  var sync = 0;
  if (stack.length === 0) {
    return done()
  }
  var method = req.method.toLowerCase();
  if (method === 'head' && !this.methods['head']) {
    method = 'get'
  }
  req.route = this;
  next()
  function next(err) {
    if (err && err === 'route') {
      return done()
    }
    if (err && err === 'router') {
      return done(err)
    }
    if (++sync > 100) {
      return setImmediate(next, err)
    }
    var layer = stack[idx++]
    if (!layer) {
      return done(err)
    }
    if (layer.method && layer.method !== method) {
      next(err)
    } else if (err) {
      layer.handle_error(err, req, res, next);
    } else {
      layer.handle_request(req, res, next)
    }
    sync = 0;
  }
}
Route.prototype.all = function all() {
  var handles = flattern(slice.call(arguments));
  for (var i = 0; i < handles.length; i++) {
    var handle = handles[i];
    if (typeof handle !== 'function') {
      var type = toString.call(handle);
      var msg = 'Route.all() requires a callback function bug got a ' + type
      throw new Error(msg)
    }
    var layer = undefined;
    this.methods._all = true;
    this.stack.push(layer)
  }
}

methods.forEach(function (method) {
  Route.prototype[method] = function () {
    var handles = flattern(slice.call(arguments));
    for (var i = 0; i < handles.length; i++) {
      var handle = handles[i];
      if (typeof handle !== 'function') {
        var type = toString.call(handle);
        var msg = 'Route.' + method + '() requires a callback function bug got a ' + type
        throw new Error(msg);
      }
      debug('%s %o', method, this.path);
      var layer = Layer('/', {}, handle);
      layer.method = method;
      this.methods[method] = true;
      this.stack.push(layer)
    }
    return this;
  }
})