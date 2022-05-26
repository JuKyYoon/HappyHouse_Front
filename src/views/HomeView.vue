<template>
  <div class="home-div">
    <div style="margin: 50px"></div>
    <v-container class="d-flex justify-center mb-6" flat tile>
      <div
        style="display: flex; justify-content: center; flex-direction: column"
      >
        <h1 class="main-title">HAPPY HOUSE</h1>

        <v-img
          v-if="!isLogin"
          id="main-img"
          class="effect"
          height="563"
          width="1000"
          max-width="1000"
          :src="require('@/assets/main-img.png')"
        >
          <div class="div-inimg">
            <v-btn
              class="start-button"
              color="#414557"
              x-large
              dark
              max-width="400"
              width="400"
              to="/user/login"
              >로그인</v-btn
            >
          </div>
        </v-img>
      </div>
    </v-container>

    <div class="home-content" v-if="isLogin">
      <div class="home-content-div" v-for="item in items" :key="item.title">
        <v-hover v-slot="{ hover }">
          <v-card
            class="mx-auto"
            color="grey lighten-4"
            max-width="600"
            @click="goPath(item.path)"
          >
            <v-img
              :aspect-ratio="16 / 9"
              :src="item.src"
              gradient="to bottom left, rgba(0,0,0,.1), rgba(0,0,0,.4)"
            >
              <v-expand-transition>
                <div
                  v-if="hover"
                  class="d-flex transition-fast-in-fast-out v-card--reveal text-h2 white--text"
                  style="height: 27%; background-color: #6d7491"
                >
                  <span style="font-size: 1.5rem">{{ item.tooltip }}</span>
                </div>
              </v-expand-transition>
            </v-img>
            <v-card-text class="pt-6" style="position: relative">
              <!-- <div class="font-weight-light grey--text text-h6 mb-2">
                {{ item.title }}
              </div> -->
              <h3
                class="mb-2"
                style="color: #2b2e3a; font-weight: 700; font-size: 1.4rem"
              >
                {{ item.title }}
              </h3>
              <!-- <div class="font-weight-light text-h6 mb-2">
                {{item.content}}
              </div> -->
            </v-card-text>
          </v-card>
        </v-hover>
      </div>
    </div>
    <div class="main-background">
<!-- <svg height="auto" width="1920">
      <path
        id="lineAB"
        d="M297,181.284c0-24.795-20.174-44.968-44.969-44.968c-24.795,0-44.968,20.173-44.968,44.968
	c0,21.195,14.745,39,34.511,43.728v49.347H26.144c-2.834,0-5.229-2.396-5.229-5.229v-20.393c0-2.834,2.395-5.229,5.229-5.229
	h123.925c14.416,0,26.145-11.729,26.145-26.145v-20.393c0-14.416-11.729-26.144-26.145-26.144H77.909
	c-2.834,0-5.229-2.396-5.229-5.229v-20.393c0-2.834,2.395-5.229,5.229-5.229h41.257c5.775,0,10.458-4.683,10.458-10.458V79.904
	c16.882-4.605,29.333-20.065,29.333-38.387c0-21.941-17.851-39.791-39.792-39.791c-21.94,0-39.791,17.851-39.791,39.791
	c0,18.322,12.452,33.782,29.335,38.388v39.156h-30.8c-14.416,0-26.144,11.728-26.144,26.144v20.393
	c0,14.416,11.728,26.145,26.144,26.145h72.159c2.834,0,5.229,2.395,5.229,5.229v20.393c0,2.834-2.396,5.23-5.229,5.23H26.144
	C11.727,222.593,0,234.32,0,248.736v20.393c0,14.416,11.727,26.145,26.144,26.145h225.889c5.775,0,10.458-4.683,10.458-10.458
	v-59.804C282.257,220.283,297,202.479,297,181.284z M100.289,41.518c0-10.408,8.468-18.876,18.876-18.876
	c10.409,0,18.876,8.468,18.876,18.876c0,10.409-8.467,18.876-18.876,18.876C108.757,60.394,100.289,51.927,100.289,41.518z
	M252.031,205.337c-13.263,0-24.053-10.789-24.053-24.053c0-13.263,10.79-24.053,24.053-24.053c13.264,0,24.053,10.79,24.053,24.053
	C276.084,194.548,265.295,205.337,252.031,205.337z"
        stroke="gray"
        stroke-width="20"
        fill="none"
      />

      Sorry, your browser does not support inline SVG...
    </svg> -->
    </div>
    
  </div>
</template>

<script>
import { mapState } from "vuex";
import chartjpg from "@/assets/chart.jpg";
import mapjpg from "@/assets/map.jpg";
import "animate.css";
export default {
  name: "HomeView",
  data() {
    return {
      items: [
        {
          title: "지도",
          text: "Search Your House",
          src: mapjpg,
          tooltip: "아파트 찾아보기",
          path: "/map/main",
        },
        {
          title: "공지사항",
          text: "공지사항",
          src: "https://images.unsplash.com/photo-1586281380117-5a60ae2050cc?crop=entropy&cs=tinysrgb&fm=jpg&ixlib=rb-1.2.1&q=80&raw_url=true&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740",
          tooltip: "공지사항 보기",
          path: "/board/list",
        },
        {
          title: "통계",
          text: "통계자료",
          src: chartjpg,
          tooltip: "아파트 통계보기",
          path: "/chart/main",
        },
      ],
    };
  },
  computed: {
    ...mapState("authStore", ["isLogin"]),
  },
  methods: {
    reserve() {
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
        this.$router.push("/qna/list");
      }, 800);
    },
    goPath(path) {
      this.$router.push(path);
    },
  },
};
</script>
<style scoped>
#main-img {
  transition: all 0.1s linear;
}
#main-img:hover {
  /* opacity: 0.7; */
}
.home-div {
}
.div-inimg {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.div-inimg {
  /* padding-left: auto; */
  /* padding-right:auto; */
  width: 100%;
  height: 100%;
}
.start-span {
  /* margin-left:auto; */
  /* margin-right:auto; */
}
.start-button {
  margin: auto;
}

.main-title {
  display: inline-block;
  font-size: 5em;
  /* font-family: ; */
  /* margin: 0 0.5rem; */
  text-align: center;

  animation: bounceInDown; /* referring directly to the animation's @keyframe declaration */
  animation-duration: 1.5s; /* don't forget to set a duration! */
}

.home-content {
  display: flex;
  flex-direction: row;
  justify-content: center;
  /* background-color: red; */
  /* height: 500px; */

  /* width: 100%; */
}

.home-content-div {
  /* border: 3px solid black; */
  width: 25%;
  margin: 30px;
}

.v-card--reveal {
  align-items: center;
  bottom: 0;
  justify-content: center;
  opacity: 0.9;
  position: absolute;
  width: 100%;
}

.main-background {
  position: absolute;
  top: 0;
  width: 100%;
  background-color: red;
  z-index: -1;
}

svg path {
  stroke-width: 20;
  stroke-dasharray: 920;
  stroke-dashoffset: 920;
  animation-name: draw;
  animation-duration: 3s;
  animation-iteration-count: 155;
  animation-fill-mode: forwards;
  animation-timing-function: linear;

}

@keyframes draw {
  to {
    stroke-dashoffset: 0;
  }
}
</style>
