// 数组原型上所有的方法
const oldArrayPrototype = Array.prototype
export const arrayMethods = Object.create(oldArrayPrototype)
// 需要重写的方法(可以改变原数组的)
const methods = [
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
]

methods.forEach(method=>{
  // 用户调用这些方法时，调用这里重写的，否则调用原来原型链上的方法
  arrayMethods[method] = function(...args) {
    console.log('数组发生变化了', method)
    oldArrayPrototype[method].apply(this,args)
    let inserted;
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args // 就是新增的内容
        break
      case 'splice':
        inserted = args.slice(2) // arr.splice(0 ,1, item1,item2)
    }
    // 对添加的元素需要继续劫持
    if(inserted) {
      this.observeArray(inserted)
    }
  }
})