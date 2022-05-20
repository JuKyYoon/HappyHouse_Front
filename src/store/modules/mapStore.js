import { AuthService } from "@/service/auth.service.js";

const authStore = {
  namespaced: true,
  state: {
    boundary: {
      top: "",
      bottom: "",
      left: "",
      right: "",
    },
  },
  getters: {},
  mutations: {
    setBoundary(state, payload) {
      state.boundary = payload;
    }
  },
  actions: {},
};

export default authStore;
