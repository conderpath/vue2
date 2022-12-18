/*
 收集属性和watcher之间的映射关系
 每一个属性都分配一个dep用来存放watcher(可能存在多个)，watcher中还要存放这个dep
 */
let id = 0
class Dep{
  constructor() {
    this.id = id++
    this.subs = [] //  用来存放watcher
  }
  depand() {
    // Dep.target(就是watcher) dep里面需要存放watcher，watcher需要存放dep 多对多的关系
    if(Dep.target) {
      Dep.target.addDep(this)
    }
  }
  // dep中存放watcher
  addSub(watcher) {
    this.subs.push(watcher)
  }
}

Dep.target = null

export function pushTarget(watcher) {
  Dep.target = watcher
}

export function popTarget(watcher) {
  Dep.target = null
}

export default Dep