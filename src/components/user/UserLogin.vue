<template>
  <div>
    <v-container class="back" fill-height fluid>
      <v-row justify="center">
        <v-col cols="12">
          <v-dialog width="20%" v-model="alert">
            <v-card>
              <v-card-title> Login </v-card-title>
              <v-card-text>
                {{ log }}
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="green darken-1" @click="alert = false" dark
                  >Ok</v-btn
                >
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-col>
        <v-col cols="5">
          <v-card class="card-login mx-a" elevation="3" color="#ebecf0">
            <v-card-title>Login</v-card-title>
            <v-divider></v-divider>
            <v-card-text class="pa-5">
              <v-form v-on:submit.prevent="signIn" action="#" method="post">
                <v-text-field
                  color="green darken-1"
                  v-model.trim="userid"
                  label="ID"
                ></v-text-field>
                <v-text-field
                  color="green darken-1"
                  v-model.trim="password"
                  type="password"
                  label="Password"
                ></v-text-field>

                <v-btn class="sign-button login-btn" color="#6d7491" type="submit" dark style="width:100%">로그인</v-btn>

                <v-btn class="sign-button signup-btn" color="#6d7491" to="/user/signup" dark style="width:100%">회원가입</v-btn>

                <div style="display:flex; justify-content:center">
                <v-btn width="131" height="50" :href="naverApi" style="margin-right: 10px">
                  <img height="50" src='http://static.nid.naver.com/oauth/small_g_in.PNG'/>
                </v-btn>

                <v-btn :to="{ name: `UserFindPw` }" height="50"> 비밀번호 찾기 </v-btn>
                </div>

              </v-form>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
  name: "UserLogin",
  data() {
    return {
      userid: "",
      password: "",
      log: "User and Password is required.",
      alert: false,
    };
  },
  computed: {
    naverApi() {
      let client_id = process.env.VUE_APP_NAVERLOGIN_CLIENT_ID;
      let redirect_uri = process.env.VUE_APP_NAVERLOGIN_REDIRECT_URI;
      let state = process.env.VUE_APP_NAVERLOGIN_RANDOM_STATE;
      let naver_uri = process.env.VUE_APP_NAVERLOGIN_URI;
      return (
        naver_uri +
        "&client_id=" +
        client_id +
        "&redirect_uri=" +
        redirect_uri +
        "&state=" +
        state
      );
    },
  },
  methods: {
    ...mapActions("authStore", ["login"]),
    async signIn() {
      if (this.userid == "" || this.password == "") {
        this.alert = true;
      } else {
        await this.login({
          userid: this.userid,
          password: this.password,
        });
      }
    },
  },
};
</script>

<style scoped>
.sign-button {
  margin-bottom : 10px;
  transition: all 0.1s ease-in-out;
} 

</style>
