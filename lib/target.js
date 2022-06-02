; (function (map) {
  function require(id) {
    if( typeof id === 'undefined')return;
    const [fn,idMap] = map[id]
    const module = {
      exports: {}
    }
    const loaclRequire = path=>{
      return require(idMap[path])
    }
    fn(loaclRequire, module,module.exports)
    return module.exports
  };

  require(0)
})({
  0: [function index(require, module) {
    const { printName } = require('./printUtils.js')
    console.log('pringName', printName())
    console.log('index.js')

  },{
    './printUtils.js':1
  }],
  1: [function printUtils(require, module) {
    module.exports = {
      printName: function () {
        console.log('内部的printName')
        return 'zzz'
      }
    }
  },{}],
})





