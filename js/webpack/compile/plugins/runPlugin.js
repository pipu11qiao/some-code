// 在 webpacd当中一切都是插件，一个插件就是一个类，每个类下面有固定的方法，apply
// apply方法会接受一个compiler对象作为参数

class RunPlugin {
  apply(compiler) {
    compiler.hooks.run.tap('event1', () => {
      console.log('开始编译 run 插件');
    })
  }
}

module.exports = RunPlugin
// 所谓的挂载的插件，无非就是compiler实例传递给每个插件的apply方法，因为后续想使用当前插件的功能，只需要调用apply方法就行

// tapable
// 挂载之后并不会立即执行插件中的代码，如果想让每个插件生效，需要使用tapable使用
// 发布订阅
// 需要加钩子放在compiler身上
