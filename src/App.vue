<template>
  <div>
    <div v-for="item in demoList" :key="item.id" :class="item.id">
      <a :href="item.path">{{ item.name }}</a>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
const demoList = ref(__DEMO_LIST__ as unknown as any[]);
</script>

<style lang="scss" scoped>
</style>
