<template>
  <div class="container">
    <div class="input-form">
      <div class="form">
        <div name="register-form" class="register-form">
          <div class="title">회원 가입</div>
          <!-- <label>아이디</label> -->
          <v-text-field
            label="id"
            hide-details="auto"
            :rules="passwordRules"
            v-model.trim="userid"
            class="sign_input"
            ref="userid"
          ></v-text-field>
          <label>{{ msg }}</label>
          <input
            id="id_check"
            type="button"
            value="ID 중복체크"
            @click="idCheck"
          />

          <!-- <label>비밀번호</label> -->
          <v-text-field
            label="password"
            type="password"
            hide-details="auto"
            :rules="passwordRules"
            v-model.trim="password"
            class="sign_input"
            ref="password"
          ></v-text-field>
          <!-- <label>이름</label> -->
          <v-text-field
            label="username"
            hide-details="auto"
            :rules="textRules"
            v-model.trim="username"
            class="sign_input"
            ref="username"
          ></v-text-field>
          <!-- <label>이메일</label> -->
          <v-text-field
            label="email"
            hide-details="auto"
            :rules="emailRules"
            class="sign_input"
            v-model.trim="email"
            ref="email"
          ></v-text-field>
          <!-- <label>전화번호</label> -->
          <v-text-field
            label="phone"
            hide-details="auto"
            :rules="textRules"
            class="sign_input"
            v-model.trim="phone"
            ref="phone"
          ></v-text-field>
          <div>
            <button
              id="register"
              class="button_signup"
              disabled="disabled"
              @click="signUp"
            >
              등록
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { UserService } from "@/service/user.service";

export default {
  name: "UserSignUp",
  data() {
    return {
      userid: "",
      password: "",
      username: "",
      email: "",
      phone: "",
      msg: "",
      passwordRules: [
        (value) => !!value || "Required.",
        (value) => (value || "").length >= 4 || "Min 4 characters",
        (value) => (value || "").length <= 50 || "Max 50 characters",
      ],
      textRules: [
        (value) => !!value || "Required.",
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
    async idCheck() {
      if (this.userid.length < 4 || this.userid.length > 50) {
        this.$refs.userid.focus();
        return;
      }
      const data = await UserService.idCheck(this.userid);
      if (data?.status == "success") {
        if (data?.result == "yes") {
          this.msg = "사용 가능한 아이디";
          document.getElementById("register").disabled = false;
        } else {
          this.msg = "사용 불가능한 아이디";
        }
      }
    },

    async signUp() {
      if (this.userid.length < 4 || this.userid.length > 50) {
        this.$refs.userid.focus();
        return;
      }
      if (this.username.length < 1 || this.username.length > 50) {
        this.$refs.username.focus();
        return;
      }
      if (this.password.length < 4 || this.userid.length > 50) {
        this.$refs.password.focus();
        return;
      }
      const pattern =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (this.email.length < 4 || this.email.length > 50 || !pattern.test(this.email)) {
        this.$refs.email.focus();
        return;
      }

      if (this.phone.length < 4 || this.phone.length > 50) {
        this.$refs.phone.focus();
        return;
      }

      const data = await UserService.signUp({
        userid: this.userid,
        password: this.password,
        username: this.username,
        email: this.email,
        mobile: this.mobile,
        address: "",
      });
      if (data?.status == "success") {
        alert("회원가입 성공");
        this.$router.push("/user/login");
      } else {
        alert("회원가입 실패");
      }
    },
  },
};
</script>

<style scoped>
/* 회원가입 */
.container {
  position: relative;
  z-index: 1;
  max-width: 100%;
  margin: 0 auto;
  height: auto;
  min-height: 100%;
  padding-bottom: 70px;
  text-align: center;
}

.input-form {
  width: 360px;
  padding: 7% 0 0;
  margin: auto;
}

.form {
  position: relative;
  z-index: 1;
  background: #ffffff;
  max-width: 360px;
  margin: 0 auto 100px;
  padding: 45px;
  text-align: center;
  box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.2), 0 5px 5px 0 rgba(0, 0, 0, 0.24);
}

.title {
  font-weight: bolder;
  font-size: xx-large;
  font-family: Arial, Helvetica, sans-serif;
}

#id {
  margin: 0px 0 0px;
}
#id_check {
  background: #252a6e;
  color: white;
  width: 40%;
  margin: 5px 0 0;
  float: right;
  height: 40%;
  padding: 5px;
}

.form .sign_input {
  font-family: "Roboto", sans-serif;
  outline: 0;
  background: #f2f2f2;
  width: 100%;
  border: 0;
  margin: 15px 0 0;
  padding: 15px;
  box-sizing: border-box;
  font-size: 14px;
}

.form button {
  margin: 0 0 15px;
  font-family: "Roboto", sans-serif;
  text-transform: uppercase;
  outline: 0;
  margin: 15px 0 5px;
  background: #252a6e;
  width: 100%;
  border: 0;
  padding: 15px;
  color: #ffffff;
  font-size: 14px;
  -webkit-transition: all 0.3 ease;
  transition: all 0.3 ease;
  cursor: pointer;
}

#register:disabled {
  background: gray;
}
</style>
