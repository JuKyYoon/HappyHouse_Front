import axiosAuth from "./axios.auth.js";

export class DealService {
  static getDealsByCode = async (aptCode) => {
    try {
      const result = await axiosAuth.get(`/deal/${aptCode}`);
      return result.data;
    } catch (err) {
      return err;
    }
  };
}
