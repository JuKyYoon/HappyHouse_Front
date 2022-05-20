import axios from "axios";
import store from "@/store/index.js";
import { AuthService } from "./auth.service.js";


// 토큰을 필요로 하는 요청
const axiosAuth = axios.create({
  baseURL: process.env.VUE_APP_SERVER_URL + "/api",
  timeout: 3000, // ( ms )
  withCredentials: true, // 쿠키 사용
});

axiosAuth.interceptors.request.use(
  function (config) {
    // 요청 성공 직전 호출됩니다.
    // axios 설정값을 넣습니다. (사용자 정의 설정도 추가 가능)
    if(store.state.authStore?.accessToken) {
      config.headers.Authorization = 'Bearer ' + store.state.authStore.accessToken
    }
    return config;
  },
  function (error) {
    // 요청 에러 직전 호출됩니다.
    return Promise.reject(error);
  }
);

axiosAuth.interceptors.response.use(
  function (response) {
    /*
      http status가 200인 경우
      응답 성공 직전 호출됩니다.
      .then() 으로 이어집니다.
    */
    return response;
  },

  async function (error) {
    /*
      http status가 200이 아닌 경우
      응답 에러 직전 호출됩니다.
      .catch() 으로 이어집니다.
    */
    const result = error.config;
    // 401오류, 즉 AccessToken 이 만료되었고, 401 오류가 처음 발생하면
    if (error.response.status === 401 && result.retry != true) {
      result.retry = true; // 401오류에 대해 1번만 반응하기 위한 변수: 무한 반복 방지
      const data = await AuthService.refreshToken();

      console.log(data)

      store.commit("authStore/setAccessToken", data.result.accessToken);
      
      // Content-Type을 기존 Request와 동일하게 만들어준다.
      // 새로 요청보내면 타입 깨지기 때문에
      if (result.headers["Content-Type"] != undefined) {
        error.response.config.headers = {
          Authorization: "Bearer " + data.result.accessToken,
          "Content-Type": result.headers["Content-Type"],
        };
      } else {
        error.response.config.headers = {
          Authorization: "Bearer " + data.result.accessToken
        };
      }
      return await axiosAuth(result);
    } else if (result.url.indexOf('refresh') != -1) { // RefreshToken이 만료되었으면, 모두 로그아웃된다,
      alert("로그인 만료")
      store.commit("authStore/deleteAuth");
      // 로그인 창으로 이동시키기
      location.href = "/user/login";
    } 
    return Promise.reject(error);
  }
);

export default axiosAuth;
