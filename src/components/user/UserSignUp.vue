<template>
  <div class="container">
    <div class="input-form">
      <div class="form">
        <div name="register-form" class="register-form">
          <div class="title">회원 가입</div>
          <!-- <label>아이디</label> -->
          <v-text-field
            label="아이디"
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
            :disabled="availId"
            @click="idCheck"
          />

          <!-- <label>비밀번호</label> -->
          <v-text-field
            label="비밀번호"
            type="password"
            hide-details="auto"
            :rules="passwordRules"
            v-model.trim="password"
            class="sign_input"
            ref="password"
          ></v-text-field>
          <!-- <label>이름</label> -->
          <v-text-field
            label="이름"
            hide-details="auto"
            :rules="textRules"
            v-model.trim="username"
            class="sign_input"
            ref="username"
          ></v-text-field>
          <!-- <label>이메일</label> -->
          <v-text-field
            label="이메일"
            hide-details="auto"
            :rules="emailRules"
            class="sign_input"
            v-model.trim="email"
            ref="email"
          ></v-text-field>
          <!-- <label>전화번호</label> -->
          <v-text-field
            label="전화번호"
            hide-details="auto"
            :rules="textRules"
            class="sign_input"
            v-model.trim="mobile"
            ref="mobile"
          ></v-text-field>
          <div>
            <button
              id="register"
              class="button_signup"
              :disabled="!availId"
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
      mobile: "",
      msg: "",
      availId : false,
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
  watch: {
    userid: function() {
      this.availId = false;
    }
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
          this.availId = true;
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

      if (this.mobile.length < 4 || this.mobile.length > 50) {
        this.$refs.mobile.focus();
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
  padding-bottom: 70px;
  text-align: center;
}

.input-form {
  width: 360px;
  /* padding: 7% 0 0; */
  margin: auto;
  background-color: #ebecf0;
}

.form {
  position: relative;
  z-index: 1;
  /* background: #ffffff; */
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
  background: #6d7491;
  color: white;
  width: 40%;
  margin: 5px 0 0;
  float: right;
  height: 40%;
  padding: 5px;
}

#id_check:disabled {
  background: #e1e3e9;

}

.form .sign_input {
  font-family: "Roboto", sans-serif;
  outline: 0;
  /* background: #f2f2f2; */
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
  background: #6d7491;
  width: 100%;
  border: 0;
  padding: 15px;
  color: #ffffff;
  font-size: 14px;
  -webkit-transition: all 0.3s ease;
  transition: all 0.3s ease-in-out;
  cursor: pointer;
}

.form button:hover {
  background: #414557;
}

#register:disabled {
  background: gray;
}
</style>
