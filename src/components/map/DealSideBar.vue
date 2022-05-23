<template>
  <v-card class="mx-auto map-right-side">
    <v-navigation-drawer class="deep-purple accent-4" dark permanent>
      <v-list>
        <v-list-item v-for="deal in deals" :key="deal.no" link>
          <!-- <v-list-item-icon>
            <v-icon>{{ deal.no }}</v-icon>
          </v-list-item-icon> -->

          <v-list-item-content>
            <v-list-item-title>{{ deal.money }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>

      <template v-slot:append>
        <div class="pa-2">
          <v-btn v-on:click="closeOveray"> CLOSE </v-btn>
        </div>
      </template>
    </v-navigation-drawer>
  </v-card>
</template>

<script>
export default {
  name: "DealSideBar",
  props: ["deals"],
  methods: {
    closeOveray() {
      this.$emit("closeOveray")
    }
  }
};
</script>

<style></style>
