import  babel from 'rollup-plugin-babel'
export default  {
  input: './src/index.js',
  output: {
    format: 'umd', // 支持amd和commoonjs规范   window.Vue
    name: 'Vue',
    file: './dist/vue.js', // 打包的目录
    sourcemap: true, //es5->es6源码  使es5代码关联到es6源码
  },
  plugins: [
    babel({
      exclude: 'node-modules/**'
    })
  ]
}