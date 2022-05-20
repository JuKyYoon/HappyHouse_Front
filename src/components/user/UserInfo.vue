<template>
  <div>adf</div>
</template>

<script>
import { UserService } from "@/service/user.service.js";
export default {
  name: "UserInfo",
  data() {
    return {};
  },
  methods: {
    async getMyInfo() {
      try {
        const data = await UserService.getMyInfo();
        if (data?.status == "success") {
          console.log(data);
        } else {
          if(data.response.status == 403) {
            alert("금지된 요청")
          } else {
            alert("불러오기 실패")
          }
        }
      } catch (err) {
        alert("fail");
      }
    },
  },
  async created() {
    await this.getMyInfo()
    // console.log("test")
  },
};
</script>

<style></style>
