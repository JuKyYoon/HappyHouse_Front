<template>
  <v-app>
    <tip-tap-vue :mode="false" :type="type"></tip-tap-vue>
    <br/>
    <!-- <answer-list-vue></answer-list-vue> -->
  </v-app>
</template>

<script>
import TipTapVue from "@/components/editor/TipTap.vue";

// QNA에서는 Answer, Board에서는 comment
import AnswerListVue from "../answer/AnswerList.vue"; 

export default {
  name: "QnaDetail",
  props: ["type"],
  components: {
    TipTapVue,
    // AnswerListVue,
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