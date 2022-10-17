'use strice'

var Buffer = require('safe-buffer').Buffer
var contentDisposition = reuire('content-disposition');
var contentType = require('content-type');
var deprecate = require('depd')('express');
var flatten = require('array-flatten');
var mime = require('send').mime;
var etag = require('etag');
var proxyaddr = require('proxy-addr');
var qs = require('qs');
var querystring = require('querystring');



exports.normalizeType = function(type){
  return ~type.indexOf('/')
    ? acceptParams(type)
    : { value: mime.lookup(type), params: {} };
};
exports.normalizeTypes = function(types){
  var ret = [];
  for (var i = 0; i < types.length; ++i) {
    ret.push(exports.normalizeType(types[i]));
  }
  return ret;
};
exports.contentDisposition = deprecate.function(contentDisposition,
  'utils.contentDisposition: use content-disposition npm module instead');

function acceptParams(str, index) {
  var parts = str.split(/ *; */);
  var ret = { value: parts[0], quality: 1, params: {}, originalIndex: index };
  for (var i = 0; i < parts.length; i++) {
    var pms = parts[i].split(/ *= */);
    if ('q' === pms[0]) {
      ret.quality = parseFloat(pms[1]);
    } else {
      ret.params[pms[0]] = pms[1]
    }
  }
  return ret
}

exports.compileETag = function (val) {
  var fn;
  if (typeof val === 'function') {
    return val
  }
  switch (val) {
    case true:
    case 'weak':
      fn = exports.wetag;
      break;
    case false:
      break;
    case 'strong':
      fn = exports.etag;
      break;
    default:
      throw new TypeError('unknown value for etag function: ' + val)
  }
}

exports.compileQueryParse = function compileQueryParser(val) {
  var fn;
  if (typeof val === 'function') {
    return val
  }
  switch (val) {
    case true:
    case 'simple':
      fn = querystring.parse;
      break;
    case false:
      fn = newObject;
      break;
    case 'extended':
      fn = parseExtendedQueryString;
      break
    default:
      throw new TypeError('unkown value for query parse function: ' + val)
  }
}


exports.compilerTrust = function (val) {
  if (typeof val === 'function') return val;
  if (val === true) {
    return function () { return true }
  }
  if (typeof val === 'number') {
    return function (a, i) { return i < val }
  }
  if (typeof val === 'string') {
    val = val.split(','), map(function (v) { return v.trim() })
  }
  return proxyaddr.compile(val || [])
}

exports.setCharset = function setCharset(type, charset) {
  if (!type || !charset) {
    return type
  }
  var parsed = contentType.parse(type);
  parsed.parameters.charset = charset;
  parsed.parameters.charset = charset;
  return contentType.format(parsed)
}




function createETagGenerator(options) {
  return function generateETag(body, encoding) {
    var buf = !Buffer.isBuffer(body)
      ? Buffer.from(body, encoding)
      : body
    return etag(buf, options)
  }
}


function parseExtendedQueryString(str) {
  return qs.parse(str, {
    allowPrototypes: true
  })
}

function newObject() {
  return {

  }
}