<template>
  <div>
    <div>
      <v-dialog
      v-model="loadingDialog"
      persistent
      width="300"
    >
      <v-card
        color="primary"
        dark
      >
        <v-card-text>
          불러오는 중
          <v-progress-linear
            indeterminate
            color="white"
            class="mb-0"
          ></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>

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
                  :dataState="dataState"
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
                  :dataState="dataState"
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
          
          <v-col :cols="12"
            ><v-card>
              <v-card-text>
                {{ this.year }}년 아파트 지역별 평균가
                <bar-chart-vue
                  :chartData="chartData[this.year].chartData3"
                  :dataState="dataState"
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
  </div>
</template>

<script>
import { ChartService } from "@/service/chart.service";
import LineChartVue from "./assets/LineChart.vue";
import BarChartVue from "./assets/BarChart.vue";
export default {
  name: "ChartSub",
  props: ["sidoCode", "sidoName"],
  components: {
    BarChartVue,
    LineChartVue
  },
  data() {
    return {
      year: 2021,
      loadingDialog: true,
      dataState: false,
      years: [2021],
      path: this.$route.params.sido,
      chartData: {
        2021: {
          chartData1: {
            labels: [],
            datasets: [
              {
                label: "구별 아파트 매매횟수",
                backgroundColor: "#f87979",
                data: [],
              },
            ],
          },
          chartData2: {
            labels: [],
            datasets: [
              {
                label: "월별 아파트 매매횟수",
                backgroundColor: "#f87979",
                data: [],
              },
            ],
          },
          chartData3: {
            labels: [],
            datasets: [
              {
                label: "구별 아파트 평균가",
                backgroundColor: "#f87979",
                data: [],
              },
            ],
          },
        },
      },
    };
  },
  async created() {
    if (this.sidoName == undefined) {
      this.$router.push("/chart/main");
      return ;
    }
    const data = await ChartService.getCharts(this.sidoName.trim());
    if (data?.status == "success") {
      console.log(data.result);
      this.chartData['2021'].chartData2.datasets.data = data.result.countByMonth.map(d=>d.value)
      this.chartData['2021'].chartData2.labels = data.result.countByMonth.map(d=>d.label)

      this.chartData['2021'].chartData1.datasets.data = data.result.countByGu.map(d=>d.value)
      this.chartData['2021'].chartData1.labels = data.result.countByGu.map(d=>d.label)

      this.chartData['2021'].chartData3.datasets.data = data.result.getAvgByGu.map(d=>d.value)
      this.chartData['2021'].chartData3.labels = data.result.getAvgByGu.map(d=>d.label)

      console.log('data 변경')
      this.dataState=true;
      this.loadingDialog = false;
    } else {
      alert("서버 오류");
    }
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

<!-- 

    시도 단위 페이지 {{ path }}
    <br />

    구 별 , 매매횟수

    <br />
    구 별 , 월별 매매횟수
    <br />

    구 별 평균 매매가

    <br />

    아파트 최고가부터 50개 나열

    {{ sidoCode }}


 -->
