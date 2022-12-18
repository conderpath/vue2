import {initMixin} from "./init";
import {lifecycleMixin} from "./liftcycle";
import {renderMixin} from "./render";

function Vue(options) {
  this._init(options)
}
// vue原型的扩展


initMixin(Vue) // _init

lifecycleMixin(Vue) // _update
renderMixin(Vue) // _render

export default Vue