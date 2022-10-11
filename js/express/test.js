const Apple = 'iphone /**\\n * 绩效标签[xxxx/ */ ipad /** xxxx/ */ ipadmini /** xxxx* */ mac /** xxx/x */ macpro';
const reg = /\/\*\*(?:[^/]|(?<!\*)\/)+\*\//g
console.log(Apple.split(reg));

g


// const str = 'mm)ff(ccc/aaa*bb*/'
// const reg = /[^(\*\/)]+/g;
// console.log(str.match(reg));
// ['iphone ', ' ', ' ipad ', ' ', ' ipadmini ', ' ', ' mac ', ' ', ' macpro']