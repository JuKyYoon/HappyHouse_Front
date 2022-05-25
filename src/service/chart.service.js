import axiosAuth from "./axios.auth.js";

export class ChartService {
  static getCharts = async (sido) => {
    try {
      const result = await axiosAuth.post(`/chart`, {sido : sido});
      return result.data;
    } catch (err) {
      return err;
    }
  };
}
