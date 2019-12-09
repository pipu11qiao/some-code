在underscore中有一个`Ctor`函数，代码如下：
```javascript
  var Ctor = function(){};
  var nativeCreate = Object.create;
  var baseCreate = function(prototype) {
    if (!_.isObject(prototype)) return {};
    if (nativeCreate) return nativeCreate(prototype);
    Ctor.prototype = prototype;
    var result = new Ctor;
    Ctor.prototype = null;
    return result;
  };
```

可以看出这个函数式`Object.create`的腻子脚本（polyfll），而`Object.create`的作用是
> 使用给定的对象当做原型，创建一个新的对象

