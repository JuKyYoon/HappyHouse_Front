<template>
  <v-card class="mx-auto map-right-side">
    <v-navigation-drawer dark permanent width="500" color="#575d74">
      <div class="deal-side-bar-apt-title">
        <div class="deal-side-bar-apt-title-text">
          {{ aptName }}
        </div>
        <div>
          <v-btn v-if="!isFavorite" @click="registerFavorite" color="#2b2e3a"
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
          <v-btn v-else @click="cancelFavorite" color="#2b2e3a"
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

      <v-tabs v-model="tab" align-with-title background-color="#6d7491">
        <v-tabs-slider color="#2b2e3a" si></v-tabs-slider>

        <v-tab>거래내역</v-tab>
        <v-tab>가격변동그래프</v-tab>
        <v-tab>뉴스</v-tab>
      </v-tabs>

      <v-tabs-items v-model="tab">
        <v-tab-item>
          <v-data-table
            dense
            color="#ebecf0"
            :headers="headers"
            :items="deals"
            item-key="no"
            class="elevation-1"
          >
            <template v-slot:[`item.money`]="{ item }">
              <span>{{ covertMoney(item.money) }}원</span>
            </template>
            <template v-slot:[`item.area`]="{ item }">
              <span>{{ Math.ceil(item.area, 1) }}㎡</span>
            </template>
          </v-data-table>
        </v-tab-item>

        <v-tab-item>
          <v-sparkline
            :value="value"
            color="#575d74"
            height="100"
            padding="24"
            stroke-linecap="round"
            smooth
            auto-draw
          >
          </v-sparkline>
          <div style="text-align: center">날짜순</div>
        </v-tab-item>

        <v-tab-item>
          <house-news-vue :aptCode="aptCode" :aptName="aptName" :aptAddr="aptAddr"></house-news-vue>
        </v-tab-item>
      </v-tabs-items>

      <template v-slot:append>
        <div class="pa-2">
          <v-btn v-on:click="closeOveray" color="#2b2e3a">닫기</v-btn>
        </div>
      </template>
    </v-navigation-drawer>
  </v-card>
</template>

<script>
import { FavoriteService } from "@/service/favorite.service";
import HouseNewsVue from "./HouseNews.vue";
export default {
  name: "DealSideBar",
  props: ["deals", "aptName", "aptCode", "aptAddr"],
  components: {
    HouseNewsVue,
  },
  data() {
    return {
      isFavorite: false,
      tab: null,
      value: this.deals.map((d) => this.convertMoneytoNumber(d.money)),
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
    convertMoneytoNumber(money) {
      let c = parseInt(money.replace(/,/g, ""));
      return c;
    },
    convertNumberMoneyToString(money) {
      let man = parseInt(money % 10000);
      let uk = parseInt(money / 10000);
      if (uk != 0) {
        if (man == 0) {
          return `${uk}억`;
        } else {
          return `${uk}억 ${man % 10000} 만`;
        }
      } else {
        return `${man % 10000} 만`;
      }
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
