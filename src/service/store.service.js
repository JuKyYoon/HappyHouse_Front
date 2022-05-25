import axios from "axios";
import axiosAuth from "./axios.auth";
import { KAKAO_SEARCH_QUERY} from "@/const/const.js";
export class StoreService {
  static getStores = async (boundary) => {
    try {
      // const url = `
      //   https://apis.data.go.kr/B553077/api/open/sdsc2/storeListInRectangle?serviceKey=${process.env.VUE_APP_DATE_KEY}&pageNo=1&numOfRows=100&minx=${boundary.left}&miny=${boundary.bottom}&maxx=${boundary.right}&maxy=${boundary.top}&type=json
      //   `;
      // const result = await axios.get(url);

      const result = await axiosAuth.post("/store", boundary);
      return result.data;
    } catch (err) {
      return err;
    }
  };

  static getSpecialArea = async (query) => {
    try {
      const url = KAKAO_SEARCH_QUERY + query
      const headers = {
        "Authorization": `KakaoAK ${process.env.VUE_APP_KAKAOAPI_KEY}`
      }

      const result = await axios.get(url, {headers:headers});
      return result;
    } catch (err) {
      return err;
    }
  };
}
