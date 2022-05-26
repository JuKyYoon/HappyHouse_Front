<template>
  <v-container class="comment-container">
    <!-- type이 true이면 수정 혹은 작성! -->
    <v-textarea
      v-if="create"
      auto-grow
      outlined
      rows="1"
      row-height="15"
      name="input-7-4"
      label="내용을 입력해주세요"
      v-model.trim="content"
      :rules="[rules.required, rules.counter]"
      ref="content"
    ></v-textarea>

    <v-textarea
      v-else
      auto-grow
      rows="1"
      row-height="15"
      outlined
      :filled="!editMode"
      name="input-7-4"
      :label="comment.userid"
      v-model.trim="content"
      :readonly="!editMode"
    ></v-textarea>

    <v-btn v-if="create" @click="createAComment"> 등록하기 </v-btn>

    <div v-if="!create && comment.userid == userid">

    <v-btn v-if="!create && !editMode" @click="toggleEditMode">수정하기</v-btn>
    <v-btn v-if="!create && !editMode" @click="deleteCom(comment.idx)">삭제하기</v-btn>

    <v-btn v-if="!create && editMode" @click="updateCom(comment.idx)">저장하기</v-btn>
    <v-btn v-if="!create && editMode" @click="toggleEditMode">취소하기</v-btn>
    </div>

    <div v-if="comment" style="display:flex; flex-direction:row; justify-content:end;">
      <span>{{comment.create_date}}</span>
    </div>

  </v-container>
</template>

<script>
import { CommentService } from "@/service/comment.service";
import { mapState } from "vuex";
export default {
  name: "CommentModule",
  computed: {
    ...mapState("authStore", ['userid'])
  },
  props: ["comment", "type", "create"],
  data() {
    return {
      content: this.create ? "" : this.comment.content,
      originalContent: "",
      editMode: this.type,
      rules: {
        required: (value) => !!value || "Required.",
        counter: (value) => value.length <= 200 || "Max 200 characters",
      },
    };
  },
  methods: {
    async createAComment() {
      if(this.content.length > 200 || this.content.length == 0) {
        this.$refs.content.focus();
        return;
      }

      const comment = {
        board_idx: this.$route.params.idx,
        content: this.content,
      };
      const data = await CommentService.createComment(comment);
      if (data.status == "success") {
        alert("댓글 등록 성공");
        this.$emit("pushComment", data.result)
        this.content = " ";
      } else {
        alert("댓글 등록 실패");
      }
    },
    async deleteCom(idx) {
      this.$emit("deleteComment", idx);
    },
    toggleEditMode() {
      this.editMode = !this.editMode;

      if(this.editMode) {
        // 백업
        this.originalContent = this.content
      } else {
        this.content = this.originalContent
      }
    },
    async updateCom(idx) {
      const com = {
        idx: idx,
        content: this.content
      }
      const result = await CommentService.updateComment(com);
      if(result?.status == "success") {
        this.originalContent = this.content;
        alert("업데이트 성공")
      } else {
        alert("업데이트 실패")
      }
      this.editMode = false;
    }
  },
};
</script>

<style>
.comment-container {
  background-color: white;
  border: thin solid rgba(0, 0, 0, 0.12);
  margin-bottom: 15px;
  box-shadow: 0px 2px 4px -1px rgba(2, 2, 3, 0.952),
    0px 4px 5px 0px rgba(75, 175, 61, 0.14),
    0px 1px 10px 0px rgba(165, 211, 127, 0.12);
}
</style>
