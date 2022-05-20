<template>
  <div class="main-editor">
    <v-container>
      <div v-if="!create && editMode ">수정중</div>

      <v-text-field
        label="제목"
        hide-details="auto"
        :rules="[rules.required, rules.counter]"
        v-model.trim="question.title"
        ref="title"
        :readonly="!editMode"
      ></v-text-field>

      <v-text-field v-if="!create"
        label="작성자"
        hide-details="auto"
        :rules="[rules.required, rules.counter]"
        v-model.trim="question.userid"
        :readonly="!editMode"
      ></v-text-field>


    </v-container>

    <v-container >
      <editor-menu-bar
        v-if="editMode"
        :editor="editor"
        v-slot="{ commands, isActive }"
      >
        <div class="menubar">
          <button
            class="menubar__button"
            :class="{ 'is-active': isActive.bold() }"
            @click.prevent="commands.bold"
          >
            bold
          </button>
          <button
            class="menubar__button"
            :class="{ 'is-active': isActive.italic() }"
            @click.prevent="commands.italic"
          >
            italic
          </button>
          <button
            class="menubar__button"
            :class="{ 'is-active': isActive.strike() }"
            @click.prevent="commands.strike"
          >
            strikethrough
          </button>
          <button
            class="menubar__button"
            :class="{ 'is-active': isActive.underline() }"
            @click.prevent="commands.underline"
          >
            underline
          </button>
          <button
            class="menubar__button"
            :class="{ 'is-active': isActive.code() }"
            @click.prevent="commands.code"
          >
            code
          </button>
          <button
            class="menubar__button"
            :class="{ 'is-active': isActive.code_block() }"
            @click.prevent="commands.code_block"
          >
            file-code
          </button>
          <button
            class="menubar__button"
            :class="{ 'is-active': isActive.paragraph() }"
            @click.prevent="commands.paragraph"
          >
            paragraph
          </button>
          <button
            class="menubar__button"
            :class="{ 'is-active': isActive.heading({ level: 1 }) }"
            @click.prevent="commands.heading({ level: 1 })"
          >
            H1
          </button>
          <button
            class="menubar__button"
            :class="{ 'is-active': isActive.heading({ level: 2 }) }"
            @click.prevent="commands.heading({ level: 2 })"
          >
            H2
          </button>
          <button
            class="menubar__button"
            :class="{ 'is-active': isActive.heading({ level: 3 }) }"
            @click.prevent="commands.heading({ level: 3 })"
          >
            H3
          </button>
          <button
            class="menubar__button"
            :class="{ 'is-active': isActive.bullet_list() }"
            @click.prevent="commands.bullet_list"
          >
            list-ul
          </button>
          <button
            class="menubar__button"
            :class="{ 'is-active': isActive.ordered_list() }"
            @click.prevent="commands.ordered_list"
          >
            list-ol
          </button>
          <button
            class="menubar__button"
            :class="{ 'is-active': isActive.blockquote() }"
            @click.prevent="commands.blockquote"
          >
            quote-left
          </button>
          <button
            class="menubar__button"
            @click.prevent="commands.horizontal_rule"
          >
            구분선 추가
          </button>
          <button class="menubar__button" @click.prevent="commands.undo">
            undo
          </button>
          <button class="menubar__button" @click.prevent="commands.redo">
            redo
          </button>
        </div>
      </editor-menu-bar>
      <editor-content class="editor__content" :editor="editor" />
    </v-container>

    <v-container v-if="create">
      <v-btn @click="qnaSave">저장하기</v-btn>
      <v-btn @click="$router.push('/qna/list')">뒤로가기</v-btn>

    </v-container>

    <v-container v-else>
      <div v-if="editMode">
        <v-btn @click="updateQna">저장하기</v-btn>
        <v-btn @click="toggleEditMode">취소하기</v-btn>
      </div>
      <div v-else>
        <v-btn @click="toggleEditMode">수정하기</v-btn>
        <v-btn @click="deleteQna">삭제하기</v-btn>
      </div>
    </v-container>

        <v-container v-if="!create && !editMode">
      <v-btn v-if="question.solved == 1"
        color="green"
        @click="confirmSolve"
      >
        해결취소하기
      </v-btn>
      <v-btn v-else
        color="grey"
        @click="confirmSolve"
      >
        해결하기
      </v-btn>

      <v-snackbar
        v-model="doSolve"
        timeout="1000"
        bottom
        color="success"
        outlined
      >
        해결 되었습니다
        <template v-slot:action="{ attrs }">
          <v-btn
            color="green"
            text
            v-bind="attrs"
            @click="doSolve = false"
          >
            X
          </v-btn>
        </template>
      </v-snackbar>

      <v-snackbar
        v-model="cancelSolve"
        timeout="1000"
      >
        해결 취소
        <template v-slot:action="{ attrs }">
          <v-btn
            color="blue"
            text
            v-bind="attrs"
            @click="cancelSolve = false"
          >
            X
          </v-btn>
        </template>
      </v-snackbar>

       <v-snackbar
        v-model="solveState"
      >
        서버 오류
        <template v-slot:action="{ attrs }">
          <v-btn
            color="white"
            text
            v-bind="attrs"
            @click="solveState = false"
          >
            X
          </v-btn>
        </template>
      </v-snackbar>
    </v-container>
    
  </div>
