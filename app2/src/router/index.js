import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
    {
        path:'/',
        name:'Home',
        component:() => import('../views/home')
    },
    {
        path:'/about',
        name:'About',
        component:() => import('../views/about')
    },
]
export default new VueRouter({
    mode:'history',
    base:'/app2',
    routes
})