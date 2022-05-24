<template>
  <v-card class="mx-auto map-right-side">
    <v-navigation-drawer
      class="deep-purple accent-4"
      dark
      permanent
      width="500"
    >
      <div class="deal-side-bar-apt-title">
        <div class="deal-side-bar-apt-title-text">
          {{ aptName }}
        </div>
        <div>
          <v-btn v-if="!isFavorite" @click="registerFavorite"
            ><v-rating
              :value="0"
              color="amber"
              dense
              readonly
              length="1"
              size="14"
            ></v-rating
            >즐겨찾기</v-btn
          >
          <v-btn v-else @click="cancelFavorite"
            ><v-rating
              :value="1"
              color="amber"
              dense
              readonly
              length="1"
              size="14"
            ></v-rating
            >즐겨찾기</v-btn
          >
        </div>
      </div>

      <v-data-table
        dense
        :headers="headers"
        :items="deals"
        item-key="no"
        class="elevation-1"
      >
        <template v-slot:[`item.money`]="{ item }">
          <span>{{ covertMoney(item.money) }}원</span>
        </template>
        <template v-slot:[`item.area`]="{ item }">
          <span>{{ Math.ceil(item.area, 1) }}평</span>
        </template>
      </v-data-table>
      <template v-slot:append>
        <div class="pa-2">
          <v-btn v-on:click="closeOveray"> CLOSE </v-btn>
        </div>
      </template>
    </v-navigation-drawer>
  </v-card>
</template>

<script>
import { FavoriteService } from "@/service/favorite.service";
export default {
  name: "DealSideBar",
  props: ["deals", "aptName", "aptCode"],
  data() {
    return {
      isFavorite: false,
      headers: [
        {
          text: "거래가",
          align: "start",
          sortable: true,
          value: "money",
          width: 130,
        },
        {
          text: "년",
          align: "start",
          sortable: false,
          value: "year",
          width: 20,
        },
        {
          text: "월",
          align: "start",
          sortable: false,

          value: "month",
          width: 20,
        },
        {
          text: "일",
          align: "start",
          sortable: false,
          value: "day",
          width: 20,
        },
        {
          text: "층",
          align: "start",
          sortable: true,
          value: "floor",
          width: 70,
        },
        {
          text: "면적",
          align: "start",
          sortable: true,
          value: "area",
        },
      ],
    };
  },
  methods: {
    closeOveray() {
      this.$emit("closeOveray");
    },
    convertDay(year, month, day) {
      return `${year}년 ${month}월 ${day}일`;
    },
    covertMoney(money) {
      let c = parseInt(money.replace(/,/g, ""));
      let uk = parseInt(c / 10000);
      if (uk != 0) {
        if (c % 10000 == 0) {
          return `${uk}억`;
        } else {
          return `${uk}억 ${c % 10000} 만`;
        }
      } else {
        return `${c % 10000} 만`;
      }
    },
    async registerFavorite() {
      const data = await FavoriteService.registerFavorite({
        aptCode: this.aptCode,
      });
      if (data?.status == "success") {
        this.isFavorite = true;
      } else {
        alert("등록 실패");
      }
    },
    async cancelFavorite() {
      const data = await FavoriteService.cancelFavorite(this.aptCode);
      if (data?.status == "success") {
        this.isFavorite = false;
      } else {
        alert("등록 실패");
      }
    },
  },
  async created() {
    const data = await FavoriteService.checkHouse(this.aptCode);
    if (data?.status == "success") {
      console.log(data);
      this.isFavorite = true;
    } else if (data?.status == "notfavorite") {
      console.log("즐겨찾기 아님");
    } else {
      alert("불러오기 실패");
    }
  },
};
</script>

<style></style>
