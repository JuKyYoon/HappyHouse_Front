<template>
  <div>
    <v-container>
      <v-select
        :items="years"
        label="2021"
        dense
        solo
        @change="yearChange"
      ></v-select>
    </v-container>

    <v-container fluid>
      <v-row dense>
        <v-col :cols="12"
          ><v-card>
            <v-card-text>
              {{ this.year }}년 아파트 매매횟수
              <bar-chart-vue
                :chartData="chartData[this.year].chartData1"
              ></bar-chart-vue>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>

              <v-btn icon>
                <v-icon>mdi-heart</v-icon>
              </v-btn>

              <v-btn icon>
                <v-icon>mdi-bookmark</v-icon>
              </v-btn>

              <v-btn icon>
                <v-icon>mdi-share-variant</v-icon>
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>

        <v-col :cols="6">
          <v-card>
            <v-card-text>
              {{ this.year }}년 월별 아파트 매매횟수
              <bar-chart-vue
                :chartData="chartData[this.year].chartData2"
              ></bar-chart-vue>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>

              <v-btn icon>
                <v-icon>mdi-heart</v-icon>
              </v-btn>

              <v-btn icon>
                <v-icon>mdi-bookmark</v-icon>
              </v-btn>

              <v-btn icon>
                <v-icon>mdi-share-variant</v-icon>
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import BarChartVue from "./assets/BarChart.vue";
import { sidoMenu } from "@/const/const";
import { dealCountEachSido, dealCountEachMonth } from "@/const/data/sido.js";

export default {
  name: "ChartMain",
  components: {
    BarChartVue,
  },
  mounted() {
    console.log();
  },
  data() {
    return {
      year: 2021,
      years: [2021],
      chartData: {
        2021: {
          chartData1: {
            labels: sidoMenu.map((s) => {
              return s.title;
            }),
            datasets: [
              {
                label: "아파트 매매횟수",
                backgroundColor: "#f87979",
                data: dealCountEachSido,
              },
            ],
          },
          chartData2: {
            labels: [
              "1월",
              "2월",
              "3월",
              "4월",
              "5월",
              "6월",
              "7월",
              "8월",
              "9월",
              "10월",
              "11월",
              "12월",
            ],
            datasets: [
              {
                label: "월별 매매횟수",
                backgroundColor: "#f87979",
                data: dealCountEachMonth,
              },
            ],
          },
        },
      },
      cards: [
        {
          title: "Pre-fab homes",
          src: "https://cdn.vuetifyjs.com/images/cards/house.jpg",
          flex: 12,
        },
        {
          title: "Favorite road trips",
          src: "https://cdn.vuetifyjs.com/images/cards/road.jpg",
          flex: 6,
        },
        {
          title: "Best airlines",
          src: "https://cdn.vuetifyjs.com/images/cards/plane.jpg",
          flex: 6,
        },
      ],
    };
  },
  methods: {
    yearChange(target) {
      this.year = target;
    },
  },
};
</script>

<style></style>

<!-- 차트
    왼쪽에 시/도 기준으로 볼 수있게 하기

    여기서는 전체적인거 -->
