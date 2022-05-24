<template>
  <v-container>
    <v-data-table
      dense
      :headers="headers"
      :items="favorites"
      item-key="aptCode"
      class="elevation-1"
      @click:row="favoriteClick"
    >
      <template v-slot:[`item.dongCode`]="{ item }">
        <span>{{
          covertAddress(
            item.sidoName,
            item.gugunName,
            item.dongName,
            item.jibun
          )
        }}</span>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
import { FavoriteService } from "@/service/favorite.service";
export default {
  name: "FavoriteHouse",
  data() {
    return {
      favorites: [],
      headers: [
        {
          text: "아파트 이름",
          align: "start",
          sortable: true,
          value: "aptName",
        },
        {
          text: "건축년도",
          sortable: true,
          value: "buildYear",
        },
        {
          text: "주소",
          align: "start",
          sortable: false,
          value: "dongCode",
        },
      ],
    };
  },
  methods: {
    async getFavorites() {
      const data = await FavoriteService.getFavorites();
      if (data?.status == "success") {
        console.log(data.result);
        this.favorites = data.result;
      } else {
        alert("서버 에러");
      }
    },
    covertAddress(si, gu, dong, jibun) {
      return `${si} ${gu} ${dong} ${jibun}`;
    },
    favoriteClick(item) {
      console.log(item.lat, item.lng);
      this.$emit("moveToAddress", item);
    },
  },
  async created() {
    console.log("open");
    this.getFavorites();
  },
};
</script>

<style></style>
