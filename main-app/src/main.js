import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import VueRouter from 'vue-router'
import store from "./store";
// import hello from './components/hello'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
Vue.config.productionTip = false;
Vue.use(ElementUI)

window.name = '这是一个微应用'

if(document.head.createShadowRoot || document.head.attachShadow) {
    // I can shadow DOM
    console.log('i can')
} else {
    // I can't
    console.log('i can not')
}





// 导入乾坤函数
import {
    registerMicroApps,
    runAfterFirstMounted,
    // setDefaultMountApp,
    initGlobalState,
    start
} from "qiankun";

// 定义传入子应用的数据
let msg = {
    // com:hello,
    fns:[
        function changeMessage(data){
            store.dispatch('changeMessage',data)
        }
    ],
    depend:[Vue,VueRouter]
};

const startOptions = { prefetch:false,singular:true,sandbox:{strictStyleIsolation:true}}
// 主应用渲染函数
let app = null;
let childArr = []
function render({ appContent, loading } = {}) {
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
        app = new Vue({
            el: "#container",
            router,
            store,
            data() {
                return {
                    content: appContent,
                    loading,
                    childArr,
                };
            },
            render(h) {
                return h(App, {
                    props: {
                        content: this.content,
                        loading: this.loading,
                        childArr:this.childArr
                    }
                });
            }
        });
    } else {
        app.content = appContent;
        app.loading = loading;
        app.childArr = childArr
    }
}
render();

function genActiveRule(routerPrefix) {
    return location => location.pathname.startsWith(routerPrefix);
}

//注册子应用
registerMicroApps(
    [

        {
            name: "module-app2",
            entry: "//localhost:3002",
            // render:render.bind({name:'app2'}),
            container:'#app-child',
            activeRule: genActiveRule("/app2"),
            props: msg
        }
    ],
    {
        beforeLoad: [
            app => {
                console.log("before load", app);
            }
        ],
        beforeMount: [
            app => {
                console.log("before mount", app);
            }
        ],
        afterUnmount: [
            app => {
                console.log("after unload", app);
            }
        ]
    }
);

const { onGlobalStateChange, setGlobalState } = initGlobalState({
    user: 'qiankun',
  });
  
onGlobalStateChange((value, prev) => console.log('[onGlobalStateChange - master]:', value, prev));

export { setGlobalState }
// setGlobalState({
//     ignore: 'master',
//     user: {
//         name: 'master',
//     },
// });

// 设置默认子应用
// setDefaultMountApp("/app1")
// 第一个子应用加载完毕回调
runAfterFirstMounted(() => {
    // console.log(app)
});
// 启动微服务
start(startOptions);

/* new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app"); */

const childRoute = ['/app2'];
const isChildRoute = path => childRoute.some(item => path.startsWith(item))
const rawAppendChild = HTMLHeadElement.prototype.appendChild;
const rawAddEventListener = window.addEventListener;
router.beforeEach((to, from, next) => {
  // 从子项目跳转到主项目
  if(isChildRoute(from.path) && !isChildRoute(to.path)){
    HTMLHeadElement.prototype.appendChild = rawAppendChild;
    window.addEventListener = rawAddEventListener;
  }
  next();
});

  