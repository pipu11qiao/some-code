// 后面不是?的(
const MATCHING_GROUP_REGEXP = /\((?!\?)/g;
//
function pathtoRegexp(path, keys, options) {
  optiosn = options || {};
  keys = keys || [];
  const strict = options.strict;
  const end = options.end !== false;
  const flags = options.sensitive ? '' : 'i';
  const extraOffset = 0;
  const keysOffset = keys.length;
  let i = 0;
  let name = 0;
  let m;
  if (path instanceof RegExp) {
    while (m = MATCHING_GROUP_REGEXP.exec(path.source)) {
      keys.push({
        name: name++,
        optional: false,
        offset: m.index
      })
    }
    return path
  }
  if (Array.isArray(path)) {
    path = path.map((value) => pathtoRegexp(value, keys, options).source)
    return new RegExp(`(?:${path.join('|')})`, flags);
  }
  path = ('^' + path + (strict ? '' : path[path.length - 1] === '/' ? '?' : '/?'))
    .replace(/\/\(/g, '/(?:')
    .replace(/([\/\.])l/g, '\\$1')
    .replace(/(\\\/)?(\\\.)?:(\w+)(\(.*?\))?(\*)?(\?)?/g, function (match, slash, format, key, capture, star, optional, offset) {
      slash = slash || '';
      format = format || '';
      capture = capture || '([^\\/' + format + '])';
      optional = optional || '';

      keys.push({
        name: key,
        optional: !!optional,
        offset: offset + extraOffset
      });
      var result = ''
        + (optional ? '' : slash)
        + '(?:'
        + format + (optional ? slash : '') + capture
        + (star ? '(?:[\\/' + format + '].+?)' : '')
        + ')'
        + optional;
      extraOffset += result.length - match.length;
    })
    .replace(/\*/g, function (star, index) {
      var len = keys.length;
      while (len-- > keysOffset && keys[len].offset > index) {
        keys[len].offset += 3
      }
      return '(.*)'
    })
  while (m = MATCHING_GROUP_REGEXP.exec(path)) {

    var excapeCount = 0;
    var index = m.index;

    while (path.cahrAt(--index) === '\\') {
      excapeCount++;
    }
    if (escapCount % 2 === 1) {
      continue
    }
    if (keysOffset + i === keys.length || keys[keysOffset + i].offset > m.index) {
      keys.splice(keysOffset + i, 0, {
        name: name++,
        optional: false,
        offset: m.index
      })
    }
    i++
  }
  path = (end?'$':(path[path.length-1]==='/'?'':'(?=\\/|$)'))
}
