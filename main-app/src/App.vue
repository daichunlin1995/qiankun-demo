<template>
  <div id="container">
    <ul>
      <li @click="btn(1)">child1数据</li>
      <li @click="btn(2)">child2数据</li>
    </ul>
  <h3>路由</h3>
    <ul>
      <li v-for="(item,index) in abc" :key="index">
        {{item}}
      </li>
    </ul>
    <router-view></router-view>
    <!-- <router-link to="/app1">app1</router-link> -->
    <router-link to="/app2">app2</router-link> |
    <!-- <router-link to="/app3">app3</router-link>
    <router-link to="/app4">app4</router-link>
    <router-link to="/app5">app5</router-link>
    <router-link to='/home'>自己的home</router-link>
    <router-link to='/about'>自己的about</router-link> -->
    <router-link to='/about'>自己的about</router-link>
    <button @click="toHello"> hello </button>
    <!-- <button @click="toPath">hahaha</button> -->
    <!-- <el-button>默认按钮</el-button>  -->
    <!-- <div id="root-view" class="router-view" v-html="content"></div> -->
     <!-- <div class="router-view" v-html="child1"></div>
    <div class="router-view" v-html="child2"></div> -->

    <!-- <div class="router-view"  v-for='(item,index) in childArr' :key="index" v-html="item.content"></div> -->
   <!-- <div class="router-view" v-html="content"></div> -->
    <!-- <div id="app-child"></div> -->
   
  </div>
</template>
<script>
import { mapState } from 'vuex'
import { setGlobalState } from "@/main";
export default {
  name: 'App',
  props:{
    content:{
      type:String
    },
    loading:{
      type:Boolean
    },
    child1:{
      type:String
    },
    child2:{
      type:String
    },
    childArr:{
      type:Array
    }
  },
  data() {
    return {
      isShow: true
    }
  },
  created() {
    console.log(this.child1)
    console.log(this.child2)
  },
  computed: {
    ...mapState({
      abc:'message'
    })
  },
  methods:{
    btn(index){
      if(index == 1){
        console.log(this.child1)
      }else{
        console.log(this.child2)
      }
    },
    toPath(){
      this.$router.push('/about')
    },
    toHello(){
      this.$router.push('/hello')
      this.isShow = false

    },
    add() {
      setGlobalState({
          ignore: 'la-ba-la',
          user: {
              name: 'master',
          },
      });
      // this.$store.dispatch('addNum',2)
    }
  },
  watch:{
    content(nv){
      this.$store.dispatch('changeContent',nv)
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
/* p{
  color: red;
} */
#app1{
  height: 300px;
}
</style>
