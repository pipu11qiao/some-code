## tapable 原理解析 2

本文查看tapable中 sync 方式的方法运行的方式以及context和intercept的运行逻辑


### 1. SyncHook

执行下面的代码
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
得到的函数和输出结果：

```javascript
function anonymous(arg1, arg2) {
  "use strict";
  var _context;
  var _x = this._x; 
  var _fn0 = _x[0];
  _fn0(arg1, arg2);
  var _fn1 = _x[1];
  _fn1(arg1, arg2);
  var _fn2 = _x[2];
  _fn2(arg1, arg2);
}
/* 输出

1 a1 a2
2 a1 a2
3 a1 a2
*/
```
可以看到SyncHook的调用很简单，顺序同步执行不关心结果。


### 2. SyncBailHook

执行代码

```javascript
const hook = new SyncBailHook(["arg1", "arg2"]); 
// ...
// 与前面一样
```
得到的函数和输出结果：

```javascript
function anonymous(arg1, arg2) {
  "use strict";
  var _context;
  var _x = this._x;
  var _fn0 = _x[0];
  var _result0 = _fn0(arg1, arg2);
  if (_result0 !== undefined) {
    return _result0;
    ;
  } else {
    var _fn1 = _x[1];
    var _result1 = _fn1(arg1, arg2);
    if (_result1 !== undefined) {
      return _result1;
      ;
    } else {
      var _fn2 = _x[2];
      var _result2 = _fn2(arg1, arg2);
      if (_result2 !== undefined) {
        return _result2;
        ;
      } else {
      }
    }
  }
}
```
可以看到SyncBailHook的调用也很简单，只要执行过程中一个订阅函数返回值不为undefined就会暂停后续订阅的执行

### 3. SyncWaterfallHook
```javascript
const hook = new SyncWaterfallHook(["arg1", "arg2"]); 
// ...
// 与前面一样
```
得到的函数和输出结果：

```javascript
function anonymous(arg1, arg2) {
  "use strict";
  var _context;
  var _x = this._x;
  var _fn0 = _x[0];
  var _result0 = _fn0(arg1, arg2);
  if (_result0 !== undefined) {
    arg1 = _result0;
  }
  var _fn1 = _x[1];
  var _result1 = _fn1(arg1, arg2);
  if (_result1 !== undefined) {
    arg1 = _result1;
  }
  var _fn2 = _x[2];
  var _result2 = _fn2(arg1, arg2);
  if (_result2 !== undefined) {
    arg1 = _result2;
  }
  return arg1;

}
```
可以看到SyncWaterfallHook的调用也很简单,执行过程中会使用上一个订阅的返回值。

### 4. SyncLoopHook

```javascript
const hook = new SyncLoopHook(["arg1", "arg2"]); 
// ...
// 与前面一样
```
得到的函数和输出结果：

```javascript
function anonymous(arg1, arg2) {
  "use strict";
  var _context;
  var _x = this._x;
  var _loop;
  do {
    _loop = false;
    var _fn0 = _x[0];
    var _result0 = _fn0(arg1, arg2);
    if (_result0 !== undefined) {
      _loop = true;
    } else {
      var _fn1 = _x[1];
      var _result1 = _fn1(arg1, arg2);
      if (_result1 !== undefined) {
        _loop = true;
      } else {
        var _fn2 = _x[2];
        var _result2 = _fn2(arg1, arg2);
        if (_result2 !== undefined) {
          _loop = true;
        } else {
          if (!_loop) {
          }
        }
      }
    }
  } while (_loop);

}
```
可以看到SyncLoopHook的调用也很简单，只要执行过程中一个订阅函数返回值不为undefined,函数就会重新从第一个订阅函数再次按顺序执行

### 5. SyncHook  结合context

执行代码

```javascript

const hook = new SyncLoopHook(["arg1", "arg2"]);


hook.tap('1', function (arg1, arg2) {
  console.log('1', arg1, arg2)
})

hook.tap('2', function (arg1, arg2) {
  console.log('2', arg1, arg2)
})

hook.tap('3', function (arg1, arg2) {
  console.log('3', arg1, arg2)
})
hook.intercept({
  call: (source, target, routesList) => {
    console.log("intercept call");
  },
  loop: (source, target, routesList) => {
    console.log("intercept loop");
  },
  tap: (source, target, routesList) => {
    console.log("intercept tap");
  },
  register: (tapInfo) => {
    console.log("intercept register");
    console.log(`${tapInfo.name} is doing its job`);
    return tapInfo; // may return a new tapInfo object
  }
})

hook.call('a1', 'a2', 'a3')
```
得到的函数和输出结果：

