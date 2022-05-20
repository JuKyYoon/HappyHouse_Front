import router from "@/router/index.js";
import { QnaService } from "@/service/qna.service.js";
import { AnswerService } from "@/service/answer.service";

const qnaStore = {
  namespaced: true,
  state: {
    question: {
      title: "",
      content: "",
      userid: "",
      idx: 0,
      create_date: "",
      modify_date: "",
      solved: 0,
      view_count: 0,
    },
    editQuestion: {
      title: "",
      content: "",
      userid: "",
      idx: 0,
      create_date: "",
      modify_date: "",
      solved: 0,
      view_count: 0,
    },
    answers: [],
  },
  getters: {},
  mutations: {
    setQuestion(state, payload) {
      state.question = payload;
    },
    initQuestion(state) {
      state.question = {
        title: "",
        content: "",
        userid: "",
        idx: 0,
        create_date: "",
        modify_date: "",
        solved: 0,
        view_count: 0,
      };
    },
    updateContent(state, payload) {
      state.question.content = payload;
    },
    updateSolved(state) {
      state.question.solved = !state.question.solved;
    },
    setAnswers(state, payload) {
      state.answers = payload;
    },
    addAnswers(state, payload) {
      state.answers.push(payload);
    },
    deleteAnswer(state, payload) {
      const index = state.answers.findIndex((el) => el.idx == payload);
      if (index != -1) state.answers.splice(index, 1);
    },
    updateAnswer(state, payload) {
      const index = state.answers.findIndex((el) => el.idx == payload.idx);
      if (index != -1) state.answers[index].content = payload.content;
    },
  },
  actions: {
    async getQuestion({ commit }, idx) {
      const data = await QnaService.getQnaByIdx(idx);
      if (data.status == "success") {
        commit("setQuestion", data.result);
      } else {
        alert("불러오기 실패");
        commit("initQuestion");
      }
    },
    async deleteQuestion({ commit }, idx) {
      const data = await QnaService.deleteQna(idx);
      if (data.status == "success") {
        commit("initQuestion");
        router.push({ name: "QnaList" });
      } else {
        alert("삭제 실패");
      }
    },
    async updateQuestion({ commit }, qna) {
      const data = await QnaService.updateQna(qna);
      if (data.status == "success") {
        console.log(data.result);
        alert("수정 성공");
      } else {
        alert("수정 실패");
      }
    },
    async getAnswers({ commit }, idx) {
      const data = await AnswerService.getAnswers(idx);
      if (data.status == "success") {
        commit("setAnswers", data.result);
      } else {
        alert("답변 불러오기 실패");
      }
    },
    async deleteAnswer({ commit }, idx) {
      const data = await AnswerService.deleteAnswer(idx);
      if (data.status == "success") {
        commit("deleteAnswer", idx);
      } else {
        alert("답변 삭제 실패");
      }
    },
    async updateAnswer({ commit }, ans) {
      const data = await AnswerService.updateAnswer(ans);
      if (data.status == "success") {
        commit("updateAnswer", ans);
        alert("답변 업데이트 성공");
        return true;
      } else {
        alert("답변 수정 실패");
        return false;
      }
    },
  },
};

export default qnaStore;
