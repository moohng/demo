<template>
  <div class="progress-bar">
    <div class="progress-bar-inner" :style="{ width: `${progress}%` }"></div>
  </div>
</template>

<script lang="ts" setup>
  defineProps({
    progress: {
      type: Number,
      default: 0,
    },
  });
</script>

<style lang="scss" scoped>
.progress-bar {
  width: 100%;
  height: 3px;
  background-color: #eee;
  position: relative;
}
.progress-bar-inner {
  width: 0;
  height: 100%;
  background-color: #007bff;
  transition: width 0.3s ease-out;
}
</style>
