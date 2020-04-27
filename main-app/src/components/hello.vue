<template>
  <div>
    <div class="box">这是hello页面</div>
  </div>
</template>

<script>
export default {
  name: "Hello",
  props:['abc']
};
</script>

<style scoped>
.box{
  color: red;
  background: #ccc;
}
</style>