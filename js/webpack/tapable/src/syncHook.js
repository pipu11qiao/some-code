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

/* 输出: 
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
1 a1 a2
2 a1 a2
3 a1 a2
*/
