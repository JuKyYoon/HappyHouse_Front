<template>
  <div class="main-map">
    <div class="map-div-left">
      <v-navigation-drawer
        class="map-tool"
        v-model="drawer"
        :mini-variant.sync="mini"
        permanent
      >
        <v-list-item class="px-2">
          <v-list-item-avatar>
            <v-icon>mdi-home-city</v-icon>
          </v-list-item-avatar>

          <v-list-item-title>도구 모음</v-list-item-title>

          <v-btn icon @click.stop="mini = !mini">
            <v-icon>mdi-chevron-left</v-icon>
          </v-btn>
        </v-list-item>

        <v-divider></v-divider>

        <v-list dense>
          <v-list-item v-for="item in items" :key="item.title">
            <v-list-item-icon>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title @click="item.clickAction">{{
                item.title
              }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>

      <v-dialog
        v-model="searchDialog"
        width="700"
        content-class="map-search-bar"
      >
        <v-card>
          <v-text-field
            filled
            height="auto"
            v-model.trim="searchQuery"
            @keyup.enter="searchDong"
          ></v-text-field>
          <v-select
            :items="addressList"
            :item-text="
              (item) =>
                item.sidoName + ' ' + item.gugunName + ' ' + item.dongName
            "
            item-value="dongCode"
            return-object
            @change="moveToAddress"
          ></v-select>
        </v-card>
      </v-dialog>

      <div id="map"></div>
    </div>

    <div class="map-div-right" v-if="dealOverlay" >
      <deal-side-bar-vue :deals="deals" @closeOveray="closeOveray"></deal-side-bar-vue>
    </div>
  </div>
</template>

<script>
/* global kakao */
import { AddressService } from "@/service/address.service.js";
import { DealService } from "@/service/deal.service.js";
import { HouseService } from "@/service/house.service.js";
import { StoreService } from "@/service/store.service";

import KakaoMapEvent from "@/util/kakaoMapEvent.js";
import { markerImage, markerInfoWindow } from "@/util/kakaoMapMarker.js";
import { mapState } from "vuex";
import DealSideBarVue from "./DealSideBar.vue";
export default {
  name: "MainMap",
  components: {
    DealSideBarVue,
  },
  data() {
    return {
      searchDialog: true, // 검색 창 보이기/숨기기
      searchQuery: "서울 강남", // 지역 검색
      drawer: false, // 도구바 보이기/숨기기
      items: [
        {
          title: "지역 검색",
          icon: "mdi-home-city",
          clickAction: () => {
            this.toggleSearchBar();
          },
        },
        {
          title: "My Account",
          icon: "mdi-account",
          clickAction: () => {
            this.toggleSearchBar();
          },
        },
        {
          title: "Users",
          icon: "mdi-account-group-outline",
          clickAction: () => {
            this.toggleSearchBar();
          },
        },
      ],
      addressList: [], // 서버에서 받아온 주소 리스트
      mini: true,
      kakaomap: null,
      houses: [],
      aptMarkers: [],
      deals: [],
      dealOverlay: false,
    };
  },
  computed: {
    ...mapState("mapStore", ["boundary"]),
  },
  mounted() {
    if (window.kakao && window.kakao.maps) {
      // console.log("새로고침 하면 여기")
      this.initMap();
    } else {
      const script = document.createElement("script");

      script.onload = () => kakao.maps.load(this.initMap);
      script.src =
        `//dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=` +
        process.env.VUE_APP_KAKAOMAP_KEY;
      document.head.appendChild(script);
    }
  },
  methods: {
    initMap() {
      const container = document.getElementById("map");
      // 왜 kakao.maps.LatLng가 undefined 인지 모르겠음
      // console.log(kakao.maps);
      // console.log(kakao.maps.LatLng);
      // console.log(kakao.maps);
      const options = {
        center: new kakao.maps.LatLng(33.450701, 126.570667),
        level: 5,
      };

      //지도 객체를 등록합니다.
      this.kakaomap = new kakao.maps.Map(container, options);
      this.kakaomap.relayout();

      KakaoMapEvent(this.kakaomap, this.boundary);
    },
    toggleSearchBar() {
      this.searchDialog = !this.searchDialog;
    },
    async searchDong() {
      const data = await AddressService.searchDong({
        searchQuery: this.searchQuery,
      });
      if (data?.status === "success") {
        console.log(data.result);
        this.addressList = data.result;
      } else if (data?.result == "short") {
        alert("2글자 이상 입력하세요");
      } else {
        alert("불러오기 실패");
      }
    },
    moveToAddress(item) {
      console.log(item);
      var moveLatLon = new kakao.maps.LatLng(item.lat, item.lng);
      this.kakaomap.panTo(moveLatLon);
      this.searchDialog = false;
    },
    setAptMarkers(houses) {
      this.aptMarkers.forEach((marker) => {
        marker.setMap(null);
      });
      this.aptMarkers = [];
      houses.forEach((house) => {
        // console.log(Number(house.lat), Number(house.lng));
        let marker = new kakao.maps.Marker({
          position: new kakao.maps.LatLng(Number(house.lat), Number(house.lng)),
          title: house.aptName,
          map: this.kakaomap,
          image: markerImage(),
        });

        markerInfoWindow(
          house,
          marker,
          this.kakaomap,
          this.getAptDeals,
          this.closeOveray
        );
        this.aptMarkers.push(marker);
      });
    },
    async getAptDeals(aptCode) {
      // 클릭시 거래내역 가져오기
      // console.log(aptCode);
      const data = await DealService.getDealsByCode(aptCode);

      if (data?.status == "success") {
        console.log(data.result);
        this.deals = data.result;
        this.dealOverlay = true;
      } else {
        console.log("거래내역 가져오기 실패");
      }
    },
    closeOveray() {
      this.deals = [];
      this.dealOverlay = false;
    },
  },
  watch: {
    searchDialog: function () {
      // 검색창 닫으면 검색단어도 지운다
      this.searchQuery = "";
    },
    boundary: async function () {
      // 바운더리 바뀔 때 마다, 서버에서 아파트 정보 받아온다.
      // 단 현재 맵의 level 체크해서!!!!!!!
      if (this.kakaomap.getLevel() < 6) {
        const data = await HouseService.getHouses(this.boundary);
        if (data?.status == "success") {
          console.log(data);
          this.setAptMarkers(data.result);
        } else {
          if (data.response.status == 403) {
            alert("금지된 요청");
          } else {
            alert("불러오기 실패");
          }
        }
      } else {
        this.aptMarkers.forEach((marker) => {
          marker.setMap(null);
        });
        this.aptMarkers = [];
      }

      // const data2 = await StoreService.getStores(this.boundary);
      // console.log(data2)
    },
  },
};
</script>

<style>
#map {
  height: 80vh;
}

