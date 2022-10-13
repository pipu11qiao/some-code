const pathtoRegexp = require('./index');


// const pathStr=  '/\.:bar((\\w)*?)';
// const pathStr = '/foo/:b(ar)-:name-:age';
const pathStr = '/foo/:bar-(ar):name-:age';
const pathStr = '/ab(cd)?e';
// const pathStr=  '/foo/:bar/ab(ab)+cd/:name/dd*/:age';
const keys = [];

const pathReg = pathtoRegexp(pathStr, keys);
console.log(`pathReg`, pathReg);
console.log(`keys`, keys);

// const mainReg = /(\\\/)?(\\\.)?:(\w+)(\(.*?\))?(\*)?(\?)?/
// match, slash, format, key, capture, star, optional, offset
/*
1. \/ slash
2. \. format
3. \w+ key
4. (.*?) capture
5. * star
6. ? optional
7.  offset replace 方法内置的 匹配到的字符串开始的位置

*/

// /^\/foo\/(?:([^\/]+?))-(?:([^\/]+?))-(?:([^\/]+?))\/?$/i
// 012345678901234567
// /foo/:bar-:name-:age
// 012345678901234567

/* 需要说明的一些例子
 const pathStr = '/foo/:bar';
 const pathStr = '/foo/:bar*?';
 const pathStr = '/foo/:bar*?';
 const pathStr = '/foo/:bar-(ar):name-:age';
 const pathStr = '/ab(cd)?e';
*/
"mocha": "^1.17.1",
"istanbul": "^0.2.6"