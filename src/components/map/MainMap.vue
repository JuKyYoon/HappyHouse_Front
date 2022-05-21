<template>
  <div>
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

    <v-dialog v-model="searchDialog" width="700" content-class="map-search-bar">
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
            (item) => item.sidoName + ' ' + item.gugunName + ' ' + item.dongName
          "
          item-value="dongCode"
          return-object
          @change="moveToAddress"
        ></v-select>
      </v-card>
    </v-dialog>

    <div id="map"></div>
  </div>
</template>

<script>
import { AddressService } from "@/service/address.service.js";
import { HouseService } from "@/service/house.service.js";
import KakaoMapEvent from "@/util/kakaoMapEvent.js";
import { markerImage, markerInfoWindow } from "@/util/kakaoMapMarker.js";
import { mapState } from "vuex";
export default {
  name: "MainMap",
  components: {},
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
    };
  },
  computed: {
    ...mapState("mapStore", ["boundary"]),
  },
  mounted() {
    if (window.kakao && window.kakao.maps) {
      this.initMap();
    } else {
      const script = document.createElement("script");

      /* global kakao */
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
      })
      this.aptMarkers = [];
      houses.forEach((house) => {
        // console.log(Number(house.lat), Number(house.lng));
        let marker = new kakao.maps.Marker({
          position: new kakao.maps.LatLng(Number(house.lat), Number(house.lng)),
          title: house.aptName,
          map: this.kakaomap,
          image: markerImage()
        });

        markerInfoWindow(house, marker, this.kakaomap, this.getAptDeals);
        this.aptMarkers.push(marker);
      });
    },
    getAptDeals() {
      console.log("서버에서 가져오기", this)
    }
  },
  watch: {
    searchDialog: function () {
      // 검색창 닫으면 검색단어도 지운다
      this.searchQuery = "";
    },
    boundary: async function () {
      // 바운더리 바뀔 때 마다, 서버에서 아파트 정보 받아온다.
      // console.log(this.boundary);
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
    },
  },
};
</script>

<style scoped>
.test {
  background-color: red;
  width: 100%;
  height: 100%;
}

#map {
  height: 80vh;
}
</style>
