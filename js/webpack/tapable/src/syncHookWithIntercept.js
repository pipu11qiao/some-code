const { SyncHook, SyncBailHook, SyncLoopHook } = require('../lib/index')


// const hook = new SyncHook(["arg1", "arg2"]);
// const hook = new SyncBailHook(["arg1", "arg2"]);
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
/* 输出: 
intercept register
1 is doing its job
intercept register
2 is doing its job
intercept register
3 is doing its job
current fn content:

function anonymous(arg1, arg2) {
  "use strict";
  var _context;
  var _x = this._x;
  var _taps = this.taps;
  var _interceptors = this.interceptors;
  _interceptors[0].call(arg1, arg2);
  var _tap0 = _taps[0];
  _interceptors[0].tap(_tap0);
  var _fn0 = _x[0];
  _fn0(arg1, arg2);
  var _tap1 = _taps[1];
  _interceptors[0].tap(_tap1);
  var _fn1 = _x[1];
  _fn1(arg1, arg2);
  var _tap2 = _taps[2];
  _interceptors[0].tap(_tap2);
  var _fn2 = _x[2];
  _fn2(arg1, arg2);

}
intercept call
intercept tap
1 a1 a2
intercept tap
2 a1 a2
intercept tap
3 a1 a2
*/