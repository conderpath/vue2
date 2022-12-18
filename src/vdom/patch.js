// 这里oldVnode可能是dom节点，也有可能是虚拟节点
export function patch(oldVnode, vnode) {
  if(oldVnode.nodeType == 1) { // dom节点
    console.log('真实元素')
    // 真实元素父节点
    let parent = oldVnode.parentNode
    // let ele = createElement(vnode)
    // 根据vnode创建新的节点，并将新节点插入到节点的下方
    let ele = createElm(vnode)
    parent.insertBefore(ele, oldVnode.nextSibling)
    // 删除原来的旧节点
    parent.removeChild(oldVnode)
  }
}

// 虚拟节点转化成真实节点
function createElm(vnode) {
  const { tag, data, children, text, vm} = vnode
  if(typeof tag === 'string') { // 元素节点
    // 虚拟节点上有一个el属性对应真实节点
    vnode.el = document.createElement(tag);
    // 创建子节点
    (children||[]).forEach(child=> {
      vnode.el.appendChild(createElm(child))
    })
  }else { // 文本节点
    vnode.el = document.createTextNode(text)
  }
  return vnode.el
}