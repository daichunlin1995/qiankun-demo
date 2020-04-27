import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import {
  registerMicroApps,
  runAfterFirstMounted,
  setDefaultMountApp,
  start
} from 'qiankun'

const startOptions = {
  prefetch: false,
  fetch: request,
  singular: false
}

let app = null
let childArr = []
function render({ appContent, loading }) {
  console.log('赋值')
  if(startOptions.singular || !appContent){
    childArr = []
  }
  if(appContent){
    console.log('%c'+this.name,'color:red;')
    let isChild = childArr.some(item=>{
      return item.name == this.name
    })
    console.log(isChild)
    if(!isChild){
      childArr.push({
        name:this.name,
        content:appContent
      })
    }
  }
  if (!app) {
    console.log('初始化主应用render')
    app = new Vue({
      el: '#app',
      router,
      store,
      data() {
        return {
          content: appContent,
          loading,
          child1:'',
          child2:'',
          childArr:childArr
        }
      },
      render(h) {
        return h(App, {
          props: {
            content: this.content,
            loading: this.loading,
            child1:this.child1,
            child2:this.child2,
            childArr:this.childArr
          }
        })
      }
    })
  } else {
    app.content = appContent
    app.loading = loading
    app.childArr = childArr
  }
}

function genActiveRule(routerPrefix) {
  return location => location.pathname.startsWith(routerPrefix)
}

const request = url =>
  fetch(url, {
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  })

// 初始化主应用
render({ loading: true })
// 注册子应用
registerMicroApps(
  [
    {
      name: 'app1',
      entry: '//localhost:3001',
      render: render.bind({ name: 'app1' }),
      // render:({appContent}={})=>{
      //   app.child1 = appContent
      // },
      activeRule: genActiveRule('/app1'),
      props: {
        name: '这是app1的数据'
      }
    },
    {
      name: 'app2',
      entry: '//localhost:3002',
      render: render.bind({ name: 'app2' }),
      // render:({appContent}={})=>{
      //   app.child2 = appContent
      // },
      activeRule: genActiveRule('/app2'),
      props: {
        name: '这是app2的数据'
      }
    },
    {
      name: 'app3',
      entry: '//localhost:3003',
      render: render.bind({ name: 'app3' }),
      // render:({appContent}={})=>{
      //   app.child2 = appContent
      // },
      activeRule: genActiveRule('/app3'),
      props: {
        name: '这是app3的数据'
      }
    }
  ],
  // {
  //   beforeLoad: [
  //     app => {
  //       console.log('before load', app)
  //     }
  //   ],
  //   beforeMount: [
  //     app => {
  //       console.log('before mount', app)
  //     }
  //   ],
  //   afterUnmount: [
  //     app => {
  //       console.log('afterUnmount', app)
  //     }
  //   ]
  // }
)
/**
   * @description 设置哪个子应用程序在主加载后默认处于活动状态
   * @param defaultAppLink: string 跳转链接
   */
setDefaultMountApp('/app1')

/**
   * @description 第一个应用构建完成后执行
   * @param 要执行的函数
   */
runAfterFirstMounted(() => console.info('first app mounted'))

/**
   * @description 启动主应用
   * @param prefetch 是否在第一次安装子应用程序后预取子应用程序的资产,默认为 true
   * @param jsSandbox 是否启用沙盒，当沙盒启用时，我们可以保证子应用程序是相互隔离的,默认为 true
   * @param singular 是否在一个运行时只显示一个子应用程序，这意味着子应用程序将等待挂载，直到卸载之前,默认为 true
   * @param fetch 设置一个fetch function,默认为 window.fetch
   */
start(startOptions)
