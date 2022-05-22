import axios from "axios";
import axiosAuth from "./axios.auth";
export class StoreService {
  static getStores = async (boundary) => {
    try {
      // const url = `
      //   https://apis.data.go.kr/B553077/api/open/sdsc2/storeListInRectangle?serviceKey=${process.env.VUE_APP_DATE_KEY}&pageNo=1&numOfRows=100&minx=${boundary.left}&miny=${boundary.bottom}&maxx=${boundary.right}&maxy=${boundary.top}&type=json
      //   `;
      // const result = await axios.get(url);

      const result = await axiosAuth.post("/proxy/stores", boundary);
      return result.data;
    } catch (err) {
      return err;
    }
  };
}
