const path = require('path')
const fs = require('fs')
const { parse } = require('@babel/parser')
const traverse = require('@babel/traverse')
const ejs = require('ejs')
const { transformFromAst } = require('@babel/core')

const selfLoader = require('./loader.js');
const JSONLoader = require('./json-loader.js');
const { SyncHook } = require('tapable')
const OutputPlugin = require('./outputPlugin.js');

const webpackConfig = {
  module: {
    rules: [
      {
        test: /\.json$/i,
        loader: JSONLoader,
      },
      {
        test: /\.js$/i,
        use: [selfLoader],
      },
    ],
  },
  plugins: [new OutputPlugin()]
}

// 实现webpack-plugin内部的compiler
const compiler = {
  outputPath: '../dist/built.js',
  hooks: {
    emitAsset: new SyncHook(['compilation'])
  }
}

// 因为webpack-plugin用到了tabable，所以需要先注册，然后在某个webapck的生命周期才会执行。因此要先触发注册事件
const initPlugin = () => {
  if (webpackConfig.plugins) {
    webpackConfig.plugins.map(plugin => {
      // webpack-plugin需要在class内实现一个apply方法用于接收compiler，
      // 之后通过compiler和之后在生命周期调用指定compiler hooks的时候传入的compilation来做一系列操作
      plugin.apply(compiler)
    })
  }
}

// 初始化插件
initPlugin();

const entryPath = path.resolve(__dirname, '../src/index.js')

// id是用来生成模板时用作map的
// 这个map已依赖的文件路径为key，以id为值
let id = 0;
// 获取单个文件模块的信息
const getMoudleInfo = (filepath) => {
  // 获取源文件信息
  let source = fs.readFileSync(filepath, {
    encoding: 'utf-8'
  });

  // 因为loader会有this，this指向的就是loader的上下文，所以我们定义一个loaderContext
  const webpackLoaderContext = {
    data: 'loader-data',
    addDependency(dependency) {
      console.log('添加到了依赖', dependency);
    }
  }

  // 如果有loader的话，在这里加上loader的处理，因为loader基本都是对文件进行操作的，所以会在加载依赖图的时候进行loader的注册和触发
  webpackConfig.module.rules.map(item => {
    if (item.test.test(filepath)) {
      // 如果是单个loader
      if (item.loader) {
        // 将loader处理过的源代码替换掉原来的source
        // source = item.loader(source)
        // 因为webpack-loader中会有loader上下文，所以绑定this到loader山下文
        source = item.loader.call(webpackLoaderContext, source)
      } else if (item.use) {
        // 如果是多个loader
        // 因为loader是从后向前执行的，所以reverse一下
        item.use.reverse().map(singleLoader => {
          // 将loader处理过的源代码替换掉原来的source
          source = singleLoader.call(webpackLoaderContext, source)
        })
      }
    }
  })


  // 将源代码通过@babel/parser的parse方法转换成ast语法树
  const ast = parse(source, {
    sourceType: "module"
  })
  // 用作存储每个文件模块的依赖模块信息，以用来遍历递归所有的模块依赖关系生成依赖图
  const depsArr = []
  // 通过@babel/traverse遍历ast语法树拿到import语法引入的模块文件路径
  traverse.default(ast, {
    // 监听import声明，一旦识别到import语句，就触发该handle
    ImportDeclaration: function ({ node }) {
      // 我们先把依赖的路径转化成绝对路径，当然这一步并不是必须的，
      // 这个起初是通过用绝对路径来表示每个单独依赖模块，从而避免引入相对路径时相同文件的依赖出现错误而设计的。
      // 后来又采用了手动维护一个map信息，用id来定位具体的依赖模块
      node.source.value = path.resolve(path.dirname(filepath), node.source.value)
      // 将转化后的路径传入depsArr
      depsArr.push(node.source.value)
      // depsArr.push(path.resolve(path.dirname(filepath),node.source.value))
    }
  })
  // 将代码中所有的import语法转成cjs的require的方式
  const { code } = transformFromAst(ast, null, {
    presets: ['env']
  })
  return {
    source: code, filepath, depsArr,
  }
}



// 生成依赖关系图
const getGraphInfo = (filepath) => {
  const moduleInfo = getMoudleInfo(filepath);
  const graph = [moduleInfo]
  for (const module of graph) {
    // 维护每一个模块的map信息，用作标识每一个被依赖的模块，从而能正确的加载每个引入的模块
    module.mapping = {}
    // 根据moduleInfo上的依赖数组来遍历被依赖的文件
    module.depsArr.forEach(depPath => {
      // 用来维护map的id值
      id++;
      const child = getMoudleInfo(depPath)
      module.mapping = {
        ...module.mapping,
        [depPath]: id
      }
      // 递归。每找到一个依赖模块，都要重复graph的步骤，直到该模块再也没有引入其他子模块为止
      graph.push(child)
    });
  }
  return graph
}

function build(graph) {
  // 拿到定义的target.ejs模板文件的utf-8的内容
  // 因为webpack会将很多小文件打包成一个大文件，而上面我们也会将所有模块的import语法转换成require语法
  // 然后转化后的require语法浏览器依然是不支持的，因此就需要我们手动实现一个requre方法，相应的
  // module.epoxrts也要实现。具体的实现方法在target.ejs文件中
  const template = fs.readFileSync(path.resolve(__dirname, './target.ejs'), {
    encoding: 'utf-8'
  })
  // 通过ejs的库将模板通过动态数据来渲染成我们需要的动态的打包后的目标文件
  const targetCode = ejs.render(template, { data: graph })

  // 将bundle之后的文件输出到dist/built.js文件
  // fs.writeFileSync(path.resolve(__dirname, '../dist/built.js'), targetCode)

  // 实现webpack-plugin的compilation对象
  const compilation = {
    changeOutputPath(path) {
      compiler.outputPath = path;
    }
  }
  // 对标webpack-plugin的emitAsset方法，因为是更改输出资源的，所以要在输出最终资源前调用
  compiler.hooks.emitAsset.call(compilation)

  // 假设有一个compiler保存着webpack中的所有信息，那当然也有outputPath，当然这个outputPath也会因为用户外部输入而覆盖掉
  fs.writeFileSync(path.resolve(__dirname, compiler.outputPath), targetCode)
}
const moduleInfo = getGraphInfo(entryPath)

// node 运行该文件是自动开始build
build(moduleInfo);