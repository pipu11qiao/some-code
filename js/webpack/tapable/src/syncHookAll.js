const {
  SyncHook, SyncBailHook, SyncWaterfallHook, SyncLoopHook,
} = require('../lib/index')


// const hook = new SyncHook(["arg1", "arg2"]);
// const hook = new SyncWaterfallHook(["arg1", "arg2"]);
// const hook = new SyncLoopHook(["arg1", "arg2"]);
const hook = new SyncBailHook(["arg1", "arg2"]);

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
current fn content:
// bail
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
// waterfloor
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
// loop
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

1 a1 a2
2 a1 a2
3 a1 a2
*/
