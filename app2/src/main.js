import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui'
Vue.config.productionTip = false
import 'element-ui/lib/theme-chalk/index.css';

console.log(window.name)
let instance = null;
Vue.use(ElementUI)
const vueOptions = {
  el: "#app2",
  router
};

if (!window.singleSpaNavigate) {
  // 检测是否是single-spa状态, 不是则独立运行
  delete vueOptions.el;
  new Vue({ ...vueOptions, render: h => h(App) }).$mount("#app2");
}

export async function bootstrap() {
  console.log("app2 app bootstraped");
}

export async function mount(props) {
  console.log(props)
  vueOptions.el = props.container ? props.container.querySelector("#app2") :"#app2"
  instance = new Vue({
    ...vueOptions,
    render: h => h(App)
  });
}

export async function unmount() {
  console.log("app2 app unmount");
  instance.$destroy();
  instance = null;
}