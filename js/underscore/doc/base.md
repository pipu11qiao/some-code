## underscore.js 代码基本结构 ##

本文将介绍**underscore**中是怎么组织自己的函数的, **underscore**的核心内容就是它在文档中的介绍: 提供了100多个常用的帮助函数：map,filter,invoke,当然还有其它特别的很好用的函数。所以它的基本代码结构就是为了更好的或者更方便的使用这些函数来服务的， 包括是怎么完成技能以静态方式调用也能链式调用，防止命名冲突以及常规的符合amd，cmd和其他的模块规范的对接等等。除了涉及到的函数，**underscore**中的其他函数不会详细介绍。

### 基本结构的“进化” ###

##### 开始的样子 #####

所谓的“进化”，就是版本的进化，同时也是代码更加健壮，更符合规范的变化。如果让我们来组织**underscore**的代码，就是将这些函数组织起来，第一反应就是一个单例含有很多方法。就像：

```javascript
window.Underscore = {
    each: function() { },
    map: function() { },
    // ...剩下的方法
};
window._ = window.Underscore;
```
这就是**underscore**最开始的样子，<a href="https://github.com/jashkenas/underscore/blob/0.1.1/underscore.js#L8" target="_blank">定义一个单例Underscore</a>,将<a href="https://github.com/jashkenas/underscore/blob/0.1.1/underscore.js#L426" target="_blank">变量`_`</a> 也指向这个单例,所有的函数都是这个单例的方法(静态方法)。

##### 防止命名冲突以及作用域 #####

**underscore**处理命名冲突的方法和jQuery一样的，都是先保留原来`_`引用，在调用处理冲突的方法`noConflict`将保留的引用赋值给`_`。

```javascript
window.Underscore = {
  PREVIOUS_UNDERSCORE : window._,
  noConflict : function() {
    window._ = Underscore.PREVIOUS_UNDERSCORE;
    return this;
  },
}
```

在最开始的代码中,代码直接在全局作用域执行，后来又使用自执行函数包裹，创建Underscore自己的作用域。

```javascript
(function() {
    window.Underscore = {
        each: function() { },
        // ...剩下的方法
    };
    window._ = window.Underscore;
})()
```

##### 链式调用 #####

在**underscore**0.4.0版本以前，使用其方法的方式,只有直接使用`_`的静态方法的方式。

```javascript
_.map([1, 2, 3], function(n){ return n * 2; });
```

underscore中很多方法是来处理集合（数组，对象，类数组），在处理这种类型的数据时有时需要不止一次调用**underscore**方法来处理从而得到正确的结果，例如，从服务达到一个数组类型的的数据，每个元素是个item对象，我们要做的事给item对象添加index属性，然后过滤，然后生成给字典。如果使用静态方法：

```javascript
var serverData = [
    { val: 3 },
    { val: 6 },
    { val: 4 },
    { val: 5 },
];
var result = _.map(serverData, function(item, index) {
    item.index = index;
    return item;
});
result = _.filter(result, function(item) {
    return item.val > 4;
})
result = _.reduce(result, {}, function(map, item) {
    map[item.index] = item;
    return map;
})
console.log(result);
//结果 { '1': { val: 6, index: 1 }, '3': { val: 5, index: 3 } }
```
每当这种情况使用起来很不方便,在0.4.0中加入了链式调用的风格
underscore中到链式调用可以分解为两步：

1. 第一步将静态方法转为原型方法，每个要处理的数据通过包装方式转为实例。因为链式调用这种模式只有通过构造实例使用原型的方法来实现，而**underscore**只是静态方法需要先转为原型方法。具体的步骤就是

    * 创建一个包裹函数(构造函数)，将传入的待处理对象当做实例的属性保存

    ```javascript
        var wrapper = function(obj) { this._wrapped = obj; };
        var _ = root._ = function(obj) { return new wrapper(obj); };
    ```
    * 剩下的就是将`_`的静态方法挂载到`wrapper`函数的原型上并且在调用的时候将其`_wrapped`属性保存的数据当做这些方法的第一个参数调用。(因为处理集合的方法的第一个参数都是这个待处理的对象)

    ```javascript
        _.each([_的所有的的静态方法], function(name) {
            wrapper.prototype[name] = function() {
                Array.prototype.unshift.call(arguments, this._wrapped);
                // 参数列表变成【this._wrapped,...剩下的参数】
                var result = _[name].apply(_, arguments);
                return  result;
            };
        });
    ```
到目前为止我们已经将`-`改造成一个和原来一样能调用静态方法，同时也可以将传入的数据转为一个可以调动原来是静态方法的实例，例如：

```javascript
// 原来的调用方式
_.map([1, 2, 3], function(n){ return n * 2; });
// 新增的调用方式
_([1, 2, 3]).map(function(n){ return n * 2; });
```
这两种方式的结果是一样的，关键是`_([1,2,3])`返回的是一个含有所有方法的实例。

```javascript
    console.log(_([1,2,3]));
    // wrapper { _wrapped: [ 1, 2, 3 ] }
```
wrapper 实例可以调用原来的静态方法

2. 接下来就是想实例原型的方法中不能链式调用改为链式调用的了，很简单，返回`this`。但又要同时保持非链式调用的时候直接返回结果。**underscore**中直接在`wrapper`实例上添加了一个`_chain`参数，表示是否是链式调用，提供了一个`chain`方法来开启链式调用，同时原来的原型方法修改为：

```javascript
_.each(_.functions(), function(name) {
    wrapper.prototype[name] = function() {
        Array.prototype.unshift.call(arguments, this._wrapped);
        var result = _[name].apply(_, arguments);
        return this._chain ? _(result).chain() : result; // 只有这里做了修改，在_chain为真是返回wrapper实例,
    };
});

// 开启链式调用，并且返回 wrapper实例本身
wrapper.prototype.chain = function() {
    this._chain = true;
    return this;
};
```
在原型方法返回结果的时候，若果是链式调用返回的是`_(result).chain()`,将返回的结果存为新的wrapper实例并且也为当前实例开启链式调用。

已经能够链式调用原来的方法了，但是在调用的最后还没有拿到数据处理的结果，很简单，将最后的`warpper`实例的`_wapped`属性返回就好了。

```javascript
wrapper.prototype.get = function() {
    return this._wrapped;
};
```

以上就是**underscore**在0.4.0版本中的基本结构，后续的版本都是在这个基础上的优化。接下来是模块化的部分，以及其结构的后续“进化”。
