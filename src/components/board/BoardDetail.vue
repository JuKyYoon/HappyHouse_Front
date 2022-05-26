<template>
  <div style="background-color:#ebecf0">
    <tip-tap-vue :mode="false" :type="type"></tip-tap-vue>
    <div style="margin:30px"/>
    <answer-list-vue v-if="type=='qna'"></answer-list-vue>
    <comment-list-vue v-else></comment-list-vue>
  </div>
</template>

<script>
import TipTapVue from "@/components/editor/TipTap.vue";

// QNA에서는 Answer, Board에서는 comment
import AnswerListVue from "../answer/AnswerList.vue"; 
import CommentListVue from "../comment/CommentList.vue";

export default {
  name: "QnaDetail",
  props: ["type"],
  components: {
    TipTapVue,
    AnswerListVue,
    CommentListVue
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