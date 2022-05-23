import Vue from 'vue'
import Vuex from 'vuex'
import qnaStore from '@/store/modules/qnaStore.js'; //QNA 게시판
import authStore from "@/store/modules/authStore.js"; // 인증 관련
import mapStore from "@/store/modules/mapStore.js"; 
import articleStore from "@/store/modules/articleStore.js";
import createPersistedState from "vuex-persistedstate";
Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    qnaStore,
    authStore,
    mapStore,
    articleStore
  },
  plugins: [
    createPersistedState({
      // 브라우저 종료시 제거하기 위해 localStorage가 아닌 sessionStorage로 변경. (default: localStorage)
      storage: sessionStorage,
    }),
  ],
})
