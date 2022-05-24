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

  static updateUser = async (user) => {
    try {
      const result = await axiosAuth.put("/user", user);
      return result.data;
    } catch (err) {
      return err;
    }
  }

  static changePassword = async (pwJson) => {
    try {
      const result = await axiosAuth.post("/user/changepw", pwJson);
      return result.data;
    } catch (err) {
      return err;
    }
  }

  static deleteUser = async (password) => {
    try {
      // 삭제는 data로 한번 묶어줘야함...
      const result = await axiosAuth.delete("/user", {data : {password: password}});
      return result.data;
    } catch (err) {
      return err;
    }
  }

  static findPassword = async (user) => {
    try {
      const result = await axiosAuth.post("/user/findpw", user);
      return result.data;
    } catch (err) {
      return err;
    }
  }
}
