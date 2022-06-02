module.exports = function (content) {

  // 尝试访问loader的this
  this.addDependency('我是依赖的dependency')

  console.log('content', content,content.replace(/console\.log\('/g,'console\.log\(\'====我是zzz===!!!'))
  return content.replace(/console\.log\('/g,'console\.log\(\'====我是zzz===!!!')
}