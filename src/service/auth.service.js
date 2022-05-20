import axiosAuth from "./axios.auth";


export class AuthService {
  /**
   * 유저 로그인
   * @param {id:string, password:string} user 
   * @returns 
   */
  static signIn = async (user) => {
    try {
      const result = await axiosAuth.post("/auth/signin", user);
      return result.data;
    } catch (err) {
      return err;
    }
  };

  /**
   * refreshToken이용한 accessToken 재발급
   * @returns 
   */
  static refreshToken = async () => {
    try {
      const result = await axiosAuth.post('/auth/refresh');
      return result.data;
    } catch (err) {
      return err;
    }
  };

  static signOut = async () => {
    try {
      const result = await axiosAuth.get('/auth/logout');
      return result.data;
    } catch (err) {
      return err;
    }
  }
}
