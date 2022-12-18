
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g
// [{name: 'id', value:'app'}, { name: 'name', value: '1'}, {name: 'style', value: 'background: red; font-size: 30px;'}]
function genProps(attrs) {
  let str = ''
  console.log('attrs:', attrs)
  attrs.forEach(item=>{
    // 针对style属性特殊处理
    if(item.name === 'style') {
      let styleObj = {}
      item.value.replace(/([^:;]+)\:([^:;]+)/g, function(){
        styleObj[arguments[1]] = arguments[2].trim()
      })
      item.value = styleObj
    }
    // 值都需要加上双引号
    str += `${item.name}:${JSON.stringify(item.value)},`
  })
  /**
   * 转换后
   * {
   *  id: 'app',
   *  a: '1'
   * }
   */
  return `{${str.slice(0,-1)}}`
}

function genChildren(el) {
  let children = el.children
  if(children) {
    return children.map(child=> gen(child)).join(',')
  }
}

function gen(el) {
  // 元素节点
  if(el.type === 1) {
    return generate(el)
  }else if(el.type === 3) { // 文本节点
    let text = el.text
    // 不存在{{}}时
    if(!defaultTagRE.test(text)) {
      return `_v('${text}')`
    }else {
      // 可能文本是这种情况 hello {{name}} world
      let strs = []
      let match;
      // 每次都重新匹配，否则执行match之后改变了lastIndex索引后， exec匹配不到
      let lastIndex = defaultTagRE.lastIndex = 0
      while(match = defaultTagRE.exec(text)) {
        // 获取到{{的位置，截取之前的就是前一个字符串
        let index = match.index // 开始索引
        if(index>lastIndex) {
          strs.push(JSON.stringify(text.slice(lastIndex, index)))
        }
        // 由于{{}}里面的变量可能是对象所以需要进行转换
        strs.push(`_s(${match[1].trim()})`)
        // 获取}}的结尾下标
        lastIndex = index + match[0].length
      }
      if(lastIndex < text.length) {
         strs.push(JSON.stringify(text.slice(lastIndex)))
      }
      return `_v(${strs.join('+')})`
    }

    return `_v('${text}')`
  }
}
/* ast语法树=> 字符串
  { tag: 'div', type: 1, children: [
    {
      tag: 'span',
      type: 1,
      attrs: [],
      children: [
        text: 'aaa',
        type: 3,

      ]
    }
  ] parent: null, attrs: [ { name:'id', value:'app'} ]
  _c('div', {id: 'app', age: 10}, _c('span',))
 */
export function generate(el) {
  // 遍历树 将树拼接成字符串
  let children = genChildren(el)
  let code = `_c('${el.tag}',
    ${el.attrs && el.attrs.length? genProps(el.attrs): 'undefined'}
    ${ children ? `,${children}`:''}
  )`

  return code
}