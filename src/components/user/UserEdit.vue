<template>
  <v-container class="mt-4">
    <v-card elevation="2" outlined shaped>
      <v-card-title>회원 정보</v-card-title>

      <v-card-subtitle class="pb-0"><hr /></v-card-subtitle>
      <br />

      <v-card-text class="text--primary">
        <v-form ref="form">
          <v-text-field
            label="아이디"
            outlined
            readonly
            disabled
            :value="userid"
          ></v-text-field>
          <v-text-field
            label="이메일"
            outlined
            v-model.trim="uemail"
            :rules="emailRules"
          ></v-text-field>
          <v-text-field
            label="핸드폰"
            outlined
            v-model.trim="umobile"
            :rules="rules"
          ></v-text-field>
          <v-text-field
            label="이름"
            outlined
            v-model.trim="uusername"
            :rules="rules"
          ></v-text-field>
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
        <router-link to="edit" style="text-decoration: none">
          <v-btn depressed large color="blue" text @click="updateUser"
            ><v-icon left>mdi-pencil</v-icon>저장
          </v-btn>
        </router-link>
        <router-link to="info" style="text-decoration: none">
          <v-btn color="red" text>취소</v-btn>
        </router-link>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script>
import { UserService } from "@/service/user.service";
import { mapState } from "vuex";

export default {
  name: "UserEdit",
  props: ["email", "username", "mobile"],
  data() {
    return {
      uemail: this.email,
      uusername: this.username,
      umobile: this.mobile,
      password: "",
      rules: [
        (value) => !!value || "Required.",
        (value) => (value || "").length >= 4 || "Min 4 characters",
        (value) => (value || "").length <= 50 || "Max 50 characters",
      ],
      emailRules: [
        (value) => !!value || "Required.",
        (value) => (value || "").length <= 50 || "Max 50 characters",
        (value) => {
          const pattern =
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          return pattern.test(value) || "Invalid e-mail.";
        },
      ],
    };
  },
  methods: {
    async updateUser() {
      if (!this.$refs.form.validate()) {
        return;
      }

      const data = await UserService.updateUser({
        username: this.uusername,
        email: this.uemail,
        mobile: this.umobile,
        password: this.password,
      });

      if (data?.status == "success") {
        alert("업데이트 성공");
        this.$router.push("/user/info");
      } else {
        alert("업데이트 실패");
      }
    },
  },
  computed: {
    ...mapState("authStore", ["userid"]),
  },
  created() {
    if (
      this.email == undefined ||
      this.username == undefined ||
      this.mobile == undefined
    ) {
      this.$router.push("/user/info");
    }
  },
};
</script>

<style></style>
