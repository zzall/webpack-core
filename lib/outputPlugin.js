/**
 * 实现一个更改输出目录的插件
 * @param {*} content 
 * @returns 
 */

module.exports = class ChangeOutputPath{
  constructor(options) {
    this.options = options
  }
  apply(compiler) {
    compiler.hooks.emitAsset.tap('dist/newtest.js', (compilation) => {
      compilation.changeOutputPath('../dist/test2.js')
    })
  }

}