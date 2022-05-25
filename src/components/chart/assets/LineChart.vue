<template>
  <div>
    <LineChartGenerator
      :chart-data="realChartData"
      :chart-id="chartId"
      :dataset-id-key="datasetIdKey"
      :plugins="plugins"
      :css-classes="cssClasses"
      :styles="styles"
      :width="width"
      :height="height"
      ref="line"
    />
    <p style="display:none">{{ dataState }}</p>
  </div>
</template>

<script>
import { Line as LineChartGenerator } from "vue-chartjs/legacy";

import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  LinearScale,
  CategoryScale,
  PointElement,
} from "chart.js";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  LinearScale,
  CategoryScale,
  PointElement
);

export default {
  name: "LineChart",
  components: {
    LineChartGenerator,
  },
  props: {
    chartId: {
      type: String,
      default: "line-chart",
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
  computed: {
    realChartData() {
      return this.chartData;
    },
  },
  data() {
    return {
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
      },
    };
  },
  methods: {
  },
  created() {
    // console.log("created")

  },
  updated() {
    console.log("updated", this.$refs.line.getCurrentChart().data.datasets[0].data)
    this.$refs.line.getCurrentChart().data.datasets[0].data = this.chartData.datasets.data;
    console.log("updated", this.$refs.line.getCurrentChart().data.datasets[0].data)
  
    this.$refs.line.updateChart();
  },
  mounted() {
    // console.log("mounted")

    // dataSet 바뀌면 다시 created?
    // console.log("Created: " ,this.chartData)

  },
  beforeDestroy() {
    // console.log("deddd")
  },
};
</script>
