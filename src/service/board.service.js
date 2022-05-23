import axiosAuth from "./axios.auth.js";

export class BoardService {
  static getAllBoard = async () => {
    try {
      const result = await axiosAuth.get("/board");
      return result.data;
    } catch (err) {
      return err;
    }
  };

  static createBoard = async (board) => {
    try {
      const result = await axiosAuth.post("/board", board);
      return result.data;
    } catch (err) {
      return err;
    }
  }

  static getBoardByIdx = async (idx) => {
    try {
      const result = await axiosAuth.get(`/board/${idx}`);
      return result.data;
    } catch (err) {
      return err;
    }
  }

  static updateBoard = async (board) => {
    try {
      const result = await axiosAuth.put(`/board/${board.idx}`, board);
      return result.data;
    } catch (err) {
      return err;
    }
  }

  static deleteBoard = async (idx) => {
    try {
      const result = await axiosAuth.delete(`/board/${idx}`);
      return result.data;
    } catch (err) {
      return err;
    }
  };

}
