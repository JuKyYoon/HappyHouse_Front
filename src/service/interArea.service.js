import axiosAuth from "./axios.auth";

export class InterAreaService {

  static register = async (interest) => {
    try {
      const result = await axiosAuth.post('/interest', interest);
      return result.data;
    } catch (e) {
      return e;
    }
  }

  static getAreas = async () => {
    try {
      const result = await axiosAuth.get('/interest');
      return result.data;
    } catch (e) {
      return e;
    }
  }

  static deleteAreas = async (idx) => {
    try {
      const result = await axiosAuth.delete(`/interest/${idx}`);
      return result.data;
    } catch (e) {
      return e;
    }
  }
}