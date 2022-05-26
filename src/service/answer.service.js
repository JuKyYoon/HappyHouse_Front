import axiosAuth from "./axios.auth";
export class AnswerService {
  static getAnswers = async (idx) => {
    try {
      const result = await axiosAuth.get(`/answer/${idx}`);
      return result.data;
    } catch(err) {
      return err;
    }
  }

  static createAnswer = async (ans) => {
    try {
      const result = await axiosAuth.post(`/answer`, ans);
      return result.data;
    } catch(err) {
      return err;
    }
  }

  static deleteAnswer = async (idx) => {
    try {
      const result = await axiosAuth.delete(`/answer/${idx}`);
      return result.data;
    } catch(err) {
      return err;
    }
  }

  static updateAnswer = async (ans) => {
    try {

      const result = await axiosAuth.put(`/answer/${ans.idx}`, ans);
      return result.data;
    } catch(err) {
      return err;
    }
  }
}