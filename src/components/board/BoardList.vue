<template>
  <div>
    <v-card>
      <v-card-title>{{this.type == "qna" ? "Question" : "Board"}}</v-card-title>
    </v-card>
    <br/>
    <v-card>
      <v-card-title>
        <v-text-field
          v-model="search"
          prepend-icon="mdi-magnify"
          label="검색"
          single-line
          hide-details
        ></v-text-field>
      </v-card-title>
      <div style="margin-left: 10%; margin-right: 10%">
        <v-data-table
          :headers="typeHeaders"
          :items="board_list"
          :search="search"
          class="elevation-1"
          :loading="!dataState"
          :item-class="itemRowBackground"
          loading-text="Loading... Please wait"
          @click:row="detailClick"
          @page-count="pageCount = $event"
          :page.sync="page"
          :items-per-page="itemsPerPage"
          hide-default-footer
        >
          <template v-slot:[`item.create_date`]="{ item }">
            {{ dateFormat(item.create_date) }}
          </template>
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
      </div>

      <v-pagination v-model="page" :length="pageCount"></v-pagination>
    </v-card>
    <v-col class="text-right">
      <router-link to="write" style="text-decoration: none; color: inherit"
        ><v-btn>글쓰기</v-btn></router-link
      >
    </v-col>
  </div>
</template>

<script>
import dayjs from "dayjs";
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
      this.board_list = result.result;
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
    itemRowBackground: function (item) {
      return item.category == "공지" ? "notice" : "not-notice";
    },
    dateFormat(date) {
      if (date == undefined) {
        return "";
      }
      let diffDate = this.nowTime.diff(dayjs(date), "d");
      if (diffDate == 0) {
        return `${this.nowTime.diff(dayjs(date), "h")}시간 전`;
      } else {
        return dayjs(date).format("YYYY년 MM월 DD일");
      }
    },
  },
  computed: {
    typeHeaders() {
      if (this.type == "qna") {
        return this.qnaHeaders;
      } else {
        return this.boardHeaders;
      }
    },
  },
  data() {
    return {
      page: 1,
      nowTime: dayjs(),
      pageCount: 0,
      itemsPerPage: 10,
      dataState: false,
      search: "",
      board_list: [],
      qnaHeaders: [
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
          text: "해결",
          sortable: true,
          value: "solved",
        },

        {
          text: "작성일",
          sortable: true,
          value: "create_date",
        },
        {
          text: "조회수",
          sortable: false,
          value: "view_count",
        },
      ],
      boardHeaders: [
        {
          text: "글번호",
          sortable: false,
          value: "idx",
          divider: true,
        },
        {
          text: "카테고리",
          sortable: false,
          value: "category",
          divider: true,
        },
        {
          text: "제목",
          sortable: false,
          divider: true,
          value: "title",
        },
        {
          text: "작성자",
          sortable: false,
          divider: true,
          value: "userid",
        },
        {
          text: "작성일",
          divider: true,
          sortable: false,
          value: "create_date",
        },
      ],
    };
  },
};
</script>

<style>
.notice {
  background-color: #e1e3e9;
}

.notice:hover {
  background-color: #c4c7d3;
}
</style>
