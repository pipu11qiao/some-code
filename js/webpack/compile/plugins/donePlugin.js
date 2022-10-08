class DonePlugin {
  apply(compiler) {
    compiler.hooks.done.tap('event1', () => {
      console.log('编译完成 done 插件');
    })
  }
}
module.exports = DonePlugin