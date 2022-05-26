<template>
  <v-container>
    {{ aptCode }}
    <v-list>
      <v-list-item v-for="(item, i) in calData" :key="i">
        <v-card color="#6d7491" dark dense class="news-card">
          <v-card-title
            v-html="item.title"
            style="word-break: break-word"
            class="news-title"
          ></v-card-title>
          <v-card-subtitle>{{ item.pubDate | dateFormat }}</v-card-subtitle>

          <v-card-text v-html="item.description"> </v-card-text>

          <v-card-actions>
            <v-btn class="news-link-button"
              ><a
                :href="item.link"
                target="_blank"
                style="text-decoration: none; color: white"
                >전문보기</a
              ></v-btn
            >
          </v-card-actions>
        </v-card>
      </v-list-item>
    </v-list>

    <v-pagination
      v-model="curPageNum"
      :length="numOfPages"
      prev-icon="mdi-menu-left"
      next-icon="mdi-menu-right"
    ></v-pagination>
  </v-container>
</template>

<script>
import dayjs from "dayjs";
import { StoreService } from "@/service/store.service";
export default {
  name: "HouseNews",
  props: ["aptCode", "aptName"],
  data() {
    return {
      dataPerPage: 5,
      curPageNum: 1,
      news: [],
    };
  },
  async created() {
    const data = await StoreService.getNaverNews(this.aptName);
    if (data?.status == "success") {
      // console.log(data.result);
      this.news = data.result;
    } else {
      alert("에러");
    }
  },
  computed: {
    startOffset() {
      return (this.curPageNum - 1) * this.dataPerPage;
    },
    endOffset() {
      return this.startOffset + this.dataPerPage;
    },
    numOfPages() {
      return Math.ceil(this.news.length / this.dataPerPage);
    },
    calData() {
      return this.news.slice(this.startOffset, this.endOffset);
    },
  },
  destroyed() {
    console.log("dddddd");
  },
  updated() {
    console.log("a");
  },
  watch: {
    aptCode: async function () {
      const data = await StoreService.getNaverNews(this.aptName);
      if (data?.status == "success") {
        // console.log(data.result);
        this.news = data.result;
      } else {
        alert("에러");
      }
    },
  },
  filters: {
    dateFormat: function (value) {
      return dayjs(value).format("YYYY/MM/DD");
    },
  },
};
</script>

<style>
.news-link-button {
  position: absolute;
  bottom: 0;
  right: 0;
}
.news-title {
  font-size: 1rem;
}
.news-card {
  height: 100px;
  text-overflow: ellipsis;
  overflow: hidden;
  margin-bottom: 5px;
}
</style>
