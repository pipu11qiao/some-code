const path = require('path')
const RunPlugin = require('./plugins/runPlugin')
const DonePlugin = require('./plugins/donePlugin')


module.exports = {
  mode: 'development',
  devtool: false,
  entry: {
    entry1: './src/entry1.js',
    entry2: './src/entry2.js',
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, './dist')
  },
  plugins: [
    new RunPlugin(),
    new DonePlugin()
  ],
  module: {
    rules: [
      {
        // 按照我们当前的规则，src下面的entry1和entry2都满足
        // 所以下面的loader都会对上面的生效
        //所谓的生效就是找到entry1和entry2，然后读取他们的原码
        // 如果我想读取两个文件的源码， 1.确定绝对路径
        test: /\.js$/,
        use: [
          
          path.resolve(__dirname, './loaders/loader1.js'),
          path.resolve(__dirname, './loaders/loader2.js'),
        ]
      }
    ]
  }
}