import axiosAuth from "./axios.auth.js";

export class SocialLoginService {
  static naverLogin = async (code, state) => {
    try {
      const result = await axiosAuth.get(`/social/naver?code=${code}&state=${state}`);
      return result.data;
    } catch (err) {
      return err;
    }
  };
}
