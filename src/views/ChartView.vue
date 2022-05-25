<template>
  <div class="chart-view">
    <v-navigation-drawer
      id="app-drawer"
      v-model="drawer"
      dark
      :color="colors.menu_background_color"
      sele
      persistent
      permanent
      mini-variant-width="200"
    >
      <div>
        <v-layout class="fill-height" tag="v-list" column>
          <v-list>
            <v-list-item-group active-class="#414557" v-model="selectedMenu">
              <v-list-item @click="movePage({ id: 'main' })">
                <v-toolbar-title>시/도</v-toolbar-title>
              </v-list-item>
              <hr class="mt-2 mb-2" />

              <v-list-item
                class="sido-list-item"
                v-for="item in menus"
                :key="item.id"
                @click="movePage(item)"
              >
                {{ item.title }}
              </v-list-item>
              <hr class="mt-2 mb-2" />
            </v-list-item-group>
          </v-list>
        </v-layout>
      </div>
    </v-navigation-drawer>
    <div class="chart-main">
      <router-view :key="$route.path"></router-view>
    </div>
    <v-fab-transition>
      <v-btn depressed large dark fixed bottom right @click="scrollToTop" fab>
        <v-icon>mdi-arrow-up-thick</v-icon>
      </v-btn>
    </v-fab-transition>
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
    selectedMenu: 0,
    colors: {
      menu_background_color: "#6d7491",
      menu_selected_color: "yellow",
    },
  }),
  mounted() {},
  methods: {
    movePage(target) {
      if (target.id == "main" && this.$route.path !== "/chart/main") {
        this.$router.push({ name: "ChartMain" });
        return;
      } else if (this.$route.path !== `/chart/${target.id}`) {
        this.$router.push({
          name: "ChartSub",
          params: {
            sido: target.id,
            sidoCode: target.code,
            sidoName: target.title,
          },
        });
      }
    },
    scrollToTop() {
      window.scrollTo(0, 0);
    },
  },
};
</script>

<style>
.chart-view {
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin-left:10px; 
  margin-right:10px;
}
#app-drawer {
  width: 20%;
  background-color: #6d7491;
  border-radius: 30px 0px 0px 30px;
}
.chart-main {
  background-color: white;
  width: 80%;
}

.sido-list-item {
  transition: all 0.1s ease-in-out;
}

.sido-list-item:hover {
  background-color: #e1e3e9;
  color: black !important;
}
</style>
