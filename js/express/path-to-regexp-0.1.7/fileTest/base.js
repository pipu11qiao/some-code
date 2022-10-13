const pathtoRegexp = require('./index');


const pathStr=  '/\.:bar((\\w)*?)';
// const pathStr=  '/foo/:bar/ab(ab)+cd/:name/dd*/:age';

const pathReg = pathtoRegexp(pathStr);
console.log(`pathReg`, pathReg);


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
