// 视图更新调度
import {nextTick} from "../utils/next-tick";

let queue = []
let has = {}
let waiting = false
let flushing = false
export function queueWatcher(watcher) {
  const id = watcher.id
  // 避免栈中放入重复的watcher
  if(!has[id]) {
    has[id] = true
    queue.push(watcher)
    // 开启一次更新操作，批处理(防抖)
    if(!flushing) {
      // setTimeout(flushSchedulerQueue,0)
      nextTick(flushSchedulerQueue)
      flushing = true
    }
  }
}

function flushSchedulerQueue() {
  for (let i=0;i<queue.length;i++) {
    queue[i].run()
  }
  queue = []
  has = {}
  flushing = false
}