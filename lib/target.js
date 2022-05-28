; (function (map) {
  function require(id) {
    const [fn,idMap] = map[id]
    const module = {
      exports: {}
    }
    const loaclRequire = path=>{
      return require(idMap[path])
    }
    fn(loaclRequire, module)
    return module.exports
  };

  require(1)
})({
  1: [function index(require, module) {
    const { printName } = require('./printUtils.js')
    // import { printName } from './printUtils.js'

    console.log('pringName', printName())
    console.log('index.js')

  },{
    './printUtils.js':2
  }],
  2: [function printUtils(require, module) {
    // import test from './test.js'
    // import test2 from './test2.js'
    module.exports = {
      printName: function () {
        console.log('内部的printName')
        return 'zzz'
      }
    }
  },{}],
})





