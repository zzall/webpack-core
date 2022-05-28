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
   
    0: [function (require, module,exports) {
      "use strict";

var _printUtils = require("/Users/babytree/Desktop/study/webpack-core/src/printUtils.js");

require("/Users/babytree/Desktop/study/webpack-core/src/js/index1.js");

console.log('pringName', (0, _printUtils.printName)());
console.log('index.js'); 
  
    },
      {"/Users/babytree/Desktop/study/webpack-core/src/printUtils.js":1,"/Users/babytree/Desktop/study/webpack-core/src/js/index1.js":2} 
    ],
   
    1: [function (require, module,exports) {
      "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.printName = printName;

var _test = require("/Users/babytree/Desktop/study/webpack-core/src/test1.js");

var _test2 = _interopRequireDefault(_test);

var _test3 = require("/Users/babytree/Desktop/study/webpack-core/src/test2.js");

var _test4 = _interopRequireDefault(_test3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function printName() {
  console.log('内部的printName');
  return 'zzz';
} 
  
    },
      {"/Users/babytree/Desktop/study/webpack-core/src/test1.js":3,"/Users/babytree/Desktop/study/webpack-core/src/test2.js":4} 
    ],
   
    2: [function (require, module,exports) {
      "use strict";

console.log('js/index1.js'); 
  
    },
      {} 
    ],
   
    3: [function (require, module,exports) {
      "use strict";

console.log('我是test1'); 
  
    },
      {} 
    ],
   
    4: [function (require, module,exports) {
      "use strict";

var _test = require("/Users/babytree/Desktop/study/webpack-core/src/test3.js");

var _test2 = _interopRequireDefault(_test);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

console.log('我是test2', _test2.default); 
  
    },
      {"/Users/babytree/Desktop/study/webpack-core/src/test3.js":5} 
    ],
   
    5: [function (require, module,exports) {
      "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
console.log('test3');
exports.default = 'test3'; 
  
    },
      {} 
    ],
   
  
})





