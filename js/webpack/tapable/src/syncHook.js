const { SyncHook } = require('../lib/index')


const hook = new SyncHook(["arg1", "arg2", "arg3"]);

hook.tap('1', function () {
  const _args = [...arguments];
  // console.log(`_args`, _args);

})
// hook.tap('2', function () {
//   const _args = [...arguments];
//   // console.log(`_args`, _args);

// })
// hook.call('a1', 'a2', 'a3')
// lhook.call
console.log(hook.call.toString())


// console.log(3);
