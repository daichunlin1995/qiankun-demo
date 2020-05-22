<template>
  <div class="home">
    这是app2的home页面
    <el-select v-model="value" placeholder="请选择" :popper-append-to-body='false'>
      <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" ></el-option>
    </el-select>
  </div>
</template>
<script>
export default {
  data() {
    return {
      options: [
        {
          value: "选项1",
          label: "黄金糕"
        },
        {
          value: "选项2",
          label: "双皮奶"
        },
        {
          value: "选项3",
          label: "蚵仔煎"
        },
        {
          value: "选项4",
          label: "龙须面"
        },
        {
          value: "选项5",
          label: "北京烤鸭"
        }
      ],
      value: ""
    };
  },
  methods: {
    huoqu() {

    }
  },
  mounted() {
    console.log(window.name)
  },
};
</script>
<style>
.home {
  color: blue;
}
</style>