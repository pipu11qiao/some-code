## 主题

1. webpack 打包流程


## 整体流程
1. 初始化参数
  1. 从配置文件和shell语句中合并参数
2. 开始编译
  1. 使用配置参数，初始化compiler对象
  2. 挂载插件
  3. 依据配置文件找到入口模块
3. 编译模块
  1. 配置文件中的loader，从入口模块开始来编译所有的文件
  2. 依据入口找到所有的依赖的模块
4. 完成编译
  1. 所谓的完成编译，只是从语言层面上，得到了一些当前语言可以实现的数据类型
5. 输出资源
  1. 依据入口模块及其依赖的模块关系，组装包含多个模块的chunk
  2. 将chunk转为独立的文件添加至输出列表当中
6. 写入文件
  1. 确定输出内容
  2. 路径+ 写入 + 缓存