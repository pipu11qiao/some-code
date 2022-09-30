// 1. 引入webpack 和配置信息
const webpack = require('webpack');
const config = require('./webpack.config');

//2. 调用webpack方法，传入配置信息， 创建compiler 
const compiler = webpack(config);

//3. 调用compiler run方法
compiler.run(() => {
  console.log(111);
})