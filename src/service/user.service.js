import axiosAuth from "./axios.auth.js";

export class UserService {
  static getMyInfo = async () => {
    try {
      const result = await axiosAuth.get("/user/myinfo");
      return result.data;
    } catch (err) {
      return err;
    }
  };
}
