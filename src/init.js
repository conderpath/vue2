import {initState} from "./state";

export function initMixin(Vue) {
  Vue.prototype._init = function (options) {
    const vm = this
    this.$options = options
    // 对数据，data, props，computed...进行初始化
    initState(vm)
  }
}