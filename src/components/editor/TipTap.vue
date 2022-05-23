<template>
  <div class="main-editor">
    <v-container>
      <div v-if="!create && editMode">수정중</div>

      <v-text-field
        label="제목"
        hide-details="auto"
        :rules="[rules.required, rules.counter]"
        v-model.trim="article.title"
        ref="title"
        :readonly="!editMode"
      ></v-text-field>

      <v-text-field
        v-if="!create"
        label="작성자"
        hide-details="auto"
        :rules="[rules.required, rules.counter]"
        v-model.trim="article.userid"
        :readonly="true"
      ></v-text-field>
    </v-container>

    <v-container>
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
      <v-btn @click="articleSave">저장하기</v-btn>
      <v-btn @click="moveBack">뒤로가기</v-btn>
    </v-container>

    <v-container v-else>
      <div v-if="myArticle">
        <div v-if="editMode">
          <v-btn @click="putArticle">저장하기</v-btn>
          <v-btn @click="toggleEditMode">취소하기</v-btn>
        </div>
        <div v-else>
          <v-btn @click="toggleEditMode">수정하기</v-btn>
          <v-btn @click="deleteNowArticle">삭제하기</v-btn>
        </div>
      </div>
    </v-container>

    <v-container v-if="!create && !editMode">
      <div v-if="type == 'qna' && myArticle">
        <v-btn v-if="article.solved == 1" color="green" @click="confirmSolve">
          해결취소하기
        </v-btn>
        <v-btn v-else color="grey" @click="confirmSolve"> 해결하기 </v-btn>
      </div>

      <v-snackbar
        v-model="doSolve"
        timeout="1000"
        bottom
        color="success"
        outlined
      >
        해결 되었습니다
        <template v-slot:action="{ attrs }">
          <v-btn color="green" text v-bind="attrs" @click="doSolve = false">
            X
          </v-btn>
        </template>
      </v-snackbar>

      <v-snackbar v-model="cancelSolve" timeout="1000">
        해결 취소
        <template v-slot:action="{ attrs }">
          <v-btn color="blue" text v-bind="attrs" @click="cancelSolve = false">
            X
          </v-btn>
        </template>
      </v-snackbar>

      <v-snackbar v-model="solveState">
        서버 오류
        <template v-slot:action="{ attrs }">
          <v-btn color="white" text v-bind="attrs" @click="solveState = false">
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
import { BoardService } from "@/service/board.service";
import { mapActions, mapMutations, mapState } from "vuex";

export default {
  components: { EditorContent, EditorMenuBar },

  props: ["mode", "create", "type"],
  data() {
    return {
      doSolve: false,
      cancelSolve: false,
      solveState: false,
      editMode: this.mode,
      editor: null,
      myArticle: false,
      description: "",
      originArticle: {},
      rules: {
        required: (value) => !!value || "Required.",
        counter: (value) => value.length <= 20 || "Max 20 characters",
      },
    };
  },
  computed: {
    ...mapState("articleStore", ["article"]),
    ...mapState("authStore", ["userid"]),
  },
  async created() {
    const idx = this.$route.params.idx;
    if (this.create || idx == undefined) {
      // create 일때는
      this.initArticle(idx);
    } else {
      await this.getArticle({ idx: idx, type: this.type });
      if(this.article.userid == this.userid) {
        this.myArticle = true;
      }
      this.editor.setContent(this.article.content);
    }

    // else if (idx != undefined && this.article.idx != idx) {
    //   // idx가 일치하지 않으면. 서버에서 새롭게 불러온다.
    //   await this.getArticle(idx);

    //   // 바로 동기화 불가능하므로, 함수 이용해서 처리해준다.
    //   this.editor.setContent(this.article.content);
    // }
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
      content: this.article.content,
    });
  },
  beforeDestroy() {
    this.editor.destroy();
  },
  methods: {
    ...mapMutations("articleStore", [
      "setArticle",
      "initArticle",
      "updateContent",
      "updateSolved",
    ]),
    ...mapActions("articleStore", [
      "getArticle",
      "deleteArticle",
      "updateArticle",
    ]),

    moveBack() {
      if (this.type == "qna") {
        this.$router.push("/qna/list");
      } else {
        this.$router.push("/board/list");
      }
    },

    async articleSave() {
      if (this.article.title.length == 0) {
        this.$refs.title.focus();
        return;
      } else if (this.article.title.length > 20) {
        this.$refs.title.focus();
        return;
      }
      const articleContent = this.editor.getHTML();
      let data = null;
      if (this.type == "qna") {
        data = await QnaService.createQna({
          title: this.article.title,
          content: articleContent,
        });
      } else {
        data = await BoardService.createBoard({
          title: this.article.title,
          category: "자유",
          content: articleContent,
        });
      }

      if (data?.status == "success") {
        alert("등록 성공");
        console.log(data.result);
        this.setArticle(data.result);
        if (this.type == "qna") {
          this.$router.push({
            name: "QnaDetail",
            params: { idx: data.result.idx },
          });
        } else {
          this.$router.push({
            name: "BoardDetail",
            params: { idx: data.result.idx },
          });
        }
      } else {
        alert("등록 실패");
      }
    },

    async putArticle() {
      if (confirm("수정 할거야?")) {
        this.updateContent(this.editor.getHTML()); // content 만 업데이트 ( title은 v-model 되어있음)
        this.updateArticle({
          article: {
            idx: this.article.idx,
            title: this.article.title,
            content: this.article.content,
          },
          type: this.type,
        }); // 서버에 업데이트 반영
        this.editMode = !this.editMode;
        this.editor.setOptions({ editable: false });
      } else {
        alert("취소");
      }
    },
    toggleEditMode() {
      this.editMode = !this.editMode;

      if (!this.editMode) {
        // 원본 데이터 복원하기!
        this.setArticle(this.originArticle);
        this.editor.setContent(this.article.content);
        this.editor.setOptions({ editable: false });
      } else {
        // 원본 데이터 백업
        this.originArticle = Object.assign({}, this.article);
        this.editor.setOptions({ editable: true });
      }
    },
    async deleteNowArticle() {
      const idx = this.$route.params.idx;
      if (confirm("삭제 할거야?")) {
        this.deleteArticle({ idx: idx, type: this.type });
      } else {
        alert("취소");
      }
    },
    async confirmSolve() {
      const idx = this.$route.params.idx;
      const data = await QnaService.toggleSolve(idx);
      if (data.status == "success") {
        this.updateSolved();
        if (this.article.solved) {
          this.doSolve = true;
        } else {
          this.cancelSolve = true;
        }
      } else {
        this.solveState = true;
      }
    },
    async undoSolve() {},
  },
};
</script>

<style>
.ProseMirror {
  border: 1px solid #dbdbdb;
  border-radius: 0.25rem;
  padding: 10px;
  transition: border-color ease-in-out 0.15s, box-shadow ease-in-out 0.15s;
}
.ProseMirror-focused {
  border-color: #80bdff;
  box-shadow: 0px 0px 0px 0.2rem rgb(0 123 255 / 25%);
}
.menubar__button {
  border: 1px solid black;
  border-radius: 0.2rem;
  margin: 5px;
  padding: 5px;
}
.is-active {
  color: white;
  background-color: black;
}

.main-editor {
  border: thin solid rgba(0, 0, 0, 0.12);
  box-shadow: 0px 2px 4px -1px rgb(0 0 0 / 20%),
    0px 4px 5px 0px rgb(0 0 0 / 14%), 0px 1px 10px 0px rgb(0 0 0 / 12%);
}
</style>
