<template>
  <v-app>
    <v-card>
      <v-card-title>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
        ></v-text-field>
      </v-card-title>
      <v-data-table
        :headers="headers"
        :items="board_list"
        :search="search"
        class="elevation-1"
        :loading="!dataState"
        loading-text="Loading... Please wait"
        @click:row="detailClick"
        @page-count="pageCount = $event"
        :page.sync="page"
        :items-per-page="itemsPerPage"
        hide-default-footer
      >
        <template v-slot:[`item.solved`]="{ item }">
          <v-chip
            class="ma-2"
            :color="getColor(item.solved)"
            text-color="white"
          >
            {{ item.solved == 1 ? "해결" : "해결 필요" }}
          </v-chip>
        </template>
      </v-data-table>
      <v-pagination v-model="page" :length="pageCount"></v-pagination>
    </v-card>
    <v-col class="text-right">
      <router-link to="write" style="text-decoration: none; color: inherit"
        ><v-btn>글쓰기</v-btn></router-link
      >
    </v-col>
  </v-app>
</template>

<script>
import { QnaService } from "@/service/qna.service.js";
import { BoardService } from "@/service/board.service.js";
export default {
  name: "BoardList",
  props: ["type"],
  async created() {
    if (this.type == "qna") {
      const result = await QnaService.getAllQna();
      this.dataState = true;
      this.board_list = result.result;
    } else {
      const result = await BoardService.getAllBoard();
      this.dataState = true;
      this.board_list = result.result
    }
  },
  methods: {
    getColor(solved) {
      if (solved == 1) return "green";
      else return "red";
    },
    detailClick(item) {
      if (this.type == "qna") {
        this.$router.push({ name: "QnaDetail", params: { idx: item.idx } });
      } else {
        this.$router.push({ name: "BoardDetail", params: { idx: item.idx } });
      }
    },
  },
  data() {
    return {
      page: 1,
      pageCount: 0,
      itemsPerPage: 10,
      dataState: false,
      search: "",
      board_list: [],
      headers: [
        {
          text: "글번호",
          sortable: true,
          value: "idx",
        },
        {
          text: "제목",
          sortable: true,
          value: "title",
        },
        {
          text: "작성자",
          sortable: true,
          value: "userid",
        },
        {
          text: "조회수",
          sortable: false,
          value: "view_count",
        },
        {
          text: "작성일",
          sortable: true,
          value: "create_date",
        },
        {
          text: "해결",
          sortable: true,
          value: "solved",
        },
      ],
    };
  },
};
</script>

<style></style>
