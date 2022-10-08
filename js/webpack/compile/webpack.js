const Compiler = require('./compiler')

function webpack(config) {

  //将用户调用webpacf方式时config与我们的命令行配置合并

  let shellOptions = process.argv.slice(2).reduce((config, args) => {
    let [key, value] = args.split('=')
    config[key.slice(2)] = value
    return config
  }, {})
  // ['--mode="production"']
  // console.log(shellOptions);

  // 合并 config 与 shell options

  const finalOptions = { ...config, ...shellOptions };

  // console.log(`finalOptions`, finalOptions);

  let compiler = new Compiler(finalOptions)

  // webpack里的插件是什么时候挂载的,什么时候执行的
  // 在webpacd当中，大部分的插件都不是立即执行的
  finalOptions.plugins.forEach((plugin) => {
    plugin.apply(compiler);
    // console.log(`plugin`, plugin);
  })

  return compiler
}

module.exports = webpack;