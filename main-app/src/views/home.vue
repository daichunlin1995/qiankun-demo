<template>
  <div class="home">
    <div id="app-child"></div>
    <!-- <div v-html="content"></div> -->
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import { setGlobalState } from "@/main";
export default {
  data() {
    return {};
  },
  computed: {
    ...mapState({
      num1: "num",
      content:'content'
    }),
    ...mapGetters(["changeNum"]),
    a() {
      return "123";
    },
    b() {
      this.c(this.a);
      return "bbb";
    }
  },
  created() {
    // console.log(this.$store.state.num)
    console.log(this.changeNum);
  },
  methods: {
    add() {
      setGlobalState({
          ignore: 'la-ba-la',
          user: {
              name: 'master',
          },
      });
      // this.$store.dispatch('addNum',2)
    },
    toAbout() {
      this.$router.push("/about");
    },
    c(data) {
      console.log(data);
    }
  },
  destroyed() {
    console.log('执行了destroyed')
  },
};
</script>

<style scoped>
p {
  color: blue;
}
</style>