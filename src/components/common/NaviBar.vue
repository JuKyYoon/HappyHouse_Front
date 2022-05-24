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

    <v-app-bar
      elevation="0"
      fixed
      dense
      src="https://picsum.photos/1920/1080?random"
      fade-img-on-scroll
      shrink-on-scroll
      height="70"
    >
      <span class="d-flex d-sm-none appbar-component">
        <v-app-bar-nav-icon style="color: white" @click="sidebar = !sidebar">
        </v-app-bar-nav-icon>
      </span>

      <v-icon x-large color="white" class="appbar-component">mdi-home</v-icon>
      <span class="d-none d-sm-flex appbar-component">
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
      </span>

      <v-spacer></v-spacer>

      <span class="appbar-component" v-if="isLogin">
        <v-btn @click="logout">로그아웃</v-btn>
        
        <v-btn to="/user/info"><v-icon>mdi-account-circle</v-icon></v-btn>
      </span>
        <span class="appbar-component" v-else>
        <v-btn to="/user/signup">회원가입</v-btn>
        <v-btn to="/user/login">로그인</v-btn>
      </span>
    </v-app-bar>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
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
        { title: "Board", path: "/board", icon: "mdi-gavel" },
        { title: "QNA", path: "/qna", icon: "mdi-account-box" },
        // { title: "Calendar", path: "/about", icon: "mdi-gavel" },
        { title: "Map", path: "/map/main", icon: "mdi-gavel"},
        { title: "customMap", path: "/map/custom", icon: "mdi-gavel"}
      ],
    };
  },
  computed: {
    ...mapState("authStore", ['userid', 'isLogin'])
  },
  watch: {
    group() {
      this.drawer = false;
    },
  },
  methods: {
    ...mapActions("authStore", ["logout"]),
  },
  created() {
    // console.log(this.userid)
  }
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

.appbar-component {
  margin-top: auto;
  margin-bottom: auto;
}

.router-button {
  margin-right: 10px;
}
.router-button:hover {
  background-color: red !important;
}
.active-router {
  background-color: #0fffff !important;
  color: white !important;
}

/* header:hover {
  color: white !important;
} */
</style>
