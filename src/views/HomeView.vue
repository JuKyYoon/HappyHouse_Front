<template>
  <v-app>
    <template>
      <v-card :loading="loading" class="mx-auto my-12" max-width="374">
        <template slot="progress">
          <v-progress-linear
            color="green"
            height="10"
            indeterminate
          ></v-progress-linear>
        </template>

        <v-img
          height="250"
          src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?crop=entropy&cs=tinysrgb&fm=jpg&ixlib=rb-1.2.1&q=80&raw_url=true&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870"
        ></v-img>

        <v-card-title><v-spacer></v-spacer>Vue 연습중<v-spacer></v-spacer></v-card-title>

        <!-- <v-card-text>
          <v-row align="center" class="mx-0">
            <v-rating
              :value="4.5"
              color="amber"
              dense
              half-increments
              readonly
              size="14"
            ></v-rating>

            <div class="grey--text ms-4">4.5 (413)</div>
          </v-row>

          <div class="my-4 text-subtitle-1">$ • Italian, Cafe</div>

          <div>
            Small plates, salads & sandwiches - an intimate setting with 12
            indoor seats plus patio seating.
          </div>
        </v-card-text> -->

        <v-divider class="mx-4"></v-divider>

        <!-- <v-card-title>Tonight's availability</v-card-title> -->

        <v-card-text>
          <v-chip-group
            v-model="selection"
            active-class="green accent-4 white--text"
            center-active
          >
            <v-spacer></v-spacer>
            <v-chip>1</v-chip>

            <v-chip>2</v-chip>

            <v-chip>3</v-chip>

            <v-chip>4</v-chip>
            <v-spacer></v-spacer>
          </v-chip-group>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="black lighten-2" text @click="reserve">
           클릭해보세요
          </v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </template>
  </v-app>
</template>

<script>
export default {
  name: "HomeView",
  data: () => ({
    loading: false,
    selection: 1,
  }),

  methods: {
    reserve() {
      this.loading = true;
      setTimeout(() => {this.loading = false; this.$router.push("/qna/list")}, 800);
    },
  },
};
</script>
