<template>
  <div>
    시도 단위 페이지 {{path}}

    {{sidoCode}}
  </div>
</template>

<script>
export default {
  name: "ChartSub",
  props: ['sidoCode'],
  data() {
    return {
      path: this.$route.params.sido
    }
  },
  async created() {
    console.log(this.sidoCode)
  },
  // beforeDestroy(){
  //   console.log("close")
  // }
}
</script>

<style>

</style>