<template>
  <v-container>
    <v-data-table
      dense
      :headers="headers"
      :items="areas"
      item-key="idx"
      class="elevation-1"
    >
      <template v-slot:[`item.move`]="{ item }">
        <span
          ><v-btn text color="blue" @click.prevent="areaClick(item)"
            >이동</v-btn
          ></span
        >
      </template>
      <template v-slot:[`item.delete`]="{ item }">
        <span
          ><v-btn text color="red" @click.prevent="deleteArea(item.idx)"
            >삭제</v-btn
          ></span
        >
      </template>
    </v-data-table>

    <v-snackbar
      v-model="deleteSuccess"
      timeout="3000"
      bottom
      color="success"
      outlined
    >
      삭제 했습니다
      <template v-slot:action="{ attrs }">
        <v-btn color="green" text v-bind="attrs" @click="deleteSuccess = false">
          X
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script>
import { InterAreaService } from "@/service/interArea.service";

export default {
  name: "InterestList",
  data() {
    return {
      deleteSuccess: false,
      areas: [],
      headers: [
        {
          text: "번호",
          align: "start",
          sortable: true,
          value: "idx",
        },
        {
          text: "제목",
          sortable: true,
          value: "title",
        },
        {
          text: "등록 날짜",
          sortable: true,
          value: "create_date",
        },
        {
          text: "이동",
          sortable: false,
          value: "move",
        },
        {
          text: "삭제",
          sortable: false,
          value: "delete",
        },
      ],
    };
  },
  methods: {
    async getAreas() {
      const data = await InterAreaService.getAreas();
      if (data?.status == "success") {
        this.areas = data.result;
        console.log(data.result);
      } else {
        alert("불러오기 실패");
      }
    },
    async deleteArea(idx) {
      var delIdx = this.areas.findIndex((i) => i.idx == idx);
      if (delIdx != -1) {
        const data = await InterAreaService.deleteAreas(idx);
        if (data?.status == "success") {
          this.deleteSuccess = true;
          this.areas.splice(delIdx, 1);
        } else {
          alert("실패");
        }
      }
    },
    areaClick(item) {
      // console.log(item.lat, item.lng, item.map_level)
      this.$emit("moveToAddress", item);
    },
  },
  async created() {
    await this.getAreas();
  },
};
</script>

<style></style>
