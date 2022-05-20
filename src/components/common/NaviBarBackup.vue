<template>
  <div>
    <v-navigation-drawer v-model="sidebar" absolute temporary>
      <v-list nav dense>
        <v-list-item-group
          v-model="group"
          active-class="deep-purple--text text--accent-4"
        >
          <v-list-item
            v-for="(item, index) in items"
            :key="index"
            :to="item.path"
          >
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>

    <v-toolbar>
      <span class="d-flex d-sm-none">
        <v-app-bar-nav-icon @click="sidebar = !sidebar"> </v-app-bar-nav-icon>
      </span>
      <!-- <v-spacer></v-spacer> -->
      <v-toolbar-title class="text-no-wrap" style="margin-left: 30px">
        <router-link to="/" style="cursor: pointer">
          {{ appTitle }}
        </router-link>
      </v-toolbar-title>
      
      <!-- <v-spacer></v-spacer> -->
      
      <!-- <template v-slot:extension>
        <v-tabs centered class="d-none d-sm-flex justify-center">
          <v-spacer></v-spacer>
          <v-tab v-for="item in items" :key="item.title" :to="item.path">{{
            item.title
          }}</v-tab>
          <v-spacer></v-spacer>
        </v-tabs>
      </template> -->

      <!-- <v-btn icon>
        <v-icon>mdi-export</v-icon>
      </v-btn> -->

      <!-- <v-tabs class="d-none d-sm-flex justify-end">
        <v-tab v-for="item in items" :key="item.title" :to="item.path">{{item.title}}</v-tab>
      </v-tabs> -->
      <!-- <v-toolbar-items class="d-none d-sm-flex justify-end">
        <v-btn
          depressed
          class="router-button"
          active-class="active-router"
          v-for="item in items"
          :key="item.title"
          :to="item.path"
        >
          <v-icon left dark>{{ item.icon }}</v-icon>
          {{ item.title }}
        </v-btn>
      </v-toolbar-items> -->

      <v-row class="d-none d-sm-flex" align="center">
        <v-col v-for="(item, index) in items" :key="index" sm="6" cols="6"><v-btn depressed
          class="router-button"
          active-class="active-router" :to="item.path">{{ item.title }}</v-btn></v-col>
      </v-row>
    </v-toolbar>
  </div>
</template>

<script>
export default {
  name: "NavBar",
  data() {
    return {
      appTitle: "HappyHouse",
      sidebar: false,
      group: null,
      drawer: false,
      items: [
        { title: "Home", path: "/", icon: "mdi-view-dashboard" },
        { title: "QNA", path: "/qna", icon: "mdi-account-box" },
        { title: "Calendar", path: "/about", icon: "mdi-gavel" },
        { title: "Home", path: "/", icon: "mdi-view-dashboard" },
        { title: "QNA", path: "/qna", icon: "mdi-account-box" },
        { title: "Calendar", path: "/about", icon: "mdi-gavel" },
      ],
    };
  },
  watch: {
    group() {
      this.drawer = false;
    },
  },
};
</script>

<style scoped>
/* .ssafy_logo {
  width: 150px;
}
.header {
  text-align: center;
  box-shadow: 0px 1px 10px rgba(0, 0, 0, 0.3);
}
.header img {
  vertical-align: middle;
}
.logo {
  display: inline-block;
  font-size: 30pt;
  font-weight: bold;
} */
.router-button:hover {
  background-color: red !important;
}
.active-router {
  background-color: #0fffff !important;
  color: white !important;
}
</style>
