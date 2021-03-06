import jwt_decode from "jwt-decode";
import { AuthService } from "@/service/auth.service.js";
import { SocialLoginService } from "@/service/socialLogin.service.js";
import router from "@/router/index.js";
const authStore = {
  namespaced: true,
  state: {
    accessToken: null,
    userid: "",
    isLogin: false,
    admin: false
  },
  getters: {},
  mutations: {
    setUserId(state, { accessToken, userid, admin }) {
      state.accessToken = accessToken;
      state.userid = userid;
      state.isLogin = true;
      state.admin = admin;
    },
    setAccessToken(state, payload) {
      state.accessToken = payload;
    },
    deleteAuth(state) {
      state.accessToken = null;
      state.userid = "";
      state.isLogin = false;
      state.admin = false;
    },
  },
  actions: {
    async login({ commit }, user) {
      const data = await AuthService.signIn(user);
      if (data?.status == "success") {
        commit("setUserId", {
          accessToken: data.result.accessToken,
          userid: jwt_decode(data.result.accessToken).userid,
          admin: data.result?.role == "ROLE_ADMIN" ? true : false
        });
        alert("로그인 성공");
        router.push("/")
      } else {
        console.log(data);
        alert("로그인 실패");
      }
    },
    async naverLogin({commit}, {code, state}) {
      const data = await SocialLoginService.naverLogin(code, state);

      if(data?.status == "success"){
        const result = data.result;
        if(result=="register") {
          console.log("회원가입 성공")
          router.push("/socialsignup");
        } else if (result == "registerfail") {
          console.log("회원가입 왜 실패함? 서버 오류임")
        } else {
          console.log("로그인!")
          commit("setUserId", {accessToken: result.accessToken, userid: result.email});
          router.push("/");
        }
      } else {
        console.log("fail")
      }
    },
    async logout({ commit }) {
      if(this.state.authStore.isLogin) {
        const data = await AuthService.signOut();
        if (data?.status == "success") {
          console.log("로그아웃 성공");
        } else {
          console.log(data);
          console.log("로그아웃 실패");
        }
      }
      commit("deleteAuth");
      alert("로그아웃")
      if(router.history.current.path != '/'){
        router.push("/")
      }
    },
    async refresh({ commit }, { accessToken }) {},
  },
};

export default authStore;
