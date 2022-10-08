// 1. 引入webapck

const webpack = require('./webpack');

// 2. 引入配置对象
const config = require('./webpack.config');

// 3. 实例化compiler
const compiler = webpack(config);

// 4. 调用run方法开始同坐
compiler.run((err, status) => {
  console.log(status.toJson());
})

