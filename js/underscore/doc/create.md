* create 函数,Object.create的腻子垫片。
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
    _.create = function(prototype, props) {
    var result = baseCreate(prototype);
    if (props) _.extendOwn(result, props);
    return result;
  };

```
`Object.create`的作用是
> 使用给定的对象当做原型，创建一个新的对象

