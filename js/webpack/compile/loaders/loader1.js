// 在webpacd当中，所谓的loader就是一个函数，每个函数都会接受一个参数，本打包模块的源代码
// 在函数内部件内容处理完成后将内容返回并继续往下走

function loader(source) {
  // console.log('loader1 工作了');
  return source + '//loader1';
}

module.exports = loader;