<template>
  <div>
    <div v-for="item in demoList" :key="item.id" :class="item.id">
      <a :href="item.path">{{ item.name }}</a>
    </div>
  </div>
</template>

<script lang="ts" setup>
const demoList = __DEMO_LIST__;
</script>

<style lang="scss" scoped>
</style>
