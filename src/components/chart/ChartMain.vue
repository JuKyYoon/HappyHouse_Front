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
              <line-chart-vue
                :chartData="chartData[this.year].chartData2"
              ></line-chart-vue>
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
              {{ this.year }}년 아파트 평균 매매가
              <bar-chart-vue
                :chartData="chartData[this.year].chartData3"
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
import { sidoMenu, monthLabel } from "@/const/const";
import {
  dealCountEachSido,
  dealCountEachMonth,
  dealAvgMoneyEachSido,
} from "@/const/data/sido.js";
import LineChartVue from "./assets/LineChart.vue";
const sidoLabel = sidoMenu.map((s) => {
  return s.title;
});
export default {
  name: "ChartMain",
  components: {
    BarChartVue,
    LineChartVue
  },
  data() {
    return {
      year: 2021,
      years: [2021],
      chartData: {
        2021: {
          chartData1: {
            labels: sidoLabel,
            datasets: [
              {
                label: "아파트 매매횟수",
                backgroundColor: "#f87979",
                data: dealCountEachSido,
              },
            ],
          },
          chartData2: {
            labels: monthLabel,
            datasets: [
              {
                label: "월별 매매횟수",
                backgroundColor: "#f87979",
                data: dealCountEachMonth,
              },
            ],
          },
          chartData3: {
            labels: sidoLabel,
            datasets: [
              {
                label: "평균 매매가 (만원)",
                backgroundColor: "#f87979",
                data: dealAvgMoneyEachSido,
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
  beforeDestroy(){
    console.log("close")
  }
};
</script>

<style></style>

<!-- 차트
    왼쪽에 시/도 기준으로 볼 수있게 하기

    여기서는 전체적인거 -->
