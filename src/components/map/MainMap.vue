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
import { mapState } from "vuex";
export default {
  name: "MainMap",
  components: {},
  data() {
    return {
      searchDialog: true,
      searchQuery: "서울 강남",
      dialog: true,
      drawer: false,
      overlay: true,
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
      addressList: [],
      search: "",
      mini: true,
      kakaomap: null,
      houses: [],
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
  },
  watch: {
    searchDialog: function () {
      this.searchQuery = "";
    },
    boundary: async function () {
      // console.log(this.boundary);
      const data = await HouseService.getHouses(this.boundary);
      if (data?.status == "success") {
        console.log(data);
        this.houses = data.result;
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
