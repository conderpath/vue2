import {def, isObject} from "../utils";
import {arrayMethods} from "./array";
import Dep from './dep'
/**
 * 1. 如果数据是对象，会将对象不停的递归进行劫持
 * 2. 如果数据是数组，会劫持数组的方法，并对数组中不是基本数据类型的进行劫持
 *
 * */
class Observer{
  // 对对象中所有的属性进行劫持
  constructor(data) {
    // 所有劫持过的对象都有__ob__属性，并且不需要进行枚举(否则监听的时候死循环，栈溢出)
    Object.defineProperty(data,'__ob__', {
      value: this,
      enumerable: false, // 不可枚举
    })
    // 如果是数组时需要劫持一些改变数组的方法，push、pop、shift、unshift、splice、reverse、sort
    if(Array.isArray(data)) {
      data.__proto__ = arrayMethods
      // 如果数组里面的元素是对象，需要劫持对象的变化
      this.observeArray(data)
    }else { // 对对象进行劫持
      this.walk(data)
    }
  }
  observeArray(data) {
    data.forEach(item=>{
      observe(item)
    })
  }
  walk(data) {
    Object.keys(data).forEach(key=>{
      defineReactive(data, key, data[key])
    })
  }
}

function defineReactive(data, key,val) {
  // value可能是对象嵌套对象，也需要进行劫持
  observe(val)
  // 每个属性都有一个dep属性
  let dep = new Dep()
  Object.defineProperty(data,key,{
    get() {
      // 取值时需要将dep和watcher关联
      if(Dep.target) { // 说明取值是在模板中获取的，而非js中
        // 建立dep和watcher之间的依赖映射关系
        dep.depand()
      }
      return val
    },
    set(newVal) {
      if(newVal !== val) {
        // 用户赋的新值可能是对象也需要进行劫持
        observe(newVal)
        val = newVal
        //修改之后 当前属性存放的watcher执行进行视图更新
        dep.notify()
      }
    }
  })
}


export function observe(data) {
  // 如果数据是对象才观测
  if(!isObject(data)) {
    return
  }
  // 说明已经被劫持过了，无需重复劫持
  if(data.__ob__) {
    return
  }
  return new Observer(data)
}