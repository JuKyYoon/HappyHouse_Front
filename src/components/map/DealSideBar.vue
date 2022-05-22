<template>
  <div>이거보여야함

    <ul>
      <li v-for="(item, index) in deals" :key="index">
        {{item.money}}
      </li>
    </ul>

  </div>
  
</template>

<script>
export default {
  name: "DealSideBar",
  props: ["deals"]
};
</script>

<style></style>
