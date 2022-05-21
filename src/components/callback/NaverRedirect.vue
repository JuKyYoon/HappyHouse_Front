<template>
  <div>이 페이지는 네이버 콜백 페이지입니다. 보여주지 마세요</div>
</template>

<script>
import { mapActions } from "vuex";
export default {
  name: "NaverRedirect",
  methods: {
    ...mapActions("authStore", ['naverLogin']),
  },
  async mounted() {

    let code = this.$route.query?.code;
    let state= this.$route.query?.state;

    if(code != null & state != null) {
      await this.naverLogin({code:code, state:state});
    } else {
      console.log("에러요")
    }

  },
};
</script>

<style></style>
