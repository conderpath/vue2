import {initMixin} from "./init";

function Vue(options) {
  this._init(options)
}
// vue原型的扩展
initMixin(Vue)
export default Vue