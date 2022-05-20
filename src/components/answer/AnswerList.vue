<template>
  <div class="answer-list">
    <answer-module-vue :type="true" :create="true"></answer-module-vue>
    <answer-module-vue :type="false" :create="false" v-for="answer in answers" :key="answer.idx" :answer="answer"></answer-module-vue>
  </div>

</template>

<script>
import { mapState, mapActions } from "vuex";
import AnswerModuleVue from "./AnswerModule.vue";
export default {
  name: "AnswerList",
  components: {
    AnswerModuleVue
  },
  props: ['type'],
  computed: {
    ...mapState(['answers']),
    ...mapActions(['getAnswers'])
  },
  data() {
    return {

    }
  },
  async created() {
    const idx = this.$route.params.idx;
    if(idx != undefined) {
      await this.$store.dispatch("getAnswers", idx);
    }
  }
};
</script>

<style>
.answer-list {

}
</style>
