<template>
  <v-container class="answer">
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
      :label="answer.userid"
      v-model="content"
      :readonly="!editMode"
    ></v-textarea>

    <v-btn v-if="create" @click="createAnswer"> 등록하기 </v-btn>

    <v-btn v-if="!create && !editMode" @click="toggleEditMode">수정하기</v-btn>
    <v-btn v-if="!create && !editMode" @click="deleteAns(answer.idx)">삭제하기</v-btn>

    <v-btn v-if="!create && editMode" @click="updateAns(answer.idx)">저장하기</v-btn>
    <v-btn v-if="!create && editMode" @click="toggleEditMode">취소하기</v-btn>
  </v-container>
</template>

<script>
import { AnswerService } from "@/service/answer.service";
import { mapActions, mapMutations } from "vuex";
export default {
  name: "AnswerModule",
  computed: {
    ...mapMutations(["addAnswers"]),
    ...mapActions(['deleteAnswer', 'updateAnswer'])
  },
  props: ["answer", "type", "create"],
  data() {
    return {
      content: this.create ? "" : this.answer.content,
      originalContent: "",
      editMode: this.type,
      rules: {
        required: (value) => !!value || "Required.",
        counter: (value) => value.length <= 200 || "Max 200 characters",
      },
    };
  },
  methods: {
    async createAnswer() {
      if(this.content.length > 200 || this.content.length == 0) {
        this.$refs.content.focus();
        return;
      }

      const answer = {
        question_no: this.$route.params.idx,
        content: this.content,
      };
      const data = await AnswerService.createAnswer(answer);
      if (data.status == "success") {
        alert("답변 등록 성공");
        this.$store.commit("addAnswers", data.result);
        this.content = " ";
      } else {
        alert("답변 등록 실패");
      }
    },
    async deleteAns(idx) {
      this.$store.dispatch("deleteAnswer", idx);
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
    async updateAns(idx) {
      const ans = {
        idx: idx,
        content: this.content
      }
      const result = await this.$store.dispatch("updateAnswer", ans);
      if(result) { this.originalContent = this.content; }
      this.editMode = false;
    }
  },
};
</script>

<style>
.answer {
  border: thin solid rgba(0, 0, 0, 0.12);
  margin-bottom: 15px;
  box-shadow: 0px 2px 4px -1px rgba(72, 184, 50, 0.2),
    0px 4px 5px 0px rgba(75, 175, 61, 0.14),
    0px 1px 10px 0px rgba(165, 211, 127, 0.12);
}
</style>
