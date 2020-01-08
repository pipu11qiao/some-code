这就是经典的事件注册和触发机制啊。实际使用的时候，声明事件和触发事件的代码通常在一个类中，注册事件的代码在另一个类（我们的插件）中。代码如下：
```javascript
// Car.js
import { SyncHook } from 'tapable';

export default class Car {
  constructor() {
    this.startHook = new SyncHook();
  }

  start() {
    this.startHook.call();
  }
}
```

```javascript
// index.js
import Car from './Car';

const car = new Car();
car.startHook.tap('startPlugin', () => console.log('我系一下安全带'));
car.start();
```
钩子的使用基本就是这个意思，Car中只负责声明和调用钩子，真正的执行逻辑，不再Car中，而是在注册它的index.js之中，是在Car之外。这样就做到了很好的解耦。

对于Car而言，通过这种注册插件的方式，丰富自己的功能。

