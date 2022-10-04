## tapable 原理解析 1

本文通过对tapable源码的简单分析，梳理tapable中的原理的关键部分

### 结果

通过在 HookCodeFactory 类的create方法中添加打印 发布函数的范式来查看tapable的发布订阅的具体逻辑

```javascript
 		console.log('current fn content: \n\n', fn.toString())
```

### 分析的方法

分析的方法，tapable中的源代码不是很多
* 通过vscode的调试模式[Debugging](https://code.visualstudio.com/Docs/editor/debugging)
* 通过阅读代码，打印关键信息

用到了三个文件,Hook.js 
lib
├── Hook.js
├── HookCodeFactory.js
├── SyncHook.js

调试的代码

```javascript
const { SyncHook } = require('../lib/index')
const hook = new SyncHook(["arg1", "arg2"]);
hook.tap('1', function (arg1, arg2) {
  console.log('1', arg1, arg2)
})
hook.tap('2', function (arg1, arg2) {
  console.log('2', arg1, arg2)
})
hook.tap('3', function (arg1, arg2) {
  console.log('3', arg1, arg2)
})
hook.call('a1', 'a2', 'a3')
```

### 1.  tap 执行流程 tap是完成订阅部分的功能

hook.tap -> hook._tap -> hook._insert

可以简化为

```javascript

class Hook{
	constructor() {
		this.taps = []; // 监听的事件池子
	}
  tap(item){
    this.taps.push(item);
  }
}

```
可以知道三种订阅的方法，tap,tapAync,tapPromise都是向taps池子中添加订阅事件，这部分很简单。

### 2. call 执行的过程

```javascript

hook.call()
// 调用栈
const _call = hook.createCall() = hook.compile()  =  factory.create()
_call()

```
可以看出fatcory.create 方法就是再创建call执行函数，也就是发布函数。来发布事件。这是tapable库的最核心的地方。
具体的逻辑

* 根据调用方式的不同（sync,async,promise）生成对应的调用外层包装函数
* 生成函数的参数
* 生成函数内容的前置信息
* 生成函数内容的具体执行逻辑代码


通过在 HookCodeFactory 类的create方法中添加打印 发布函数的范式来查看tapable的发布订阅的具体逻辑

```javascript
 		console.log('current fn content: \n\n', fn.toString())
```
接下来的文章会根据具体的打印信息查看具体的生成的函数，相信能直接看懂tapablede执行逻辑。对于你理解tapable库怎么实现对应的发布订阅有很大的帮助
