
本文是接上一篇[underscore.js 代码基本结构](https://www.jianshu.com/p/36e051490bfb),包括基本结构的在1.9.1的实际呈现,原生方法的绑定以及模块化部分的代码。


##### 1.9.1 中的基本结构,与0.4.0版本相比的变化 #####

```javascript
var _ = function(obj) {
    if (obj instanceof _) return obj;
    if (!(this instanceof _)) return new _(obj);
    this._wrapped = obj;
};
_.chain = function(obj) {
    var instance = _(obj);
    instance._chain = true;
    return instance;
};

var chainResult = function(instance, obj) {
    return instance._chain ? _(obj).chain() : obj;
};
_.mixin = function(obj) {
    _.each(_.functions(obj), function(name) {
        var func = _[name] = obj[name];
        _.prototype[name] = function() {
            var args = [this._wrapped];
            push.apply(args, arguments);
            return chainResult(this, func.apply(_, args));
        };
    });
    return _;
};
_.mixin(_);
_.prototype.value = function() {
    return this._wrapped;
};
```
可以看出和原来版本的模式基本一致，不过有几点不一样的地方：

* 不使用额外的`wrapper`函数,而是直接使用`_`本身作为构造，相应的将所有的静态方法挂载到`_.prototype`上面。并且在构造的过程中使用了安全模式:` if (!(this instanceof _)) return new _(obj);`。下面的示例代码可以看出，安全模式即是可以忽略`new`来构造实例，关键代码：
```javascript
function Foo() {
    console.log(this instanceof Foo);
}

Foo();  // false 
new Foo(); // true
// 可以在为false的情况下在函数内部增加 new Foo
```
* 添加mixin方法，和其他库中的`mixin`方法类似，作用是想`_.prototype`中添加方法，这样就给用户添加其他方法的能力！！！

##### 原生方法的绑定 #####

**underscore**中也绑定了数组原生的一部分方法，它是这样做的：

```javascript

var ArrayProto = Array.prototype;
_.each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
        var obj = this._wrapped;
        method.apply(obj, arguments);
        if ((name === 'shift' || name === 'splice') && obj.length === 0) delete obj[0];
        return chainResult(this, obj);
    };
});

_.each(['concat', 'join', 'slice'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
        return chainResult(this, method.apply(this._wrapped, arguments));
    };
});
```
因为上面的方法(pop,push..)直接改变的是数组本身，所以想要获取处理结果，直接获取`this._wrapped`就可以,而下面的方法（concat）,返回的是生成的结果，需要被传递给`chainResult`函数。

##### 模块化代码 #####

```javascript
// Establish the root object, `window` (`self`) in the browser, `global`
// on the server, or `this` in some virtual machines. We use `self`
// instead of `window` for `WebWorker` support.
var root = typeof self == 'object' && self.self === self && self ||
    typeof global == 'object' && global.global === global && global ||
    this ||
    {};

// Export the Underscore object for **Node.js**, with
// backwards-compatibility for their old module API. If we're in
// the browser, add `_` as a global object.
// (`nodeType` is checked to ensure that `module`
// and `exports` are not HTML elements.)
if (typeof exports != 'undefined' && !exports.nodeType) {
    if (typeof module != 'undefined' && !module.nodeType && module.exports) {
        exports = module.exports = _;
    }
    exports._ = _;
} else {
    root._ = _;
}
  // AMD registration happens at the end for compatibility with AMD loaders
  // that may not enforce next-turn semantics on modules. Even though general
  // practice for AMD registration is to be anonymous, underscore registers
  // as a named module because, like jQuery, it is a base library that is
  // popular enough to be bundled in a third party lib, but not be part of
  // an AMD load request. Those cases could generate an error when an
  // anonymous define() is called outside of a loader request.
  if (typeof define == 'function' && define.amd) {
    define('underscore', [], function() {
      return _;
    });
  }
```




