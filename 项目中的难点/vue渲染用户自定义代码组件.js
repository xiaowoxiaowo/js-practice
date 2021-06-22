// 背景：有一个报表生成的系统，可以通过报表库选择生成一个报表页面，有很多报表模块，列表，饼图，雷达图，折线图，图片等等。
// 但是后续存在很多个人用户自定义的需求，一开始需要开发介入然后项目代码发布上线才能创建新的模块。想通过传入template + js + css的方式自由定制

// 解决思路：通过后台项目使用vue时的运行时编译，需要在 vue.config.js 中打开 runtimeCompiler 开关来开启运行时编译。
// 在模块列表或者预览组件里都需要预先定义一个容器组件（类似异步组件），传入三个参数template,js,css。
// 因为vue的代码在经过vue编译之后，其实就是一个js对象。我们传入的js其实也就是一个vue的js对象，所以我们可以直接把template赋值给js.template中
// 容器组件通过jsx的写法，将这个处理后的js对象渲染出来,css通过新建一个style来新增。

// 1.css样式隔离
// 在渲染js对象的外层加一层div来限制class，加一个随机生成的class，再对传入的css所有样式添加这个随机生成的class前缀

// 2.js语法错误
try {
  // 通过new Function方法创建一个函数，`return ${code}`是函数体，code就是传入的js代码
  // 如果正确就返回js代码，不然就会被try抓取到错误
  result.value = new Function('context', `return ${code}`)(params) || value // eslint-disable-line no-new-func
} catch (e) {
  console.error('js脚本错误：', e)
  result.error = e
}

// 3.组件运行时错误
// 在容器组件上添加 `errorCaptured`这个官方钩子，这些错误都用一个变量来控制，当有错误的时候不会显示传入的组件，当新的template,js,css
// 传入时，需要把这个错误的标志位重置，类似刷新组件

// 4.变量
// 主要使用echarts，echarts定义在全局的window上，所以可以直接获取

// 5.防止xss注入
// 传入的js需要执行，没办法直接转义。只对一些方法进行了软限制和清除，比如传入的console.log,alert,document.write,获取值的cookies,localStorage,sessionStorage，
// 创建img，script标签，XMLHttpRequest，fetch。


{/* <script>
import forEach from 'lodash/forEach'
import has from 'lodash/has'
import { runFnInVm } from '@/utils/vm'
export default {
  name: 'codePreview',
  props: {
    // 传入三个参数template,js,css
    template: String,
    js: String,
    css: String,
  },
  data() {
    return {
      subCompErr: null,
    }
  },
  watch: {
    js() {
      // 当代码变化时，清空error，重绘
      this.subCompErr = null
    },
    template() {
      // 当代码变化时，清空error，重绘
      this.subCompErr = null
    },
    css() {
      // 当代码变化时，清空error，重绘
      this.subCompErr = null
    },
  },
  computed: {
    className() {
      // 生成唯一class，主要用于做scoped的样式
      const uid = Math.random().toString(36).slice(2)
      return `custom-code-${uid}`
    },
    scopedStyle() {
      if (this.css) {
        const scope = `.${this.className}`
        const regex = /(^|\})\s*([^{]+)/g
        // 为class加前缀，做类似scope的效果
        // 需要注意css可能会变成一行，所以需要匹配一行中的开始的css以及在{}括号之后的css
        return this.css.trim().replace(regex, (m, g1, g2) => {
          return g1 ? `${g1} ${scope} ${g2}` : `${scope} ${g2}`
        })
      }
      return ''
    },
    component() {
      const js = (this.js || '').trim()
      const result = runFnInVm(js, {})
      const component = result.value
      if (result.error) {
        result.error = {
          msg: result.error.toString(),
          type: 'js脚本错误',
        }
        result.value = { hasError: true }
        return result
      }
      // 如果需要注入一些变量，则对被注入的字段进行检测
      // 防止用户代码中定义了此字段，导致冲突
      const resultTmp = this.checkVariableField(component)
      if (resultTmp) {
        return resultTmp
      }
      const template = (this.template || '')
        .replace(/^ *< *template *>|<\/ *template *> *$/g, '')
        .trim()
      // 注入template或render，设定template优先级高于render
      if (template) {
        component.template = template
        component.render = undefined
      } else if (!component.render) {
        component.template = '<span>未提供模板或render函数</span>'
      }
      // 注入mixins
      component.mixins = [{
        // 注入 beforeUpdate 钩子，用于子组件重绘时，清理父组件捕获的异常
        beforeUpdate: () => {
          this.subCompErr = null
        },
      }]
      // 通过computed注入一些变量，比如store中的一些字段，
      // 当store中的变量发生变化时，也会引发组件重绘
      const computed = component.computed || {}
      computed.variable = function variable() {
        const map = {}
        forEach(this.$store.state.variable.map, (value, key) => {
          map[key] = value
        })
        return map
      }
      component.computed = computed
      return result
    },
  },
  
  methods: {
    checkVariableField(component) {
      // 如果需要注入一些变量，比如名字叫variable
      let data = component.data
      if (typeof data === 'function') {
        // 如果data是函数，执行后取data的结果
        // 用于行为无法预知，可能定义了错误的data，需要trycatch防崩
        // catch的异常不用关心
        try {
          data = data()
        } catch (e) {}
      }
      if (has(component, 'computed.variable')
          || has(data, 'variable')
      ) {
        return {
          error: {
            type: '功能限制',
            msg: '禁止自定义名称是variable的computed或data，会影响系统变量的使用',
          },
          value: { hasError: true },
        }
      }
    },
  },
  render() {
    const { error: compileErr, value: component } = this.component
    const error = compileErr || this.subCompErr
    let errorDom
    if (error) {
      errorDom = <div class='error-msg-wrapper'
        style={{ position: !component.hasError ? 'absolute' : '' }}
      >
        <div>{error.type}</div>
        <div>{error.msg}</div>
      </div>
    }
    return <div class='code-preview-wrapper'>
      <div class={this.className}>
        <style>{this.scopedStyle}</style>
        <component />
      </div>
      {errorDom}
    </div>
  },
  mounted() {
  },
  errorCaptured(err, vm, info) {
    this.subCompErr = {
      msg: err && err.toString && err.toString(),
      type: '自定义组件运行时错误：',
    }
    console.error('自定义组件运行时错误：', err, vm, info)
  },
}
</script>
<style lang='less' scoped>
.code-preview-wrapper {
  position: relative;
  .error-msg-wrapper {
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1;
    background: #fff;
    color: red;
  }
}
</style> */}




export function stringToCode(code, value, params) {
  const result = { value, error: null }
  try {
    result.value = new Function('context', `return ${code}`)(params) || value // eslint-disable-line no-new-func
  } catch (e) {
    console.error('js脚本错误：', e)
    result.error = e
  }
  return result
}

/**
 * 执行一段字符串格式的函数
 */
export function runFnInVm(code, params, globalParams) {
  const NOOP = args => args
  const result = stringToCode(code, NOOP, globalParams)
  const fn = result.value
  result.value = params
  if (result.error) {
    return result
  }
  if (typeof fn !== 'function') {
    console.error('非法的js脚本函数', fn)
    result.error = new Error('非法的js脚本函数')
    return result
  }
  try {
    result.value = fn.call(fn, params)
  } catch (e) {
    console.error('js脚本执行错误：', e)
    result.error = e
  }
  return result
}