import axiosAuth from "./axios.auth";

export class QnaService {
  static createQna = async (qna) => {
    try {
      const result = await axiosAuth.post("/qna", qna);
      return result.data;
    } catch (err) {
      return err;
    }
  };

  static getAllQna = async () => {
    try {
      const result = await axiosAuth.get("/qna");
      return result.data;
    } catch (err) {
      return err;
    }
  };

  static getQnaByIdx = async (idx) => {
    try {
      const result = await axiosAuth.get(`/qna/${idx}`);
      return result.data;
    } catch (err) {
      return err;
    }
  };

  static deleteQna = async (idx) => {
    try {
      const result = await axiosAuth.delete(`/qna/${idx}`);
      return result.data;
    } catch (err) {
      return err;
    }
  };

  static updateQna = async (qna) => {
    try {
      const result = await axiosAuth.put(`/qna/${qna.idx}`, qna);
      return result.data;
    } catch (err) {
      return err;
    }
  };

  static toggleSolve = async (idx) => {
    try {
      const result = await axiosAuth.put(`/qna/solve/${idx}`);
      return result.data;
    } catch (err) {
      return err;
    }
  };
}
