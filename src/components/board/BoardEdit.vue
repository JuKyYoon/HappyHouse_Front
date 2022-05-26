<template>
  <div style="background-color:white">
    <tip-tap-vue :mode="true" :create="true" :type="type"></tip-tap-vue>
  </div>
</template>

<script>
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