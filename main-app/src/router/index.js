import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/views/home'
Vue.use(VueRouter)

const routes = [
    {
        path:'/',
        name:'Home',
        component:Home,
        children:[
            {
                path:'app2'
            }
        ]
    },
    {
        path:'/about',
        name:'About',
        component:()=>import('@/views/about')
    },
    {
        path:'/hello',
        name:'Hello',
        component:()=>import('@/views/hello')
    }
]
export default new VueRouter({
    base: process.env.BASE_URL,
    mode:'history',
    routes
})