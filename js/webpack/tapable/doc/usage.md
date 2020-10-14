### tapable
tapable 是一个发布订阅模式的库，类似于nodejs中的event模块。提供了一些定制的api，使的该模式使用起来更方便。

提供了一下主要方法：

```javascript
const {
	SyncHook,
	SyncBailHook,
	SyncWaterfallHook,
	SyncLoopHook,
	AsyncParallelHook,
	AsyncParallelBailHook,
	AsyncSeriesHook,
	AsyncSeriesBailHook,
	AsyncSeriesWaterfallHook
 } = require("tapable");
```
#### 用法：
上面都是一些Hook的构造函数,创建的hook类就是发布订阅的对象。

基本用法 接收一个非必要的参数名列表

```javascript
const hook = new SyncHook(["arg1", "arg2", "arg3"]);
```

对于要使用tapable的类，最佳实践是将所有的hook包含在一个hooks属性上

```javascript
class Car {
	constructor() {
		this.hooks = {
			accelerate: new SyncHook(["newSpeed"]),
			brake: new SyncHook(),
			calculateRoutes: new AsyncParallelHook(["source", "target", "routesList"])
		};
	}
	/* ... */
}
```
创建完hook其他人就可以通过发布订阅来使用这个hook。

```javascript
const myCar = new Car();

// Use the tap method to add a consument
myCar.hooks.brake.tap("WarningLampPlugin", () => warningLamp.on());

```

也可以接收订阅函数中添加参数：

```javascript
myCar.hooks.accelerate.tap("LoggerPlugin", newSpeed => console.log(`Accelerating to ${newSpeed}`));
```

hook 有同步类型，异步类型，和promise类型，其中同步的hook只能通过tap方法订阅，异步的既可以使用tapAsync tapPromise也可以使用tap

```javascript
myCar.hooks.calculateRoutes.tapPromise("GoogleMapsPlugin", (source, target, routesList) => {
	// return a promise
	return google.maps.findRoute(source, target).then(route => {
		routesList.add(route);
	});
});
myCar.hooks.calculateRoutes.tapAsync("BingMapsPlugin", (source, target, routesList, callback) => {
	bing.findRoute(source, target, (err, route) => {
		if(err) return callback(err);
		routesList.add(route);
		// call the callback
		callback();
	});
});

// You can still use sync plugins
myCar.hooks.calculateRoutes.tap("CachedRoutesPlugin", (source, target, routesList) => {
	const cachedRoute = cache.get(source, target);
	if(cachedRoute)
		routesList.add(cachedRoute);
})
```
调用的方式也会不同，调用就是trigger触发的意思：

```javascript

class Car {
	/**
	  * You won't get returned value from SyncHook or AsyncParallelHook,
	  * to do that, use SyncWaterfallHook and AsyncSeriesWaterfallHook respectively
	 **/

	setSpeed(newSpeed) {
		// following call returns undefined even when you returned values
		this.hooks.accelerate.call(newSpeed);
	}

	useNavigationSystemPromise(source, target) {
		const routesList = new List();
		return this.hooks.calculateRoutes.promise(source, target, routesList).then((res) => {
			// res is undefined for AsyncParallelHook
			return routesList.getRoutes();
		});
	}

	useNavigationSystemAsync(source, target, callback) {
		const routesList = new List();
		this.hooks.calculateRoutes.callAsync(source, target, routesList, err => {
			if(err) return callback(err);
			callback(null, routesList.getRoutes());
		});
	}
}
```
Hook 将使用最有效的方式编译调用发方法，来运行你的插件。它根据以下方面来生成代码：

* 注册插件的数量
* 注册插件的类型（同步，异步，还是promise）
* 调用方法
*  参数的数量
* 是否使用监视器（interception）

Hook 类型

每个hook都可以使用tap方式订阅多个函数，他们如何执行取决于hook类型：

* Basic hook 调用订阅中的每个函数
* Waterfall  调用订阅中的每个函数，不同的是会传递上一个函数的返回值给下一个函数
* Bail 在顺序执行订阅函数的过程中只有一个函数返回的为真，就会停止。不会调用剩下函数
* Loop 在顺序执行过程如果当前函数返回真，会一直执行该函数，直到返回false才执行下一个函数

