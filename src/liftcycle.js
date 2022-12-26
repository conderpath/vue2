import {patch} from "./vdom/patch";
import Watcher from "./observe/watcher";
import {nextTick} from "./utils/next-tick";

export function lifecycleMixin(Vue) {
  Vue.prototype._update = function(vnode) {
    const vm = this
    // 既有初始化 又有更新，通过vnode生成新节点，更新或者替换旧的节点
    vm.$el =  patch(vm.$el, vnode)
  }
  Vue.prototype.$nextTick = nextTick
}


// 每个组件渲染时都会创建一个watcher
export function mountComponent(vm, el) {
  // 更新函数，数据变化后会再次调用该函数
  let updateComponent = (vm,el)=>{
    // 调用render函数，生成虚拟dom
    vm._update(vm._render())
    // 用虚拟dom生成真实dom
  }
  // 观察者模式：属性是”被观察者“， 刷新页面是观察者，
  // updateComponent(vm,el)

  new Watcher(vm, updateComponent,()=>{
    console.log('观察到变化了')
  }, true) // 标识是一个渲染watcher
}