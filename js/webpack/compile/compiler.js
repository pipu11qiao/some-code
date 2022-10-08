const path = require('path');
const fs = require('fs');

const { SyncHook } = require('tapable');
const types = require('babel-types');
const parser = require('@babel/parser');
const tanverse = require('@babel/traverse').default;
const generator = require('@babel/generator').default;

const toUnixPath = require('./util')

class Compiler {
  constructor(options) {
    this.options = options;
    this.hooks = {
      run: new SyncHook(),
      done: new SyncHook(),
      emit: new SyncHook(),
    }
    this.context = options.context || process.cwd();
  }
  run() {
    // 开始执行编译之前，要先确定本次打包的入口模块
    let entry = {};
    if (typeof this.options.entry === 'string') {
      entry.main = this.options.entry
    } else {
      entry = this.options.entry
    }

    // webpack 当中的loader是什么时候工作的
    // 此时不只是找到对应的配置让loader函数调用就行，我们要做的事情就是将被打包文件的源代码，交给loader进行使用处理完成之后再返回


    // 此时我们要先从入口开始找到所有符合条件的源代码
    for (let entryName in entry) {
      let entryRelativePath = entry[entryName]
      let entryAbsolutePath = toUnixPath(path.resolve(this.context, entryRelativePath))
      // console.log(entryAbsolutePath);

      // 开始编译代码

      this.buildModule(entryName, entryAbsolutePath)
    }
  }
  buildModule(moduleName, modulePath) {
    // 读取被打包模块的源代码
    const originalSourceCode = fs.readFileSync(modulePath, 'utf-8');
    let targetSourceCode = originalSourceCode;
    // console.log(`targetSourceCode`, targetSourceCode);

    // 调用loader
    let loaders = [];
    let rules = this.options.module.rules;
    // console.log(`rules`, rules);
    for (let i = 0; i < rules.length; i++) {
      // loader可能存在多个，但是本次只需要执行满足条件的
      const curRule = rules[i]
      if (curRule.test.test(modulePath)) {
        // 此时说明这个loader是需要执行的
        loaders = [...loaders, ...curRule.use]
      }
    }
    // 采用降序执行loader
    for (let i = loaders.length - 1; i >= 0; i--) {
      targetSourceCode = require(loaders[i])(targetSourceCode)//被打包模块的源代码
    }
    // console.log(`targetSourceCode`, targetSourceCode);
    // 实现的模块的递归编译 单层编译 + 递归编译
    // 模块ID
    /* {"./src/entry1.js": ``}
    */
    const moduleID = './' + path.posix.relative(this.context, modulePath);
    console.log(`moduleID`, moduleID);
    // 定义容器来保存数据module
    let module = { id: moduleID, name: moduleName, dependencies: [] }

    // 使用ast语法树将源代码进行修改 ./titile ===> ./src/title
    // 我们将代码修改完成之后一定会找个地方暂存
    console.log(`targetSourceCode`, targetSourceCode);
    const ast = parser.parse(targetSourceCode, { sourceType: 'module' });
    console.log(`ast`, ast);
  }

}
module.exports = Compiler