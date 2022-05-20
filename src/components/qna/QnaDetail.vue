<template>
  <v-app>
    <tip-tap-vue :mode="false"></tip-tap-vue>
    <br/>
    <answer-list-vue></answer-list-vue>
  </v-app>
</template>

<script>
import TipTapVue from "@/components/editor/TipTap.vue";
import AnswerListVue from "../answer/AnswerList.vue";

export default {
  name: "QnaDetail",
  components: {
    TipTapVue,
    AnswerListVue,
  },
  data() {
    return {
    }
  },
  computed: {
  },
  async created() {
  }
}
</script>

<style>

</style>