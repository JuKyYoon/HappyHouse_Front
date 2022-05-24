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

      <!-- 검색창 -->
      <v-dialog
        v-model="searchDialog"
        width="700"
        content-class="map-search-bar"
      >
        <v-card>
          <v-combobox
            :items="addressList"
            @keyup.enter="searchDong"
            dense
            filled
            label="주소 검색"
            item-text="address"
            item-value="latlng"
            return-object
            :search-input.sync="searchQuery"
            menu-props="{'searchDialog': false}"
            @change="moveToAddress"
          >
          </v-combobox>
        </v-card>
      </v-dialog>

      <v-row justify="center">
        <v-dialog v-model="favoriteDialog" persistent max-width="600px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="primary" dark v-bind="attrs" v-on="on">
              불러오기
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="text-h5">즐겨찾기</span>
            </v-card-title>
            <v-card-text>
              <favorite-house-vue v-if="favoriteDialog" @moveToAddress="moveToAddress"></favorite-house-vue>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="favoriteDialog = false">
                close
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>

      <div id="map"></div>
    </div>

    <div class="map-div-right" v-if="dealOverlay">
      <deal-side-bar-vue
        :deals="deals"
        :aptName="aptName"
        :aptCode="aptCode"
        @closeOveray="closeOveray"
      ></deal-side-bar-vue>
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
import { FavoriteService } from "@/service/favorite.service";
import FavoriteHouseVue from "./FavoriteHouse.vue";
export default {
  name: "MainMap",
  components: {
    DealSideBarVue,
    FavoriteHouseVue
  },
  data() {
    return {
      favoriteDialog: false,
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
            this.favoriteDialog = !this.favoriteDialog
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
      houses: [], // 집 정보
      aptMarkers: [], // 마커 배열
      deals: [], // 사이드 창에서 불러오는 거래내역 리스트
      dealOverlay: false, // 사이드 창 오버레이 토글
      clusterer: null, 
      aptName: "", // 현재 선택한 아파트 이름
      aptCode: "", // 선택한 아파트 코드
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
        process.env.VUE_APP_KAKAOMAP_KEY +
        "&libraries=clusterer";
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
      this.clusterer = new kakao.maps.MarkerClusterer({
        map: this.kakaomap, // 마커들을 클러스터로 관리하고 표시할 지도 객체
        averageCenter: true, // 클러스터에 포함된 마커들의 평균 위치를 클러스터 마커 위치로 설정
        minLevel: 6, // 클러스터 할 최소 지도 레벨? 무슨 의미지
      });
    },
    toggleSearchBar() {
      this.searchDialog = !this.searchDialog;
    },
    async searchDong() {
      if (this.searchQuery.length < 2) {
        alert("2글자 이상 입력하세요");
        return;
      }
      const data = await AddressService.searchDong({
        searchQuery: this.searchQuery,
      });
      if (data?.status === "success") {
        console.log(data.result);
        // this.addressList = data.result;
        this.addressList = data.result.map((d) => {
          d.address = `${d.sidoName} ${d.gugunName} ${d.dongName}`;
          return d;
        });
      } else if (data?.result == "short") {
        alert("2글자 이상 입력하세요");
      } else {
        alert("불러오기 실패");
      }
    },
    moveToAddress(item) {
      if (item.lat == undefined || item.lng == undefined) {
        return;
      }
      console.log(item.lat, item.lng);
      var moveLatLon = new kakao.maps.LatLng(
        Number(item.lat),
        Number(item.lng)
      );
      this.kakaomap.panTo(moveLatLon);
      this.searchDialog = false;
      this.favoriteDialog = false;
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
    async getAptDeals(aptCode, aptName) {
      // 클릭시 거래내역 가져오기
      // console.log(aptCode);
      const data = await DealService.getDealsByCode(aptCode);

      if (data?.status == "success") {
        console.log(data.result);
        this.deals = data.result;
        this.dealOverlay = true;
        this.aptName = aptName;
        this.aptCode = aptCode;
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
      if (this.boundary.left == null) {
        alert("바운더리 오류");
        return;
      }
      // 바운더리 바뀔 때 마다, 서버에서 아파트 정보 받아온다.
      // 단 현재 맵의 level 체크해서!!!!!!!
      const mapLevel = this.kakaomap.getLevel();
      if (mapLevel < 6) {
        this.clusterer.clear();
        console.log("get apt");
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
      } else if (mapLevel < 8) {
        // 동단위
        console.log("get aptcount dong");

        this.aptMarkers.forEach((marker) => {
          marker.setMap(null);
        });
        this.aptMarkers = [];

        const data = await HouseService.getHouseCount(this.boundary);
        if (data?.status == "success") {
          console.log(data);

          var markers = data.result.map(function (position) {
            return new kakao.maps.Marker({
              position: new kakao.maps.LatLng(position.lat, position.lng),
            });
          });
          this.clusterer.clear();
          this.clusterer.addMarkers(markers);
        } else {
          if (data.response?.status == 403) {
            alert("금지된 요청");
          } else {
            alert("불러오기 실패");
          }
        }
      } else {
        // 시단위?
        console.log("get aptcount si");
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
  top: 20%;
  right: 10px;
  bottom: 0;
  /* left: 0; */
  width: 30%;
  max-width: 500px;
  height: 200px;
  z-index: 10;
}

.deal-side-bar-apt-title {
  display: flex;
  flex-direction: row;
  margin: 1%;
}
.deal-side-bar-apt-title-text {
  width: 400px;
  color: white;
  padding-left: 10px;
  padding-top: 10px;
}
</style>