另外，hooks可以是异步或同步的。如果是异步就会有并行和串行两种方式，‘AsyncParallel 和 AsyncSeries

* 同步 同步的hook只能通过tap来订阅
* 异步串行 通过tap，tapAysnc tapPromise订阅,串行的方式执行代码
* 异步并行 通过tap，tapAysnc tapPromise订阅,并行的方式执行代码


#### Interception 拦截器

所有的钩子提供拦截器接口：

```javascript
myCar.hooks.calculateRoutes.intercept({
	call: (source, target, routesList) => {
		console.log("Starting to calculate routes");
	},
	register: (tapInfo) => {
		// tapInfo = { type: "promise", name: "GoogleMapsPlugin", fn: ... }
		console.log(`${tapInfo.name} is doing its job`);
		return tapInfo; // may return a new tapInfo object
	}
})
```
参数：
* call ```(...args) => void``` 在拦截器中的call方法将在hooks被触发时调用，有权利获取hooks参数
* tap ```（tap:Tap）=> void ```  在拦截器中的tap方法将在有插件注册到钩子中触发，参数是Tap对象
* loop: ```(...args) => void``` 在拦截器中的loop方法将在每个循环钩子循环时触发
* register: ```（tap:Tap）=> Tap | underfined ``` 在拦截器中的register方法将在每次添加Tap时触发，并且允许你修改它

#### Context 上下文

用来向订阅的插件或拦截器传递任意的值

```javascript
myCar.hooks.accelerate.intercept({
	context: true,
	tap: (context, tapInfo) => {
		// tapInfo = { type: "sync", name: "NoisePlugin", fn: ... }
		console.log(`${tapInfo.name} is doing it's job`);

		// `context` starts as an empty object if at least one plugin uses `context: true`.
		// If no plugins use `context: true`, then `context` is undefined.
		if (context) {
			// Arbitrary properties can be added to `context`, which plugins can then access.
			context.hasMuffler = true;
		}
	}
});

myCar.hooks.accelerate.tap({
	name: "NoisePlugin",
	context: true
}, (context, newSpeed) => {
	if (context && context.hasMuffler) {
		console.log("Silence...");
	} else {
		console.log("Vroom!");
	}
});
```

#### HookMap 钩子集

一个钩子集是对一系列的钩子的帮助类

```javascript

const keyedHook = new HookMap(key => new SyncHook(["arg"]))
keyedHook.for("some-key").tap("MyPlugin", (arg) => { /* ... */ });
keyedHook.for("some-key").tapAsync("MyPlugin", (arg, callback) => { /* ... */ });
keyedHook.for("some-key").tapPromise("MyPlugin", (arg) => { /* ... */ });
const hook = keyedHook.get("some-key");
if(hook !== undefined) {
	hook.callAsync("arg", err => { /* ... */ });
}

```


#### Hook/HookMap  接口 
* public
```javascript
interface Hook {
	tap: (name: string | Tap, fn: (context?, ...args) => Result) => void,
	tapAsync: (name: string | Tap, fn: (context?, ...args, callback: (err, result: Result) => void) => void) => void,
	tapPromise: (name: string | Tap, fn: (context?, ...args) => Promise<Result>) => void,
	intercept: (interceptor: HookInterceptor) => void
}

interface HookInterceptor {
	call: (context?, ...args) => void,
	loop: (context?, ...args) => void,
	tap: (context?, tap: Tap) => void,
	register: (tap: Tap) => Tap,
	context: boolean
}

interface HookMap {
	for: (key: any) => Hook,
	intercept: (interceptor: HookMapInterceptor) => void
}

interface HookMapInterceptor {
	factory: (key: any, hook: Hook) => Hook
}

interface Tap {
	name: string,
	type: string
	fn: Function,
	stage: number,
	context: boolean,
	before?: string | Array
}
```
* protected

```javascript
interface Hook {
	isUsed: () => boolean,
	call: (...args) => Result,
	promise: (...args) => Promise<Result>,
	callAsync: (...args, callback: (err, result: Result) => void) => void,
}

interface HookMap {
	get: (key: any) => Hook | undefined,
	for: (key: any) => Hook
}
```
#### MultiHook
将钩子移动到别的钩子集上
```javascript
const { MultiHook } = require("tapable");

this.hooks.allHooks = new MultiHook([this.hooks.hookA, this.hooks.hookB]);
```
