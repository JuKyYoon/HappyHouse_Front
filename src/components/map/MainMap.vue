<template>
  <div class="main-map">
    <div class="map-div-left">
      <v-navigation-drawer
        class="map-tool"
        v-model="drawer"
        :mini-variant.sync="mini"
        permanent
        color="#fffffe"
      >
        <v-list-item class="px-2">
          <v-list-item-avatar>
            <v-icon>mdi-hammer-screwdriver</v-icon>
          </v-list-item-avatar>

          <v-list-item-title>도구 모음 </v-list-item-title>

          <v-btn icon @click.stop="mini = !mini">
            <v-icon>mdi-chevron-left</v-icon>
          </v-btn>
        </v-list-item>

        <v-divider></v-divider>

        <v-list dense>
          <v-list-item-group
            v-model="selectedTool"
            color="primary"
            class="map-tool-list-group"
          >
            <v-list-item
              v-for="item in items"
              :key="item.title"
              @click="item.clickAction"
            >
              <v-list-item-icon>
                <v-icon>{{ item.icon }}</v-icon>
              </v-list-item-icon>

              <v-list-item-content>
                <v-list-item-title>{{ item.title }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
          <v-list-item>
            <v-list-item-icon>
              <v-icon>mdi-home-city</v-icon>
            </v-list-item-icon>
            <v-list-item-content class="store-checkbox">
              <v-list-item-title
                ><v-checkbox
                  v-model="storeLoad"
                  dense
                  label="상가정보 불러오기"
                  color="orange darken-3"
                  value="orange darken-3"
                  hide-details
                ></v-checkbox
              ></v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item>
            <v-list-item-icon>
              <v-icon>mdi-crosshairs-gps</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-btn @click="geofind">내 위치 이동</v-btn>
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

      <v-dialog
        v-model="specialSearchDialog"
        width="700"
        content-class="map-search-bar"
      >
        <v-card>
          <v-card-title> </v-card-title>
          <v-checkbox v-model="nowMap" dense label="현재 지도 위치 기반 검색"> </v-checkbox>
          <v-combobox
            :items="specialList"
            @keyup.enter="searchSpecial"
            dense
            filled
            label="카카오 API검색"
            item-text="address"
            item-value="latlng"
            return-object
            :search-input.sync="specialSearchQuery"
            menu-props="{'specialSearchDialog': false}"
            @change="moveToSpecial"
          >
          </v-combobox>
        </v-card>
      </v-dialog>

      <v-dialog v-model="favoriteDialog" max-width="700px">
        <v-card>
          <v-card-title>
            <span class="text-h5">즐겨찾기</span>
          </v-card-title>
          <v-card-text>
            <favorite-house-vue
              v-if="favoriteDialog"
              @moveToAddress="moveToAddress"
            ></favorite-house-vue>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="favoriteDialog = false">
              close
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog v-model="interestDialog" max-width="700px">
        <v-card>
          <v-card-title>
            <span class="text-h5">관심지역</span>
          </v-card-title>
          <v-card-text>
            <interest-list-vue
              v-if="interestDialog"
              @moveToAddress="moveToAddress"
            ></interest-list-vue>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="interestDialog = false">
              close
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog v-model="createInterDialog" max-width="700px">
        <v-card>
          <v-card-title>
            <span class="text-h5">현재 지도를 관심지역으로 등록하기</span>
          </v-card-title>
          <v-card-text
            ><v-text-field
              label="저장할 이름을 적어주세요"
              hide-details="auto"
              :rules="[
                (value) => !!value || 'Required.',
                (value) => (value || '').length <= 20 || 'Max 20 characters',
              ]"
              v-model.trim="interAreaName"
              ref="interAreaName"
            ></v-text-field
          ></v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="registerInterArea">
              SAVE
            </v-btn>
            <v-btn color="red darken-1" text @click="createInterDialog = false">
              close
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <div id="map"></div>
    </div>

    <v-snackbar
      v-model="areaSave"
      timeout="3000"
      bottom
      color="success"
      outlined
    >
      저장 되었습니다
      <template v-slot:action="{ attrs }">
        <v-btn color="green" text v-bind="attrs" @click="areaSave = false">
          X
        </v-btn>
      </template>
    </v-snackbar>

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
import { InterAreaService } from "@/service/interArea.service";
import { StoreService } from "@/service/store.service";

import KakaoMapEvent from "@/util/kakaoMapEvent.js";
import {
  markerImage,
  specialMarkerImage,
  markerInfoWindow,
  storeMarkerInfoWindow,
  storeMarkerImage,
} from "@/util/kakaoMapMarker.js";
import { mapState } from "vuex";

