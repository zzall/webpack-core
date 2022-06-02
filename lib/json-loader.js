/**
 * 实现一个可以识别json文件，并转化成js的loader
 * @param {*} content 
 * @returns 
 */

 module.exports = function (content) {

  // 尝试访问loader的this
  this.addDependency('我是依赖的dependency')
  console.log('content',content)

  return `module.exports = ${JSON.stringify(content)}`
}