import {createElement, createTextElement} from "./vdom/index";

export function renderMixin(Vue) {
  // render中需要调用的一些自定义函数
  Vue.prototype._c = function(tag, data, ...children) {
    return createElement(this, ...arguments)
  }
  Vue.prototype._v = function(text){
    return createTextElement(this,text)
  }
  Vue.prototype._s = function(val){
    if(typeof val== 'object') return JSON.stringify(val)
    return val
  }
  Vue.prototype._render = function() {
    const vm = this
    // render可能是我们通过tempplate或者html解析出来的，也有可能是用户自己手动写的
    const render = vm.$options.render

    let vnode = render.call(vm)
    return vnode
  }
}