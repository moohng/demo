<template>
  <div class="search-box">
    <i class="i-ri:search-line" />
    <input 
      type="text" 
      :value="modelValue"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      placeholder="搜索示例..." 
      @search="$emit('search')"
    >
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  modelValue: string;
}>();

defineEmits<{
  'update:modelValue': [value: string];
  'search': [];
}>();
</script>

<style lang="scss" scoped>
.search-box {
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  border-bottom: 1px solid var(--border-color);
  
  i {
    color: var(--text-color-gray);
    font-size: 1.2em;
  }
  
  input {
    flex: 1;
    padding: 8px;
    border: none;
    outline: none;
    background: none;
    font-size: 14px;
    color: var(--text-color);
    
    &::placeholder {
      color: var(--text-color-gray);
    }
  }
}

@media screen and (max-width: 768px) {
  .search-box {
    padding: 12px;
    
    input {
      font-size: 16px;  // 防止 iOS 缩放
    }
  }
}
</style> 