import DealSideBarVue from "./DealSideBar.vue";
import FavoriteHouseVue from "./FavoriteHouse.vue";
import InterestListVue from "./InterestList.vue";
export default {
  name: "MainMap",
  components: {
    DealSideBarVue,
    FavoriteHouseVue,
    InterestListVue,
  },
  data() {
    return {
      nowMap: false,
      storeLoad: false,
      areaSave: false,
      interestDialog: false,
      createInterDialog: false,
      selectedTool: 0,
      favoriteDialog: false,
      specialSearchDialog: false,
      searchDialog: true, // 검색 창 보이기/숨기기
      searchQuery: "", // 지역 검색
      specialSearchQuery: "",
      drawer: false, // 도구바 보이기/숨기기
      interAreaName: "",
      items: [
        {
          title: "주소 검색",
          icon: "mdi-magnify",
          clickAction: () => {
            this.toggleSearchBar();
          },
        },
        {
          title: "즐겨찾기 아파트",
          icon: "mdi-home-city",
          clickAction: () => {
            this.favoriteDialog = !this.favoriteDialog;
          },
        },
        {
          title: "관심지역",
          icon: "mdi-map-legend",
          clickAction: () => {
            // this.toggleSearchBar();
            this.interestDialog = !this.interestDialog;
          },
        },
        {
          title: "관심지역 등록하기",
          icon: "mdi-playlist-plus",
          clickAction: () => {
            this.createInterDialog = !this.createInterDialog;
          },
        },
        {
          title: "장소 검색",
          icon: "mdi-cloud-search",
          clickAction: () => {
            this.specialSearchDialog = !this.specialSearchDialog;
          },
        },
      ],
      addressList: [], // 서버에서 받아온 주소 리스트
      specialList: [], // 카카오 API 주소 리스트
      mini: true,
      kakaomap: null,
      houses: [], // 집 정보
      aptMarkers: [], // 마커 배열
      storeMarkers: [],
      deals: [], // 사이드 창에서 불러오는 거래내역 리스트
      dealOverlay: false, // 사이드 창 오버레이 토글
      clusterer: null,
      aptName: "", // 현재 선택한 아파트 이름
      aptCode: "", // 선택한 아파트 코드
      specialMarker: null,
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
    geofind() {
      if (!("geolocation" in navigator)) {
        alert("Geolocation 이용불가능");
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const item = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            map_level: 1,
          };
          this.moveToAddress(item);
        },
        (err) => {
          alert("GPS 에러");
        }
      );
    },
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
    async searchSpecial() {
      if (this.specialSearchQuery.length < 2) {
        alert("2글자 이상 입력하세요");
        return;
      }
      const queryData = {}
      if(this.nowMap) {
        queryData.lat = this.kakaomap.getCenter().getLat();
        queryData.lng = this.kakaomap.getCenter().getLng();
      }
      const result = await StoreService.getSpecialArea(
        this.specialSearchQuery.trim(), queryData
      );
      if (result.status == 200) {
        console.log(result.data.documents);
        this.specialList = result.data.documents.map((d) => {
          d.address = `${d.place_name} (${d.address_name})`;
          return d;
        });
      } else {
        alert("카카오 에러");
      }
    },
    moveToAddress(item) {
      if (!item || item.lat == undefined || item.lng == undefined) {
        return;
      }
      console.log(item.lat, item.lng);
      var moveLatLon = new kakao.maps.LatLng(
        Number(item.lat),
        Number(item.lng)
      );

      this.kakaomap.setCenter(moveLatLon); // panTo 는 해당 좌표가 화면에 있으면 이동하지 않는다!!!!!! 왜??
      if (item.map_level) {
        this.kakaomap.setLevel(item.map_level);
      } else {
        this.kakaomap.setLevel(3);
      }
      this.interestDialog = false;
      this.searchDialog = false;
      this.favoriteDialog = false;
      this.specialSearchDialog = false;
      this.createInterDialog = false;
    },
    moveToSpecial(item) {
      if (!item || item.y == undefined || item.x == undefined) {
        return;
      }
      var moveLatLon = new kakao.maps.LatLng(Number(item.y), Number(item.x));

      this.kakaomap.setCenter(moveLatLon); // panTo 는 해당 좌표가 화면에 있으면 이동하지 않는다!!!!!! 왜??
      if (item.map_level) {
        this.kakaomap.setLevel(item.map_level);
      } else {
        this.kakaomap.setLevel(3);
      }

      if (this.specialMarker) {
        this.specialMarker.setMap(null);
      }
      this.specialMarker = new kakao.maps.Marker({
        position: moveLatLon,
        title: "test",
        map: this.kakaomap,
        image: specialMarkerImage(),
      });
      this.interestDialog = false;
      this.searchDialog = false;
      this.favoriteDialog = false;
      this.specialSearchDialog = false;
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
    setStoreMarkers(stores) {
      this.storeMarkers.forEach((marker) => {
        marker.setMap(null);
      });
      this.storeMarkers = [];
      stores.forEach((store) => {
        // console.log(Number(store.lat), Number(store.lng));
        let marker = new kakao.maps.Marker({
          position: new kakao.maps.LatLng(Number(store.lat), Number(store.lng)),
          map: this.kakaomap,
          image: storeMarkerImage(),
        });

        storeMarkerInfoWindow(store, marker, this.kakaomap);
        this.storeMarkers.push(marker);
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
    async registerInterArea() {
      if (this.interAreaName.length >= 20 || this.interAreaName.length < 1) {
        this.$refs.interAreaName.focus();
        return;
      }
      const data = await InterAreaService.register({
        title: this.interAreaName,
        map_level: this.kakaomap.getLevel(),
        lat: this.kakaomap.getCenter().getLat(),
        lng: this.kakaomap.getCenter().getLng(),
      });

      if (data?.status == "success") {
        this.areaSave = true;
        this.createInterDialog = false;
      } else {
        alert("저장 실패");
      }
    },
    closeOveray() {
      this.deals = [];
      this.dealOverlay = false;
    },
  },
  watch: {
    storeLoad: function () {
      if (!this.storeLoad) {
        this.storeMarkers.forEach((marker) => {
          marker.setMap(null);
        });
        this.storeMarkers = [];
      }
    },
    specialSearchDialog: function () {
      if (this.specialSearchDialog) {
        this.favoriteDialog = false;
        this.searchDialog = false;
        this.createInterDialog = false;
        this.interestDialog = false;
        this.selectedTool = 4;
      } else {
        this.selectedTool = -1;
      }
    },
    interestDialog: function () {
      if (this.interestDialog) {
        this.favoriteDialog = false;
        this.searchDialog = false;
        this.createInterDialog = false;
        this.specialSearchDialog = false;
        this.selectedTool = 2;
      } else {
        this.selectedTool = -1;
      }
    },
    createInterDialog: function () {
      if (this.createInterDialog) {
        this.favoriteDialog = false;
        this.searchDialog = false;
        this.interestDialog = false;
        this.specialSearchDialog = false;
        this.selectedTool = 3;
      } else {
        this.selectedTool = -1;
      }
    },
    searchDialog: function () {
      // 검색창 닫으면 검색단어도 지운다
      if (this.searchDialog) {
        this.searchQuery = "";
        this.favoriteDialog = false;
        this.interestDialog = false;
        this.createInterDialog = false;
        this.specialSearchDialog = false;
        this.selectedTool = 0;
      } else {
        this.selectedTool = -1;
      }
    },
    favoriteDialog: function () {
      if (this.favoriteDialog) {
        this.searchDialog = false;
        this.interestDialog = false;
        this.createInterDialog = false;
        this.specialSearchDialog = false;
        this.selectedTool = 1;
      } else {
        this.selectedTool = -1;
      }
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
            // alert("금지된 요청");
            console.log(data);
          } else {
            console.log(data);
            // alert("불러오기 실패");
          }
        }

        if (this.storeLoad) {
          const storeData = await StoreService.getStores(this.boundary);
          if (storeData?.status == "success") {
            this.setStoreMarkers(storeData.result);
          } else {
            alert("서버 에러");
          }
        }
      } else if (mapLevel < 8) {
        // 동단위
        console.log("get aptcount dong");

        this.aptMarkers.forEach((marker) => {
          marker.setMap(null);
        });
        this.storeMarkers.forEach((marker) => {
          marker.setMap(null);
        });
        this.aptMarkers = [];
        this.storeMarkers = [];

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
  width: 100%;
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
  width: 350px;
  height: 180px;
  -webkit-border-radius: 3px;
  -moz-border-radius: 15px;
  border-radius: 15px;
  background-color: #000;
  background-color: hsla(0, 0%, 20%, 0.9);
  color: #fff;
  text-align: center;
  font-size: 14px;
  line-height: 1.2;
  z-index: 50;
}

.custom-overlay-title {
  height: 40px;
  font-size: 1.2em;
}

.custom-overlay-close-button {
  position: absolute;
  bottom: 10px;
  width: 40px;
  right: 10px;
  background-color: white;
  border-radius: 10px;
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
  height: 800px;
  max-height: 800px;
  overflow: auto;
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

.store-checkbox .v-label {
  font-size: 0.85em !important;
  /* background-color: red !important; */
}

.map-tool-list-group .v-list-item--active {
  /* color: #6d7491 !important; */
}

.store-overlay {
  position: absolute;
  bottom: 50px;
  margin-bottom: 5px;
  margin-left: -150px;
  padding: 7px;
  width: 350px;
  height: 120px;
  -webkit-border-radius: 3px;
  -moz-border-radius: 15px;
  border-radius: 15px;
  background-color: #000;
  background-color: hsla(0, 0%, 20%, 0.9);
  color: #fff;
  text-align: center;
  font-size: 14px;
  line-height: 1.2;
  z-index: 50;
}

.store-overlay-main {
  display: flex;
  flex-direction: column;
  text-align: center;
}

.store-overlay-content {
  /* background-color: red; */
}
</style>
