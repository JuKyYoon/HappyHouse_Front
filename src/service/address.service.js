import axiosAuth from "./axios.auth.js";

export class AddressService {
  static searchDong = async (search) => {
    try {
      const result = await axiosAuth.post("/addr/search", search);
      return result.data;
    } catch (err) {
      return err;
    }
  };
}
