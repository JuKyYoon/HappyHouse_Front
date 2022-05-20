<template>
  <v-app id="app">
    <navi-bar />
    <!-- 현재 route에 맞는 component가 렌더링된다. -->

    <div class="main-content">
      <router-view />
    </div>
  </v-app>
</template>

<script>
import NaviBar from "@/components/common/NaviBar";
export default {
  name: "App",
  components: {
    NaviBar,
  },
};
</script>

<style>
/* .v-application--wrap {
  min-height: unset;
} */
.map-tool {
  z-index: 999999 !important;
  position: fixed;
  margin-top: 130px;
  margin-left: 50px;
  height: 200px !important;
}

.main-content {
  padding-top: 100px !important;

  background-color: skyblue;
  width: 100%;
  height: 100%;
}
</style>
