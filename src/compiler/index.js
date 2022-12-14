// 匹配多种标签中的属性 aa = "  xxx " | '  xxx ' | xxx
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/
const dynamicArgAttribute = /^\s*((?:v-[\w-]+:|@|:|#)\[[^=]+?\][^\s"'<>\/=]*)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/
// 标签名，如div
const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`
// 用来获取的标签名
const qnameCapture = `((?:${ncname}\\:)?${ncname})`
// 匹配开始标签<
const startTagOpen = new RegExp(`^<${qnameCapture}`)
// 匹配单标签自动关闭    />
const startTagClose = /^\s*(\/?)>/
// 匹配闭合标签<  />
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`)
// 匹配{{ xxxx }}
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g
const doctype = /^<!DOCTYPE [^>]+>/i
// #7298: escape - to avoid being passed as HTML comment when inlined in page
// 匹配注释<!--
const comment = /^<!\--/
const conditionalComment = /^<!\[/

// 将解析后的结果组装成一个树结构
function createAstElement(tagName,attrs) {
  return {
    tag: tagName,
    type: 1,
    children: [],
    parent: null,
    attrs
  }
}

// 解析html字符串 <div id="app"> {{name}}  </div>
export function compileToFunction(template) {
  parserHTML(template)
}
// html: <div id="app"> {{name}}  </div>
function parserHTML(html) {
  function advance(len) {
    html = html.substring(len)
  }
  function parseStartTag() {
    const start = html.match(startTagOpen)
    // 不是开始标签直接跳过
    if(!start) {
      return
    }
    if(start) {
      const match = {
        tagName: start[1],
        attrs: []
      }
      // html: id="app"> {{name}} </div>
      advance(start[0].length)
      let end;
      let attr
      // 如果没有匹配到结尾标识符>，并且匹配到属性，就不停的解析 html: > {{ name }} </div>
      while(!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
        advance(attr[0].length)
        // id="app"=> ['"id='app'"', 'id', '=', 'app']
        match.attrs.push({ name: attr[1], value: attr[3]})
      }
      // 删除结尾的>   html: {{ name }} </div>
      if(end) {
        advance(end.length)
      }
      return match
    }
  }
  // 边解析边删除
  while (html) {
    let textEnd = html.indexOf('<')
    if(textEnd==0) {
      // 解析开始标签
      const startTagMatch = parseStartTag(html)
      if(startTagMatch) {
        start(startTagMatch.tagName, startTagMatch.attrs)
        continue
      }

      const endTagMatch = html.match(endTag)
      if(endTagMatch) {
        advance(endTagMatch[0].length)
        end(endTagMatch[1])
        continue
      }
    }
    let text;
    if(textEnd>0) {
      // {{ name }} </div>
      // 获取文本的值
      text = html.substring(0,textEnd)
    }
    if(text) {
      chars(text)
      advance(text.length)
    }
  }

}

// 解析开始标签
function start(tagName, attributes) {
  console.log('start', tagName, attributes)
}
// 解析结束标签
function end(tagName) {
  console.log('end', tagName)
}
// 解析标签内容
function chars(text) {
  console.log('text', text)
}