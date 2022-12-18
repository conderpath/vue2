export function lifecycleMixin(Vue) {
  Vue.prototype._update = function(vnode) {
    console.log('_update', vnode)
  }
}



export function mountComponent(vm, el) {
  console.log(vm,el)
  // 更新函数，数据变化后会再次调用该函数
  let updateComponent = (vm,el)=>{
    // 调用render函数，生成虚拟dom
    vm._update(vm._render())
    // 用虚拟dom生成真实dom
  }
  updateComponent(vm,el)
}