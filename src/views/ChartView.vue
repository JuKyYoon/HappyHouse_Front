<template>
  <div class="chart-view">
    <v-navigation-drawer
      id="app-drawer"
      v-model="drawer"
      dark
      floating
      :color="colors.menu_background_color"
      persistent
      width="200"
    >
      <div>
        <v-layout class="fill-height" tag="v-list" column>
          <v-list>
            <v-list-item @click="movePage({ id: 'main' })">
              <v-toolbar-title>시/도</v-toolbar-title>
            </v-list-item>
            <!-- <hr class="mt-2 mb-2" /> -->

            <v-list-item
              v-for="item in menus"
              :key="item.id"
              @click="movePage(item)"
            >
              {{ item.title }}
            </v-list-item>
            <!-- <hr class="mt-2 mb-2" /> -->
            <v-list-item-group active-class="white--text"> </v-list-item-group>
          </v-list>
        </v-layout>
      </div>
    </v-navigation-drawer>
    <div class="chart-main">
      <router-view :key="$route.path"></router-view>
    </div>
  </div>
</template>

<script>
import { sidoMenu } from "@/const/const.js";
export default {
  name: "ChartView",
  data: () => ({
    drawer: null,
    color: "success",
    menus: sidoMenu,
    colors: {
      menu_background_color: "red",
      menu_selected_color: "yellow",
    },
  }),
  mounted() {},
  methods: {
    movePage(target) {
      if (target.id == "main" && this.$route.path !== "/chart/main") {
        this.$router.push({ name: "ChartMain" });
        return;
      }
      else if (this.$route.path !== `/chart/${target.id}`) {
        this.$router.push({
          name: "ChartSub",
          params: { sido: target.id, sidoCode: target.code },
        });
      }
    },
  },
};
</script>

<style>
.chart-view {
  display: flex;
  flex-direction: row;
}
#app-drawer {
  width: 20%;
  background-color:blue;
}
.chart-main {
  background-color: white;
  width: 80%;
}
</style>
