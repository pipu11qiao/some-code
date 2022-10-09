const MATCHING_GROUP_REGEXP = /\((?!\?)/g;
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
    .replace(/(\\\/)?(\\\.)?:(\w+)(\(.*?\)/g)


}
