
// const pathToRegexp = require('./index.js')
// let keys = []
// const exp = pathToRegexp('/foo/:bar', keys);
// console.log(`exp`, exp);



const exp = /^\/foo\/(?:([^\/]+?))\/?$/i

let str = '/foo/aaa?xxx=sss???'
let res = exp.exec(str);
console.log(`res`, res);