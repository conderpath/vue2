import {popTarget, pushTarget} from "./dep";

let id = 0
class Watcher{
  // vm, updateComponent, ()=> console.log('变化了'), true
  constructor(vm,exprOrFn,cb,options) {
    this.vm = vm
    this.exprOrFn = exprOrFn
    this.cb = cb
    this.options = options
    this.id = id++
    this.deps = [] // 用来存放dep
    this.depsId = new Set() // 可能页面中多次使用了同一个属性，不需要多次存放相同watcher
    // 第一次默认执行exprOrFn(挂载节点，去vm上取值)
    this.getter = exprOrFn
    this.get()
  }
  // 用户更新时可以重复调用getter
  get() {
    //调用render时会从vm中取值，取值时属性和watcher进行关联，收集自己的watcher
    // 一个属性同时可能对应多个watcher，同一个watcher可以对应多个属性(多对多)
    pushTarget(this)  // Dep.target = watcher
    this.getter(this.vm, this.vm.$el) // 执行render方法时会在页面中取值
    // 页面取值之后需要进行释放，防止在模板外取值时进行了依赖收集
    popTarget(this) // Dep.target = null
  }
  // 建立dep和watcher之间的映射关系
  addDep(dep) {
    let id = dep.id
    // 存过了就不需要再存了，避免watcher对应相同的dep(页面可能同时多次获取同一属性)
    if(!this.depsId.has(id)) {
      // watcher中存放dep
      this.depsId.add(id)
      this.deps.push(dep)
      // dep中存放watcher
      dep.addSub(this)
    }
  }
}

export default Watcher