/**
 * 实现在console.log前 添加 '===我是zzz===!!!'这样的前缀 的一个插件
 * @param {*} content 
 * @returns 
 */

module.exports = function (content) {

  // 尝试访问loader的this
  this.addDependency('我是依赖的dependency')

  return content.replace(/console\.log\('/g,'console\.log\(\'====我是zzz===!!!')
}