(function (modules) {
  function require(id) {
    const [fn, mapping] = modules[id];
    const module = {
      exports: {},
    }
    function localRequire(filePath) {
      const id = mapping[filePath]
      return require(id)
    }

    fn(localRequire, module, module.exports)
    return module.exports
  }
  require(1);
})({


  "1": [function (require, module, exports) {
    "use strict";

    var _foo = require("./foo.js");

    var _foo2 = _interopRequireDefault(_foo);

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

    (0, _foo2.default)();
    console.log('main');
  },
  { "./foo.js": 2 }],

  "2": [function (require, module, exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.default = foo;

    function foo() {
      console.log('foo');
    }
  },
  {}],

})
