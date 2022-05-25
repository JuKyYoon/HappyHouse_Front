<template>
  <div>
    <Bar
      :chart-options="chartOptions"
      :chart-data="realChartData"
      :chart-id="chartId"
      :dataset-id-key="datasetIdKey"
      :plugins="plugins"
      :css-classes="cssClasses"
      :styles="styles"
      :width="width"
      :height="height"
      ref="bar"
    />
    <p style="display:none">{{ dataState }}</p>
  </div>
</template>

<script>
import { Bar } from "vue-chartjs/legacy";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

export default {
  name: "BarChart",
  components: {
    Bar,
  },
  props: {
    chartId: {
      type: String,
      default: "bar-chart",
    },
    datasetIdKey: {
      type: String,
      default: "label",
    },
    width: {
      type: Number,
      default: 400,
    },
    height: {
      type: Number,
      default: 400,
    },
    cssClasses: {
      default: "",
      type: String,
    },
    styles: {
      type: Object,
      default: () => {},
    },
    plugins: {
      type: Array,
      default: () => [],
    },
    chartData: Object,
    dataState: Boolean,
  },
  data() {
    return {
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
      },
    };
  },
  computed: {
    realChartData() {
      return this.chartData;
    },
  },
  created() {
    console.log(this.dataState);
  },
  updated() {
    // console.log("updated")
    console.log(this.$refs.bar.getCurrentChart());
    this.$refs.bar.getCurrentChart().data.datasets[0].data =
      this.chartData.datasets.data;
    this.$refs.bar.updateChart();
  },
  watch: {
    chartData: function () {
      console.log("test");
    },
  },
};
</script>
