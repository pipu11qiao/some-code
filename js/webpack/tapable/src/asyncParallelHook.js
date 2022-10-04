const {
  SyncHook,
  SyncBailHook,
  SyncWaterfallHook,
  SyncLoopHook,
  AsyncParallelHook,
  AsyncParallelBailHook,
  AsyncSeriesHook,
  AsyncSeriesBailHook,
  AsyncSeriesWaterfallHook
} = require("../lib/index");


const hook = new AsyncParallelHook(["arg1", "arg2"]);

// hook.tap('1', function (arg1, arg2) {
//   console.log('1', arg1, arg2)
// })

// hook.tap('2', function (arg1, arg2) {
//   console.log('2', arg1, arg2)
// })

// hook.tap('3', function (arg1, arg2) {
//   console.log('3', arg1, arg2)
// })

// hook.tapAsync('1', function (arg1, arg2) {
//   console.log('1', arg1, arg2)
// })

// hook.tapAsync('2', function (arg1, arg2) {
//   console.log('2', arg1, arg2)
// })

// hook.tapAsync('3', function (arg1, arg2) {
//   console.log('3', arg1, arg2)
// })

hook.tapPromise('1', function (arg1, arg2) {
  // console.log('1', arg1, arg2)
  return Promise.resolve('1')
})

hook.tapPromise('2', function (arg1, arg2) {
  // console.log('2', arg1, arg2)
  return Promise.resolve('2')
})

hook.tapPromise('3', function (arg1, arg2) {
  // console.log('3', arg1, arg2)
  return Promise.resolve('3')
})


hook.callAsync('a1', 'a2', (res) => {
  console.log(`res`, res);
})
// hook.promise('a1', 'a2', (res) => {
//   console.log(`res`, res);
// })

