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
      color="#ebecf0"
      fade-img-on-scroll
      shrink-on-scroll
      height="70"
    >
      <span class="d-flex d-sm-none appbar-component">
        <v-app-bar-nav-icon style="color: black" @click="sidebar = !sidebar">
        </v-app-bar-nav-icon>
      </span>
      
      <v-icon x-large color="black" class="appbar-component home-button" @click="goHome" style="margin-right:10px">
        mdi-home
      </v-icon>
      
      <span class="d-none d-sm-flex appbar-component" v-if="isLogin">
        <v-btn
          depressed
          class="router-button"
          active-class="active-router"
          color="transparent"
          
          v-for="item in items"
          :key="item.title"
          :to="item.path"
        >
          <v-icon left dark size="20">{{ item.icon }}</v-icon>
          {{ item.title }}
        </v-btn>
      </span>
      <v-spacer></v-spacer>

      <span class="appbar-component" v-if="isLogin" >
        <v-btn text @click="logout">LogOut</v-btn>
        <v-btn text to="/user/info"><span v-if="admin" >Admin</span><v-icon>mdi-account-circle</v-icon></v-btn>
      </span>
        <span class="appbar-component" v-else>
        <v-btn text to="/user/signup">SIGN UP</v-btn>
        <v-btn text to="/user/login">SIGN IN</v-btn>
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
        { title: "Board", path: "/board", icon: "mdi-clipboard-text-outline" },
        { title: "QNA", path: "/qna", icon: "mdi-message-question" },
        // { title: "Calendar", path: "/about", icon: "mdi-gavel" },
        { title: "Map", path: "/map/main", icon: "mdi-map-legend"},
        { title: "Chart", path: "/chart/main", icon: "mdi-chart-bar"},
        // { title: "customMap", path: "/map/custom", icon: "mdi-gavel"}
      ],
    };
  },
  computed: {
    ...mapState("authStore", ['userid', 'isLogin', 'admin'])
  },
  watch: {
    group() {
      this.drawer = false;
    },
  },
  methods: {
    ...mapActions("authStore", ["logout"]),
    goHome() {
      if(this.$route.path !== "/") {
        this.$router.push("/")
      }
    }
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

.home-button:hover {
  color: #87909A   !important;
}

.router-button {
  margin-right: 10px;
  transition: all 0.2s ease-in-out;
}
.router-button:hover {
  background-color: #E7E6ED  !important;
}
.active-router {
  /* background-color: #0fffff !important; */
  /* color:  !important; */
}

/* header:hover {
  color: white !important;
} */
</style>
