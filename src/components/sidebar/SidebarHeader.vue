<template>
  <header class="header">
    <div class="logo" @click="$emit('home')">
      <img src="@/assets/icon/favicon.png" alt="logo" class="w-8 h-8 mr-2">
      <h1>Demo 大杂烩</h1>
    </div>
    <div class="fold-btn" @click="$emit('toggle')">
      <i class="i-ri:menu-fold-line" />
    </div>
  </header>
</template>

<script lang="ts" setup>
defineProps<{
  fold: boolean;
}>();

defineEmits<{
  toggle: [];
  home: [];
}>();
</script>

<style lang="scss" scoped>
.header {
  height: var(--header-height);
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--border-color);
  background-color: var(--bg-color);
  
  .logo {
    display: flex;
    align-items: center;
    cursor: pointer;
    font-size: 1.2em;
    
    h1 {
      margin: 0;
      font-size: inherit;
      font-weight: 600;
    }
    
    &:hover {
      opacity: 0.8;
    }
  }
}

.fold-btn {
  padding: 8px;
  cursor: pointer;
  font-size: 1.2em;
  color: var(--text-color-gray);
  transition: all 0.2s ease;
  border-radius: 4px;
  
  &:hover {
    color: var(--primary-color);
    background-color: var(--bg-color-hover);
  }
}

@media screen and (max-width: 768px) {
  .header .logo h1 {
    display: none;
  }
}
</style> 