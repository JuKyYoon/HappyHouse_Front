<template>
  <div>
    <v-container class="back" fill-height fluid>
      <v-row justify="center">
        <v-col cols="5">
          <v-card class="card-login mx-a">
            <v-card-title>비밀번호 찾기</v-card-title>
            <v-divider></v-divider>
            <v-card-text class="pa-5">
              <v-form v-on:submit.prevent="findPassword">
                <v-text-field
                  color="green darken-1"
                  v-model.trim="userid"
                  label="ID"
                ></v-text-field>
                <v-text-field
                  color="green darken-1"
                  v-model.trim="username"
                  label="이름"
                ></v-text-field>
                <v-text-field
                  color="green darken-1"
                  v-model.trim="email"
                  label="이메일"
                ></v-text-field>
                <v-text-field
                  v-if="newPassword.length > 0"
                  readonly
                  :value="newPassword"
                  label="새 비밀번호"
                ></v-text-field>
                <v-btn class="green darken-1" type="submit" large dark
                  >찾기</v-btn
                >
              </v-form>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { UserService } from "@/service/user.service";

export default {
  name: "UserFindPw",
  data() {
    return {
      userid: "",
      username: "",
      email: "",
      newPassword: ""
    };
  },
  computed: {},
  methods: {
    async findPassword() {
      const data = await UserService.findPassword({
        userid: this.userid,
        username: this.username,
        email: this.email,
      });
      if(data?.status == "success") {
        alert("새로운 비밀번호")
        this.newPassword = data.result;
      } else {
        alert("올바른 정보가 아닙니다")
      }
    },
  },
};
</script>

<style scoped>
.back {
  background-image: url("https://i.ytimg.com/vi/QN7l3ydXvx0/maxresdefault.jpg");
  background-size: cover;
  background-repeat: no-repeat;
}

@keyframes opacity-in {
  from {
    opacity: 0.4;
  }
  to {
    opacity: 1;
  }
}

@keyframes opacity-out {
  from {
    opacity: 1;
  }
  to {
    opacity: 0.4;
  }
}

/* .card-login {
  opacity: 0.4;
  animation-name: opacity-out;
  animation-duration: 2s;
}

.card-login:hover {
  opacity: 1;
  animation-name: opacity-in;
  animation-duration: 2s;
}

.alert-in {
  animation-name: opacity-in;
  animation-duration: 2s;
} */
</style>
