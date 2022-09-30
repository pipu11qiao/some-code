## 核心

webpck5  源码阅读 （vscode)

插件 loader at ....===> webpack 打包流程
1. webpack 打包流程
2. compiler 与 compilation 区别和联系
3. 手写简易版的打包器（ast 抽象语法树， DOM树）
4. loader(adt)
5. plugin

## webpack  入口
#### webpack 命令行中的逻辑
1. npm run build --> 找到 webpack/bin/webpack.js
2. 当运行webpack 时会检查有没有安装webpack-cli 如果安装运行webpack-cli 如果没有安装webpack-cli并运行
3. 最终运行是 webapck-cli 中的 webpack-cli/bin/cli.js
4. 在cli.js 中核心是判断webpackshi是否安装，如果安装了则执行runCli
```javascript
        const cli = new WebpackCLI();

        await cli.run(args);
```
5. 在runCli里处理命令行参数（依赖commander),执行 new WebpackCli 的时候会去触发 action 回调
6. this.program.action(), 而这个 this.program = program(commander)
7. action的回调中执行了loadCommandByNam --> makeCommand -> runWebpack
8. runWebpack() 的时候执行了 createCompiler()
9. 在createCompiler内部调用了webpack方法，接收配置文件和回调，最终生成了一个compiler对象，而这个compiler对象会在上述的调用过程中被返回。它就是我们webpack打包的第一个核心的有关“人员”
10. 上面的webpack 就是我们本地安装好的webpack
11. 如果想让webpack打包，其实就是使用webpack函数来接收config，然后调用run 方法即可

```javascript
// 1. 引入webpack 和配置信息
const webpack = require('webpack');
const config = require('./webpack.config');

//2. 调用webpack方法，传入配置信息， 创建compiler 
const compiler = webpack(config);

//3. 调用compiler run方法
compiler.run(() => {
  console.log(111);
})
```

##### 一些方法
* child_process.spawn
* path.dirname
* module.prototype._compile
* commander program

