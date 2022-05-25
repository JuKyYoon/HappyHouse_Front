<template>
  <div class="home-div">
    <div style="margin: 50px"></div>
    <v-container class="d-flex justify-center mb-6" flat tile>
      <v-img
        id="main-img"
        height="563"
        width="1000"
        max-width="1000"
      >
        <div class="div-inimg">
          <v-btn
            class="start-button"
            color="#a4a8ba"
            x-large
            dark
            max-width="400"
            width="400"
            >시작</v-btn
          >
        </div>
      </v-img>
    </v-container>
  </div>
</template>

<script>
export default {
  name: "HomeView",
  data() {
    return {};
  },
  methods: {
    reserve() {
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
        this.$router.push("/qna/list");
      }, 800);
    },
  },
};
</script>
<style>
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
</style>
