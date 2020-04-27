<template>
    <div class="about">
       <p @click="change">这是about页面</p> 
       {{$store.state.num}}
       <p @click="returnHome">返回</p>
    </div>
</template>
<script>
export default {
    data(){
        return {

        }
    },
    methods:{
        returnHome(){
            this.$router.go(-1)
        },
        change(){
            this.$store.dispatch('addNum',2)
        }
    }
}
</script>
<style scoped>
    p{
        color: red;
    }
</style>
