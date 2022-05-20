import axiosAuth from "./axios.auth";


export class AdminService {
  static getUsers = async () => {
    try {
      const result = await axiosAuth.get("/admin/users");
      return result.data;
    } catch (err) {
      return err;
    }
  };
}
