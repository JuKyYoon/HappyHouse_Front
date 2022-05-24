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

  static signUp = async (user) => {
    try {
      const result = await axiosAuth.post("/user/signup", user);
      return result.data;
    } catch (err) {
      return err;
    }
  };

  static idCheck = async (userid) => {
    try {
      const result = await axiosAuth.post("/user/idcheck", {"userid" : userid});
      return result.data;
    } catch (err) {
      return err;
    }
  }
}
