// 解析html字符串 <div id="app"> {{name}}  </div>
import {parserHTML} from "./parser";
import {generate} from "./generate";

export function compileToFunction(template) {
  /*
   将模板转化为ast抽象语法树
   {
    tag: 'div',
    type: 1,
    children: [],
    parent: [],
    attrs: [{name: 'id', value: 'app'}]
    text: 'aaa'
   }
   */
  let root = parserHTML(template)
  // html => ast语法树
  // ast语法树(只能描述语法，语法不存在的属性无法描述)=> render函数
  let code = generate(root)
  // 由于code中会获取 vm中的实例和方法，所以需要绑定vm实例
  let render = new Function(`with(this) { return ${code}}`)
  return render
  //  render => 虚拟dom（针对ast语法树，增加额外的属性）=> 生成真实dom
}


/*
1. 判断用户有没有传递render函数，没传入就判断是否传入的是template，template也没有传递就获取html
2. 将html词语解析转化成ast语法树(开始标签，结束标签，属性，文本)
3. codegen  将<div>hello</div> 转成字符串_c('div', {}, 'hello')
4. 通过new Function 和 with语法将codegen生成的代码绑定作用域
 */