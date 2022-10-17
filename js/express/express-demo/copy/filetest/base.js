
// const pathToRegexp = require('./index.js')
// let keys = []
// const exp = pathToRegexp('/foo/:bar', keys);
// console.log(`exp`, exp);



// const exp = /^\/foo\/(?:([^\/]+?))\/?$/i

// let str = '/foo/aaa?xxx=sss???'
// let res = exp.exec(str);
// console.log(`res`, res);



// function loop(arr) {
//   let idx = 0;
//   function next() {
//     const fn = arr[idx++]
//     fn(next)
//   }
//   next()
// }
const http = require('http');
// http.METHODS
console.log(`http.METHODS`, http.METHODS);