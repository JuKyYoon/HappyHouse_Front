import axiosAuth from "./axios.auth.js";

export class HouseService {
  static getHouses = async (boundary) => {
    try {
      const result = await axiosAuth.post("/house/map", boundary);
      return result.data;
    } catch (err) {
      return err;
    }
  };

  static getHouseCount = async (boundary) => {
    try {
      const result = await axiosAuth.post("/house/count", boundary);
      return result.data;
    } catch (err) {
      return err;
    }
  }
}
