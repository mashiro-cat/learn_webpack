module.exports = {
  // 解析配置项
  parserOptions: {
    ecmaVersion: 6, // ES 语法版本
    sourceType: "module", // ES 模块化
  },
  env: {
    node: true, // 启用node中全局变量
    browser: true, // 启用浏览器中全局变量 不开启则像 console Math 等全局变量无法使用
  },
  // 继承规则
  extends: ['eslint:recommended'],
  // 检测规则
  // 自定义的规则会覆盖继承的规则
  // "off" 或 0 - 关闭规则
  // "warn" 或 1 - 开启规则，使用警告级别的错误：warn (不会导致程序退出)
  // "error" 或 2 - 开启规则，使用错误级别的错误：error (当被触发的时候，程序会退出)
  rules: {
    semi: "off", // 禁止使用分号
    'array-callback-return': 'warn', // 强制数组方法的回调函数中有 return 语句，否则警告
    'default-case': [
      'warn', // 要求 switch 语句中有 default 分支，否则警告
      { commentPattern: '^no default$' } // 允许在最后注释 no default, 就不会有警告了
    ],
    eqeqeq: [
      'warn', // 强制使用 === 和 !==，否则警告
      'smart' // https://eslint.bootcss.com/docs/rules/eqeqeq#smart 除了少数情况下不会有警告
    ],
  },
}