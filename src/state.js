// 数据状态的初始化
import {isFunction} from "./utils";
import {observe} from "./observe/index";

export function initState(vm) {
  const opts = vm.$options
  if(opts.data) {
    initData(vm)
  }
  /*if(opts.props) {
    initProps(vm)
  }
  if(opts.computed) {
    initComputed(vm)
  }
  if(opts.watch) {
    initWatch(vm)
  }*/
}
function proxy(vm,source,key) {
  Object.defineProperty(vm,key,{
    get() {
      return vm[source][key]
    },
    set(newVal) {
      vm[source][key] = newVal
    }
  })
}
function initData(vm) {
  let data = vm.$options.data
  data = vm._data = isFunction(data) ? data.call(vm) : data

  // 代理方便用户取值时 vm.name 等价于vm._data.name
  for (let key in data) {
    proxy(vm, '_data', key)
  }
  // 数据劫持
  observe(data)
}