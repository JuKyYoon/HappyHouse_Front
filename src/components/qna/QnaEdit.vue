<template>
  <v-app>
    <tip-tap-vue :mode="true" :create="true"></tip-tap-vue>
    <v-container>
    </v-container>
  </v-app>
</template>

<script>
import { mapMutations } from "vuex";
import TipTapVue from "../editor/TipTap.vue";

export default {
  name: "QnaEdit",
  components: {
    TipTapVue,
  },
  data() {
    return {

    }
  },
  computed: {
    ...mapMutations(['setQuestion'])
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