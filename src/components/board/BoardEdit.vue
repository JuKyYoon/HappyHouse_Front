<template>
  <v-app>
    <tip-tap-vue :mode="true" :create="true" :type="type"></tip-tap-vue>
    <v-container>
    </v-container>
  </v-app>
</template>

<script>
import { mapMutations } from "vuex";
import TipTapVue from "../editor/TipTap.vue";

export default {
  name: "QnaEdit",
  props: ["type"],
  components: {
    TipTapVue,
  },
  data() {
    return {

    }
  },
  computed: {
  },
  methods: {

  },
  created() {
  },
  
}
</script>

<style scoped>
.ProseMirror.focus {
  background-color: red
}

</style>