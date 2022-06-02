module.exports = function (content) {
  console.log('content', content,content.replace(/console\.log\('/g,'console\.log\(\'====我是zzz===!!!'))
  return content.replace(/console\.log\('/g,'console\.log\(\'====我是zzz===!!!')
}