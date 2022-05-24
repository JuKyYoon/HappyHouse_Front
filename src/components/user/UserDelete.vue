<template>
  <v-container class="mt-4">
    <v-card elevation="2" outlined shaped>
      <v-card-title>회원 탈퇴</v-card-title>
      <v-card-subtitle class="pb-0"><hr /></v-card-subtitle>
      <br />

      <v-card-text class="text--primary">
        <v-form ref="form">
          <v-text-field
            label="비밀번호"
            outlined
            type="password"
            v-model.trim="password"
            :rules="rules"
          ></v-text-field>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-btn depressed large color="blue" text @click="removeUser"
          ><v-icon left>mdi-pencil</v-icon>저장
        </v-btn>
        <router-link to="/user/info" style="text-decoration: none">
          <v-btn color="red" text>취소</v-btn>
        </router-link>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script>
import { UserService } from "@/service/user.service";
import { mapMutations } from "vuex";
export default {
  name: "UserDelete",
  data() {
    return {
      password: "",
      rules: [
        (value) => !!value || "Required.",
        (value) => (value || "").length >= 4 || "Min 4 characters",
        (value) => (value || "").length <= 50 || "Max 50 characters",
      ],
    };
  },
  methods: {
    ...mapMutations("authStore", ["deleteAuth"]),
    async removeUser() {
      if (!this.$refs.form.validate()) {
        return;
      }
      const data = await UserService.deleteUser(this.password);

      if (data?.status == "success") {
        alert("삭제 성공");
        this.deleteAuth();
        this.$router.push("/");
      } else {
        alert("삭제 실패");
      }
    },
  },
};
</script>

<style></style>
