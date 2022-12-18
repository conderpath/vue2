// 解析html字符串 <div id="app"> {{name}}  </div>
import {parserHTML} from "./parser";
import {generate} from "./generate";

export function compileToFunction(template) {
  // html => ast语法树
  let root = parserHTML(template)
  let code = generate(root)
  // ast(只能描述语法，语法不存在的属性无法描述)=> render函数 => 虚拟dom（针对ast语法树，增加额外的属性）=> 生成真实dom
  console.log(root)

  console.log(code)
}