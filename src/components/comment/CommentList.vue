<template>
  <div>
    <comment-module-vue
      :type="true"
      :create="true"
      @pushComment="pushComment"
    ></comment-module-vue>
    <comment-module-vue
      :type="false"
      :create="false"
      v-for="comment in comments"
      :key="comment.idx"
      :comment="comment"
      @deleteComment="deleteComment"
    ></comment-module-vue>
  </div>
</template>

<script>
import { CommentService } from "@/service/comment.service";
import CommentModuleVue from "./CommentModule.vue";

export default {
  name: "CommentList",
  components: {
    CommentModuleVue,
  },
  props: ["type"],
  computed: {},
  methods: {
    async deleteComment(idx) {
      const data = await CommentService.deleteComment(idx);
      if (data?.status == "success") {
        alert("삭제 성공");
        var delIdx = this.comments.findIndex((i) => i.idx == idx);
        if (delIdx != -1) {
          this.comments.splice(delIdx, 1);
        }
      } else {
        alert("삭제 실패");
      }
    },
    async pushComment(comment) {
      this.comments.push(comment);
    },
  },
  data() {
    return {
      comments: [],
    };
  },
  async created() {
    const idx = this.$route.params.idx;
    if (idx != undefined) {
      const data = await CommentService.getComments(idx);
      if (data?.status == "success") {
        this.comments = data.result;
      } else {
        alert("서버 에러");
      }
    }
  },
};
</script>

<style>

</style>
