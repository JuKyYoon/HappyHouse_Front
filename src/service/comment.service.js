import axiosAuth from "./axios.auth";
export class CommentService {
  static getComments = async (idx) => {
    try {
      const result = await axiosAuth.get(`/comment/${idx}`);
      return result.data;
    } catch(err) {
      return err;
    }
  }

  static createComment = async (ans) => {
    try {
      const result = await axiosAuth.post(`/comment`, ans);
      return result.data;
    } catch(err) {
      return err;
    }
  }

  static deleteComment = async (idx) => {
    try {
      const result = await axiosAuth.delete(`/comment/${idx}`);
      return result.data;
    } catch(err) {
      return err;
    }
  }

  static updateComment = async (ans) => {
    try {

      const result = await axiosAuth.put(`/comment/${ans.idx}`, ans);
      return result.data;
    } catch(err) {
      return err;
    }
  }
}