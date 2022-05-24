<template>
  <v-container class="mt-4">
    <v-card elevation="2" outlined shaped>
      <v-card-title>회원 정보</v-card-title>

      <v-card-subtitle class="pb-0"><hr /></v-card-subtitle>
      <br />

      <v-card-text class="text--primary">
        <v-text-field
          label="아이디"
          outlined
          readonly
          :value="snsTypeUserId"
        ></v-text-field>
        <v-text-field
          label="이메일"
          outlined
          readonly
          :value="userInfo.email"
        ></v-text-field>
        <v-text-field
          label="핸드폰"
          outlined
          readonly
          :value="userInfo.mobile"
        ></v-text-field>
        <v-text-field
          label="이름"
          outlined
          readonly
          :value="userInfo.username"
        ></v-text-field>
        <v-text-field
          label="가입일"
          outlined
          readonly
          :value="dateFormat"
        ></v-text-field>
        <v-text-field
          v-if="snsStatus"
          label="SNS회원"
          outlined
          readonly
          :value="snsTypeFormat"
        ></v-text-field>
      </v-card-text>

      <v-card-actions>
        <router-link
          :to="{
            name: 'UserEdit',
            params: {
              username: userInfo.username,
              mobile: userInfo.mobile,
              email: userInfo.email,
            },
          }"
          style="text-decoration: none"
        >
          <v-btn depressed large color="blue" text
            ><v-icon left>mdi-pencil</v-icon>정보수정
          </v-btn>
        </router-link>
        <v-btn
          @click="showPwChange = true"
          v-if="!showPwChange && !snsStatus"
          depressed
          large
          color="blue"
          text
          >비밀번호 변경</v-btn
        >
        <router-link to="delete" style="text-decoration: none">
          <v-btn color="red" text>회원탈퇴 </v-btn>
        </router-link>
      </v-card-actions>

      <v-expand-transition appear v-if="showPwChange && !snsStatus">
        <v-card-text class="text--primary">
          <v-form ref="form">
            <v-text-field
              type="password"
              outlined
              v-model.trim="oldPassword"
              color="blue darken-1"
              label="현재 비밀번호"
              :rules="rules"
            ></v-text-field>
            <v-text-field
              type="password"
              outlined
              v-model.trim="newPassword"
              color="blue darken-1"
              label="새 비밀번호"
              :rules="rules"
            ></v-text-field>
            <v-text-field
              type="password"
              outlined
              v-model.trim="newPasswordCheck"
              color="blue darken-1"
              label="비밀번호 확인"
              :rules="newPwRules"
            ></v-text-field>

            <v-btn depressed large color="blue" @click="changePassword" text
              >확인
            </v-btn>
            <v-btn
              depressed
              large
              color="red"
              text
              @click="showPwChange = false"
              >취소
            </v-btn>
          </v-form>
        </v-card-text>
      </v-expand-transition>
    </v-card>
  </v-container>
</template>

<script>
import dayjs from "dayjs";
import { UserService } from "@/service/user.service.js";
export default {
  name: "UserInfo",
  data() {
    return {
      userInfo: {},
      showPwChange: false,
      snsStatus: false,
      oldPassword: "",
      newPassword: "",
      newPasswordCheck: "",
      rules: [
        (value) => !!value || "Required.",
        (value) => (value || "").length >= 4 || "Min 4 characters",
        (value) => (value || "").length <= 50 || "Max 50 characters",
      ],
      newPwRules: [
        (value) => !!value || "Required.",
        (value) => (value || "").length >= 4 || "Min 4 characters",
        (value) => (value || "").length <= 50 || "Max 50 characters",
        (value) => value == this.newPassword || "Password Not Match",
      ],
    };
  },
  methods: {
    async getMyInfo() {
      try {
        const data = await UserService.getMyInfo();
        console.log(data);
        if (data?.status == "success") {
          this.userInfo = data.result;
          if (this.userInfo.sns_type) {
            this.snsStatus = true;
          }
        } else {
          if (data.response.status == 403) {
            alert("금지된 요청");
          } else {
            alert("불러오기 실패");
          }
        }
      } catch (err) {
        alert("fail");
      }
    },
    async changePassword() {
      if (!this.$refs.form.validate()) {
        return;
      }

      const data = await UserService.changePassword({
        oldPassword: this.oldPassword,
        newPassword: this.newPassword,
      });

      if (data?.status == "success") {
        alert("변경 성공");
        this.showPwChange = false;
      } else {
        alert("변경 실패");
      }
    },
  },
  async created() {
    await this.getMyInfo();
  },
  computed: {
    dateFormat() {
      if (this.userInfo.create_date == undefined) {
        return "";
      }
      return dayjs(this.userInfo.create_date).format("YYYY년 MM월 DD일");
    },
    snsTypeFormat() {
      if (this.snsStatus) {
        return this.userInfo.sns_type;
      } else {
        return "";
      }
    },
    snsTypeUserId() {
      if (this.snsStatus) {
        return this.userInfo.sns_type;
      } else {
        return this.userInfo.userid;
      }
    },
  },
  watch: {
    showPwChange() {
      this.oldPassword = "";
      this.newPassword = "";
      this.newPasswordCheck = "";
    },
  },
};
</script>

<style>
.user-edit-button {
  margin: 10px;
}
</style>