.main-map {
  /* display: flex;
  flex-direction: row; */
  margin-left: 10px;
  margin-right: 10px;
}

.map-div-left {
  width: 100%;
}

.custom-overlay {
  position: absolute;
  bottom: 50px;
  margin-bottom: 5px;
  margin-left: -150px;
  padding: 7px;
  width: 300px;
  height: 150px;
  -webkit-border-radius: 3px;
  -moz-border-radius: 3px;
  border-radius: 3px;
  background-color: #000;
  background-color: hsla(0, 0%, 20%, 0.9);
  color: #fff;
  text-align: center;
  font-size: 14px;
  line-height: 1.2;
  z-index: -1;
}

.custom-overlay-title {
  height: 40px;
}

.custom-overlay-close-button {
  position: absolute;
  width: 40px;
  right: 10px;
  background-color: white;
  color: black;
}

.custom-overlay-close-button:hover {
  background-color: grey;
}

.custom-overlay-main {
  display: flex;
  flex-direction: row;
}
.custom-overlay-left {
  width: 150px;
  /* background-color: red; */
}
.custom-overlay-right {
  width: 150px;
  /* background-color: blue; */
}

.overlay-apt-img {
  width: auto;
  height: 100px;
}

.map-div-right {
  position: fixed;
  top: 100px;
  right: 0;
  bottom: 0;
  /* left: 0; */
  height: 100px;
  z-index: 10;
}
</style>
