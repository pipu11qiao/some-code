const { SyncHook } = require('../lib/index')


const hook = new SyncHook(["arg1", "arg2"]);

hook.tap({
  name: '1',
  context: true,
}, function (_context, arg1, arg2) {
  _context.msg = 'okk'
  console.log('1', arg1, arg2)
})

hook.tap('2', function (arg1, arg2) {
  console.log('2', arg1, arg2)
})

hook.tap({
  name: '3',
  context: true,
}, function (_context, arg1, arg2) {
  console.log(_context.msg)
  console.log('3', arg1, arg2)
})

hook.call('a1', 'a2', 'a3')
/* 输出
current fn content:

function anonymous(arg1, arg2
) {
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
1 a1 a2
2 a1 a2
okk
3 a1 a2
*/