```javascript
function anonymous(arg1, arg2) {
  "use strict";
  var _context = {};
  var _x = this._x;
  var _fn0 = _x[0];
  _fn0(_context, arg1, arg2);
  var _fn1 = _x[1];
  _fn1(arg1, arg2);
  var _fn2 = _x[2];
  _fn2(_context, arg1, arg2);

}

/* 输出

1 a1 a2
2 a1 a2
okk
3 a1 a2
*/
```
当在订阅时开启context选项，在调用过程中就会给调用方法第一个参数传递context对象。可以在执行过程中在不同的订阅函数中传递数据

### 6. SyncHook  结合intercept

intercept代码执行过程
```javascript
// intercept方法
{
		this.interceptors.push (interceptor));
		if (interceptor.register) {
			for (let i = 0; i < this.taps.length; i++) {
				this.taps[i] = interceptor.register(this.taps[i]);
			}
		}
}
// 同时在tap时调用 interceptor.register,
{
		for (const interceptor of this.interceptors) {
			if (interceptor.register) {
				const newOptions = interceptor.register(options);
				if (newOptions !== undefined) {
					options = newOptions;
				}
			}
		}
}

```
可以看出register方法使用来接收原来的对订阅的函数进行拦截处理。

执行代码

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
hook.intercept({
  call: (source, target, routesList) => {
    console.log("intercept call");
  },
  tap: (source, target, routesList) => {
    console.log("intercept tap");
  },
  register: (tapInfo) => {
    console.log("intercept register");
    console.log(`${tapInfo.name} is doing its job`);
    return tapInfo; // may return a new tapInfo object
  }
})

hook.call('a1', 'a2', 'a3')
```
得到的函数和输出结果：

```javascript

function anonymous(arg1, arg2) {
  "use strict";
  var _context;
  var _x = this._x;
  var _taps = this.taps;
  var _interceptors = this.interceptors;
  _interceptors[0].call(arg1, arg2);
  var _loop;
  do {
    _loop = false;
    _interceptors[0].loop(arg1, arg2);
    var _tap0 = _taps[0];
    _interceptors[0].tap(_tap0);
    var _fn0 = _x[0];
    var _result0 = _fn0(arg1, arg2);
    if (_result0 !== undefined) {
      _loop = true;
    } else {
      var _tap1 = _taps[1];
      _interceptors[0].tap(_tap1);
      var _fn1 = _x[1];
      var _result1 = _fn1(arg1, arg2);
      if (_result1 !== undefined) {
        _loop = true;
      } else {
        var _tap2 = _taps[2];
        _interceptors[0].tap(_tap2);
        var _fn2 = _x[2];
        var _result2 = _fn2(arg1, arg2);
        if (_result2 !== undefined) {
          _loop = true;
        } else {
          if (!_loop) {
          }
        }
      }
    }
  } while (_loop);

}
/* 输出: 
intercept register
1 is doing its job
intercept register
2 is doing its job
intercept register
3 is doing its job
current fn content: 

intercept call
intercept loop
intercept tap
1 a1 a2
intercept tap
2 a1 a2
intercept tap
3 a1 a2
*/
```
调用hook interceptor 方法,根据传入配置的不同会再特定的时候对参数或者执行时进行拦截。
上述打印的函数中展示了在发布时，对于interceptor中的call,loop和tap钩子的调用过程；
loop方法只在有循环的条件时调用。
剩下的register方法是在订阅时拦截订阅函数的参数，处理后返回参数。

```javascript
	intercept(interceptor) {
		this._resetCompilation();
		this.interceptors.push(Object.assign({}, interceptor));
		if (interceptor.register) {
			for (let i = 0; i < this.taps.length; i++) {
				this.taps[i] = interceptor.register(this.taps[i]);
			}
		}
	}
```
