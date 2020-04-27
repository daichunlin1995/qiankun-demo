<template>
  <div id="app2">
    <img alt="Vue logo" src="./assets/logo.png">
    <div class="nav">
      <router-link to="/">app2-home</router-link>
      <router-link to="/about">app2-about</router-link>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
#app2 {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
.nav{
  /* margin: 10px 0; */
}
a {
  font-weight: bold;
  color: #2c3e50;
  margin: 0 10px;
}

a.router-link-exact-active {
  color: #40a9ff;
}
</style>
