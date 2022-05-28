const path = require('path')
const fs = require('fs')
const { parse } = require('@babel/parser')
const traverse = require('@babel/traverse')
const ejs = require('ejs')
const { transformFromAst } = require('@babel/core')

const entryPath = path.resolve(__dirname, '../src/index.js')

let id = 0;
const getFileInfo = (filepath) => {
  let source = fs.readFileSync(filepath, {
    encoding: 'utf-8'
  });
  const ast = parse(source, {
    sourceType: "module"
  })
  const depsArr = []
  traverse.default(ast, {
    ImportDeclaration: function ({ node }) {
      node.source.value = path.resolve(path.dirname(filepath), node.source.value)
      depsArr.push(node.source.value)
      // depsArr.push(path.resolve(path.dirname(filepath),node.source.value))
    }
  })
  const { code } = transformFromAst(ast, null, {
    presets: ['env']
  })
  return {
    source: code, filepath, depsArr,
  }
}




const getMoudleInfo = (filepath) => {
  const fileInfo = getFileInfo(filepath);
  const graph = [fileInfo]
  for (const module of graph) {
    module.mapping = {}
    module.depsArr.forEach(depPath => {
      id++;
      const child = getFileInfo(depPath)
      module.mapping = {
        ...module.mapping,
        [depPath]: id
      }
      graph.push(child)
    });
  }
  return graph
}

function build(graph) {
  const template = fs.readFileSync(path.resolve(__dirname, './target.ejs'), {
    encoding: 'utf-8'
  })
  const targetCode = ejs.render(template, { data: graph })

  fs.writeFileSync(path.resolve(__dirname, '../dist/built.js'), targetCode)
}
const moduleInfo = getMoudleInfo(entryPath)

build(moduleInfo);