</template>

<script>
import { Editor, EditorContent, EditorMenuBar } from "tiptap";
import {
  Blockquote,
  CodeBlock,
  HardBreak,
  Heading,
  HorizontalRule,
  OrderedList,
  BulletList,
  ListItem,
  TodoItem,
  TodoList,
  Bold,
  Code,
  Italic,
  Strike,
  Underline,
  History,
} from "tiptap-extensions";
import { QnaService } from "@/service/qna.service.js";
import { mapActions, mapMutations, mapState } from "vuex";

export default {
  components: { EditorContent, EditorMenuBar },

  props: [ "mode", "create"],
  data() {
    return {
      doSolve: false,
      cancelSolve: false,
      solveState: false,
      editMode: this.mode,
      editor: null,
      description: "",
      originQuestion : {},
      rules: {
        required: (value) => !!value || "Required.",
        counter: (value) => value.length <= 20 || "Max 20 characters",
      },
    };
  },
  computed: {
    ...mapActions(['getQuestion', 'deleteQuestion', 'updateQuestion']),
    ...mapState(['question']),
    ...mapMutations(['setQuestion', 'initQuestion', 'updateContent', 'updateSolved'])
  },
  async created() {
    const idx = this.$route.params.idx;
    if(this.create || idx == undefined ) {
      // create 일때는
      this.$store.commit("initQuestion", idx);
    }
    else if(idx!= undefined && this.question.idx != idx) {
      // idx가 일치하지 않으면. 서버에서 새롭게 불러온다.
      await this.$store.dispatch("getQuestion", idx);

      // 바로 동기화 불가능하므로, 함수 이용해서 처리해준다.
      this.editor.setContent(this.question.content)
    }
  },
  mounted() {
    this.editor = new Editor({
      editable: this.editMode,
      extensions: [
        new Blockquote(),
        new BulletList(),
        new CodeBlock(),
        new HardBreak(),
        new Heading({ levels: [1, 2, 3] }),
        new HorizontalRule(),
        new ListItem(),
        new OrderedList(),
        new TodoItem(),
        new TodoList(),
        new Bold(),
        new Code(),
        new Italic(),
        new Strike(),
        new Underline(),
        new History(),
      ],
      content: this.question.content
    });
  },
  beforeDestroy() {
    this.editor.destroy();
  },
  methods: {
    async qnaSave() {
      if (this.question.title.length == 0) {
        this.$refs.title.focus();
        return;
      } else if (this.question.title.length > 20) {
        this.$refs.title.focus();
        return;

      }
      const qnaContent = this.editor.getHTML();

      const data = await QnaService.createQna({
        title: this.question.title,
        userid: "ssafy",
        content: qnaContent,
      });

      if (data?.status == "success") {
        alert("등록 성공");
        console.log(data.result);
        this.$store.commit("setQuestion", data.result);
        this.$router.push({
          name: "QnaDetail",
          params: { idx: data.result.idx },
        });
      } else {
        alert("등록 실패");
      }
    },
    async updateQna() {
      if(confirm("수정 할거야?")) {
        this.$store.commit("updateContent", this.editor.getHTML());
        this.$store.dispatch("updateQuestion", this.question);
        this.editMode = !this.editMode;
        this.editor.setOptions({editable: false});

      } else {
        alert("취소")
      }
    },
    toggleEditMode() {
      this.editMode = !this.editMode

      if(!this.editMode) {
        // 원본 데이터 복원하기!
        this.$store.commit("setQuestion", this.originQuestion)
        this.editor.setContent(this.question.content)
        this.editor.setOptions({editable: false});

      } else {
        // 원본 데이터 백업
        this.originQuestion = Object.assign({}, this.question);
        this.editor.setOptions({editable: true});
      }
    },
    async deleteQna() {
      const idx = this.$route.params.idx;
      if(confirm("삭제 할거야?")) {
        this.$store.dispatch("deleteQuestion", idx);
      } else {
        alert("취소")
      }
    },
    async confirmSolve() {
      const idx = this.$route.params.idx;
      const data = await QnaService.toggleSolve(idx);
      if(data.status == "success") {
        this.$store.commit("updateSolved");
        if(this.question.solved) {
          this.doSolve = true;
        } else {
          this.cancelSolve = true;
        }
      } else {
        this.solveState = true;
      }
    },
    async undoSolve() {

    }
  },
};
</script>


<style>
.ProseMirror {
    border : 1px solid #dbdbdb;
    border-radius: 0.25rem;
    padding : 10px;
    transition: border-color ease-in-out 0.15s, box-shadow ease-in-out 0.15s;
}
.ProseMirror-focused {
    border-color : #80bdff;
    box-shadow: 0px 0px 0px 0.2rem rgb(0 123 255 / 25%);
}
.menubar__button {
  border : 1px solid black;
  border-radius: 0.2rem;
  margin : 5px;
  padding : 5px;

}
.is-active {
  color: white;
  background-color: black;
}

.main-editor {
  border : thin solid rgba(0, 0, 0, 0.12);
  box-shadow: 0px 2px 4px -1px rgb(0 0 0 / 20%), 0px 4px 5px 0px rgb(0 0 0 / 14%), 0px 1px 10px 0px rgb(0 0 0 / 12%);
}
</style>
