import axiosAuth from "./axios.auth.js";

// 즐겨찾기에 추가한 아파트
export class FavoriteService {

  static checkHouse = async (aptCode) => {
    try {
      const result = await axiosAuth.get(`/favorite/${aptCode}`);
      return result.data;
    } catch (err) {
      return err;
    }
  }

  static registerFavorite =  async (apt) => {
    try {
      const result = await axiosAuth.post(`/favorite`, apt);
      return result.data;
    } catch (err) {
      return err;
    }
  }
  
  static cancelFavorite = async (aptCode) => {
    try {
      const result = await axiosAuth.delete(`/favorite/${aptCode}`);
      return result.data;
    } catch (err) {
      return err;
    }
  }

  static getFavorites = async () => {
    try {
      const result = await axiosAuth.get(`/favorite`);
      return result.data;
    } catch (err) {
      return err;
    }
  }
}