/* 输出: 
current fn content:
tap allAsync
function anonymous(arg1, arg2, _callback) {
  "use strict";
  var _context;
  var _x = this._x;
  do {
    var _counter = 3;
    var _done = (function () {
      _callback();
    });
    if (_counter <= 0) break;
    var _fn0 = _x[0];
    var _hasError0 = false;
    try {
      _fn0(arg1, arg2);
    } catch (_err) {
      _hasError0 = true;
      if (_counter > 0) {
        _callback(_err);
        _counter = 0;
      }
    }
    if (!_hasError0) {
      if (--_counter === 0) _done();
    }
    if (_counter <= 0) break;
    var _fn1 = _x[1];
    var _hasError1 = false;
    try {
      _fn1(arg1, arg2);
    } catch (_err) {
      _hasError1 = true;
      if (_counter > 0) {
        _callback(_err);
        _counter = 0;
      }
    }
    if (!_hasError1) {
      if (--_counter === 0) _done();
    }
    if (_counter <= 0) break;
    var _fn2 = _x[2];
    var _hasError2 = false;
    try {
      _fn2(arg1, arg2);
    } catch (_err) {
      _hasError2 = true;
      if (_counter > 0) {
        _callback(_err);
        _counter = 0;
      }
    }
    if (!_hasError2) {
      if (--_counter === 0) _done();
    }
  } while (false);

}
current fn content:
tap promise
function anonymous(arg1, arg2) {
  "use strict";
  var _context;
  var _x = this._x;
  return new Promise((function (_resolve, _reject) {
    var _sync = true;
    function _error(_err) {
      if (_sync)
        _resolve(Promise.resolve().then((function () { throw _err; })));
      else
        _reject(_err);
    };
    do {
      var _counter = 3;
      var _done = (function () {
        _resolve();
      });
      if (_counter <= 0) break;
      var _fn0 = _x[0];
      var _hasError0 = false;
      try {
        _fn0(arg1, arg2);
      } catch (_err) {
        _hasError0 = true;
        if (_counter > 0) {
          _error(_err);
          _counter = 0;
        }
      }
      if (!_hasError0) {
        if (--_counter === 0) _done();
      }
      if (_counter <= 0) break;
      var _fn1 = _x[1];
      var _hasError1 = false;
      try {
        _fn1(arg1, arg2);
      } catch (_err) {
        _hasError1 = true;
        if (_counter > 0) {
          _error(_err);
          _counter = 0;
        }
      }
      if (!_hasError1) {
        if (--_counter === 0) _done();
      }
      if (_counter <= 0) break;
      var _fn2 = _x[2];
      var _hasError2 = false;
      try {
        _fn2(arg1, arg2);
      } catch (_err) {
        _hasError2 = true;
        if (_counter > 0) {
          _error(_err);
          _counter = 0;
        }
      }
      if (!_hasError2) {
        if (--_counter === 0) _done();
      }
    } while (false);
    _sync = false;
  }));

}


current fn content:
tapAsync callAsync
function anonymous(arg1, arg2, _callback) {
  "use strict";
  var _context;
  var _x = this._x;
  do {
    var _counter = 3;
    var _done = (function () {
      _callback();
    });
    if (_counter <= 0) break;
    var _fn0 = _x[0];
    _fn0(arg1, arg2, (function (_err0) {
      if (_err0) {
        if (_counter > 0) {
          _callback(_err0);
          _counter = 0;
        }
      } else {
        if (--_counter === 0) _done();
      }
    }));
    if (_counter <= 0) break;
    var _fn1 = _x[1];
    _fn1(arg1, arg2, (function (_err1) {
      if (_err1) {
        if (_counter > 0) {
          _callback(_err1);
          _counter = 0;
        }
      } else {
        if (--_counter === 0) _done();
      }
    }));
    if (_counter <= 0) break;
    var _fn2 = _x[2];
    _fn2(arg1, arg2, (function (_err2) {
      if (_err2) {
        if (_counter > 0) {
          _callback(_err2);
          _counter = 0;
        }
      } else {
        if (--_counter === 0) _done();
      }
    }));
  } while (false);
}

current fn content:
tapAync promise
function anonymous(arg1, arg2) {
  "use strict";
  var _context;
  var _x = this._x;
  return new Promise((function (_resolve, _reject) {
    var _sync = true;
    function _error(_err) {
      if (_sync)
        _resolve(Promise.resolve().then((function () { throw _err; })));
      else
        _reject(_err);
    };
    do {
      var _counter = 3;
      var _done = (function () {
        _resolve();
      });
      if (_counter <= 0) break;
      var _fn0 = _x[0];
      _fn0(arg1, arg2, (function (_err0) {
        if (_err0) {
          if (_counter > 0) {
            _error(_err0);
            _counter = 0;
          }
        } else {
          if (--_counter === 0) _done();
        }
      }));
      if (_counter <= 0) break;
      var _fn1 = _x[1];
      _fn1(arg1, arg2, (function (_err1) {
        if (_err1) {
          if (_counter > 0) {
            _error(_err1);
            _counter = 0;
          }
        } else {
          if (--_counter === 0) _done();
        }
      }));
      if (_counter <= 0) break;
      var _fn2 = _x[2];
      _fn2(arg1, arg2, (function (_err2) {
        if (_err2) {
          if (_counter > 0) {
            _error(_err2);
            _counter = 0;
          }
        } else {
          if (--_counter === 0) _done();
        }
      }));
    } while (false);
    _sync = false;
  }));

}

current fn content:
tapPromise promise
function anonymous(arg1, arg2) {
  "use strict";
  var _context;
  var _x = this._x;
  return new Promise((function (_resolve, _reject) {
    var _sync = true;
    function _error(_err) {
      if (_sync)
        _resolve(Promise.resolve().then((function () { throw _err; })));
      else
        _reject(_err);
    };
    do {
      var _counter = 3;
      var _done = (function () {
        _resolve();
      });
      if (_counter <= 0) break;
      var _fn0 = _x[0];
      var _hasResult0 = false;
      var _promise0 = _fn0(arg1, arg2);
      if (!_promise0 || !_promise0.then)
        throw new Error('Tap function (tapPromise) did not return promise (returned ' + _promise0 + ')');
      _promise0.then((function (_result0) {
        _hasResult0 = true;
        if (--_counter === 0) _done();
      }), function (_err0) {
        if (_hasResult0) throw _err0;
        if (_counter > 0) {
          _error(_err0);
          _counter = 0;
        }
      });
      if (_counter <= 0) break;
      var _fn1 = _x[1];
      var _hasResult1 = false;
      var _promise1 = _fn1(arg1, arg2);
      if (!_promise1 || !_promise1.then)
        throw new Error('Tap function (tapPromise) did not return promise (returned ' + _promise1 + ')');
      _promise1.then((function (_result1) {
        _hasResult1 = true;
        if (--_counter === 0) _done();
      }), function (_err1) {
        if (_hasResult1) throw _err1;
        if (_counter > 0) {
          _error(_err1);
          _counter = 0;
        }
      });
      if (_counter <= 0) break;
      var _fn2 = _x[2];
      var _hasResult2 = false;
      var _promise2 = _fn2(arg1, arg2);
      if (!_promise2 || !_promise2.then)
        throw new Error('Tap function (tapPromise) did not return promise (returned ' + _promise2 + ')');
      _promise2.then((function (_result2) {
        _hasResult2 = true;
        if (--_counter === 0) _done();
      }), function (_err2) {
        if (_hasResult2) throw _err2;
        if (_counter > 0) {
          _error(_err2);
          _counter = 0;
        }
      });
    } while (false);
    _sync = false;
  }));

}

current fn content:

function anonymous(arg1, arg2, _callback) {
  "use strict";
  var _context;
  var _x = this._x;
  do {
    var _counter = 3;
    var _done = (function () {
      _callback();
    });
    if (_counter <= 0) break;
    var _fn0 = _x[0];
    var _hasResult0 = false;
    var _promise0 = _fn0(arg1, arg2);
    if (!_promise0 || !_promise0.then)
      throw new Error('Tap function (tapPromise) did not return promise (returned ' + _promise0 + ')');
    _promise0.then((function (_result0) {
      _hasResult0 = true;
      if (--_counter === 0) _done();
    }), function (_err0) {
      if (_hasResult0) throw _err0;
      if (_counter > 0) {
        _callback(_err0);
        _counter = 0;
      }
    });
    if (_counter <= 0) break;
    var _fn1 = _x[1];
    var _hasResult1 = false;
    var _promise1 = _fn1(arg1, arg2);
    if (!_promise1 || !_promise1.then)
      throw new Error('Tap function (tapPromise) did not return promise (returned ' + _promise1 + ')');
    _promise1.then((function (_result1) {
      _hasResult1 = true;
      if (--_counter === 0) _done();
    }), function (_err1) {
      if (_hasResult1) throw _err1;
      if (_counter > 0) {
        _callback(_err1);
        _counter = 0;
      }
    });
    if (_counter <= 0) break;
    var _fn2 = _x[2];
    var _hasResult2 = false;
    var _promise2 = _fn2(arg1, arg2);
    if (!_promise2 || !_promise2.then)
      throw new Error('Tap function (tapPromise) did not return promise (returned ' + _promise2 + ')');
    _promise2.then((function (_result2) {
      _hasResult2 = true;
      if (--_counter === 0) _done();
    }), function (_err2) {
      if (_hasResult2) throw _err2;
      if (_counter > 0) {
        _callback(_err2);
        _counter = 0;
      }
    });
  } while (false);

}
1 a1 a2
2 a1 a2
3 a1 a2
res undefined
*/




