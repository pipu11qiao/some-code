var debug = require('../src/index')('test:log');
console.log(`333`, 333);
debug.log = console.log.bind(console); // don't forget to bind to console!

debug('ookkk');