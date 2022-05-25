import { QnaService } from "@/service/qna.service.js";
import { AnswerService } from "@/service/answer.service";
import router from "@/router/index.js";
import { BoardService } from "@/service/board.service";
const boardStore = {
  namespaced: true,
  state: {
    state: {
      article: {
        title: "",
        content: "",
        userid: "",
        idx: 0,
        create_date: "",
        modify_date: "",
        solved: 0,
        view_count: 0,
        category: "자유",
      },
      editArticle: {
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
  },
  mutations: {
    /** 공통 부분 */
    // 글 작성
    setArticle(state, payload) {
      state.article = payload;
    },
    // 글 비우기
    initArticle(state) {
      state.article = {
        title: "",
        content: "",
        userid: "",
        idx: 0,
        create_date: "",
        modify_date: "",
        solved: 0,
        view_count: 0,
        category: "자유",
      };
    },
    updateContent(state, payload) {
      state.article.content = payload;
    },

    /** 게시판 부분 */

    /** QNA 관련 부분 */
    updateSolved(state) {
      state.article.solved = !state.article.solved;
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
    async getArticle({ commit }, {idx, type}) {
      console.log(type)
      if (type == "qna") {
        const data = await QnaService.getQnaByIdx(idx);
        if (data.status == "success") {
          commit("setArticle", data.result);
        } else {
          alert("불러오기 실패");
          commit("initArticle");
        }
      } else {
        const data = await BoardService.getBoardByIdx(idx);
        if (data.status == "success") {
          commit("setArticle", data.result);
        } else {
          alert("불러오기 실패");
          commit("initArticle");
        }
      }
    },
    async deleteArticle({ commit }, {idx, type}) {
      if (type == "qna") {
        const data = await QnaService.deleteQna(idx);

        if (data.status == "success") {
          commit("initArticle");
          router.push({ name: "QnaList" });
        } else {
          alert("삭제 실패");
        }
      } else {
        const data = await BoardService.deleteBoard(idx);
        if (data.status == "success") {
          commit("initArticle");
          router.push({ name: "BoardList" });
        } else {
          alert("삭제 실패");
        }
      }
    },
    async updateArticle({ commit }, {article, type}) {
      if (type == "qna") {
        const data = await QnaService.updateQna(article);
        if (data.status == "success") {
          console.log(data.result);
          alert("수정 성공");
          return true;
        } else {
          alert("수정 실패");
          return false;
        }
      } else {
        const data = await BoardService.updateBoard(article);
        if (data.status == "success") {
          console.log(data.result);
          alert("수정 성공");
          return true;
        } else {
          alert("수정 실패");
          return false;
        }
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

export default boardStore;
