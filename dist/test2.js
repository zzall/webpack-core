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

var _data = require("/Users/babytree/Desktop/study/webpack-core/src/data.json");

var _data2 = _interopRequireDefault(_data);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

console.log('====我是zzz===!!!pringName', (0, _printUtils.printName)());
console.log('====我是zzz===!!!index.js');
console.log('====我是zzz===!!!json--测试json-loader的功能', _data2.default); 
  
    },
      {"/Users/babytree/Desktop/study/webpack-core/src/printUtils.js":1,"/Users/babytree/Desktop/study/webpack-core/src/js/index1.js":2,"/Users/babytree/Desktop/study/webpack-core/src/data.json":3} 
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
  console.log('====我是zzz===!!!内部的printName');
  return 'zzz';
} 
  
    },
      {"/Users/babytree/Desktop/study/webpack-core/src/test1.js":4,"/Users/babytree/Desktop/study/webpack-core/src/test2.js":5} 
    ],
   
    2: [function (require, module,exports) {
      "use strict";

console.log('====我是zzz===!!!js/index1.js'); 
  
    },
      {} 
    ],
   
    3: [function (require, module,exports) {
      "use strict";

module.exports = "{\n  \"name\": \"zzz\",\n  \"age\": 21\n}"; 
  
    },
      {} 
    ],
   
    4: [function (require, module,exports) {
      "use strict";

console.log('====我是zzz===!!!我是test1'); 
  
    },
      {} 
    ],
   
    5: [function (require, module,exports) {
      "use strict";

var _test = require("/Users/babytree/Desktop/study/webpack-core/src/test3.js");

var _test2 = _interopRequireDefault(_test);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

console.log('====我是zzz===!!!我是test3', _test2.default); 
  
    },
      {"/Users/babytree/Desktop/study/webpack-core/src/test3.js":6} 
    ],
   
    6: [function (require, module,exports) {
      "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
console.log('====我是zzz===!!!test3');
exports.default = 'test3'; 
  
    },
      {} 
    ],
   
  
});
