import {initState} from "./state";
import {compileToFunction} from "./compiler/index";
import {mountComponent} from "./liftcycle";

export function initMixin(Vue) {
  Vue.prototype._init = function (options) {
    const vm = this
    this.$options = options
    // 对数据，data, props，computed...进行初始化
    initState(vm)


    if(vm.$options.el) {
      // 将数据挂载到模板上
      vm.$mount(vm.$options.el)
    }
  }

  Vue.prototype.$mount = function(el) {
    const vm = this
    const options = vm.$options
    el = document.querySelector(el)
    vm.$el = el
    // 模板转化成对应的渲染函数  => 虚拟dom的概念vnode => diff算法更新虚拟dom => 产生真实节点后更新
    if(!options.render) {
      let template = options.template
      // 没有template就取el的内容作为模板
      if(!template && el) {
        template = el.outerHTML
      }
      // 将模板变成render渲染函数( with + new Function语法)
      let render = compileToFunction(template)
      // options.render就是渲染函数
      options.render = render
    }

    // 调用render方法，渲染成真实dom，替换掉页面的内容
    // 组件的挂载
    mountComponent(vm, el)
  }
}