
let callbacks = []
let pending = false
let timerFunc
if(Primise) {
  timerFunc = ()=>{
    Promise.resolve().then(flushCallbacks)
  }
}else if(MutationObserver) { // 微任务，监听文本节点内容变化
  let text = '1'
  const observe = new MutationObserver(flushCallbacks)
  const textNode =document.createTextNode(text)
  observe.observe(textNode,{
    characterData: true
  })
  timerFunc = ()=>{
    textNode.textContent = '3'

  }
}else if(setImmediate) {
  timerFunc = ()=>{
    setImmediate(flushCallbacks)
  }
}else {
  timerFunc = ()=>{
    setTimeout(flushCallbacks)
  }
}
export function nextTick(cb) {
  callbacks.push(cb)
  if(!pending) {
    // vue2考虑了兼容问题，针对浏览器降级处理，是否支持promise，MutationObserver,setImmediate, setTimeout
    timerFunc(flushCallbacks)
    pending = true
  }
}

function flushCallbacks() {
  callbacks.forEach(cb=> cb())
  pending = false
}
