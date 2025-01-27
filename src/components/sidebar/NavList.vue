<template>
  <ul class="nav-list">
    <li 
      v-for="item in items" 
      :key="item.path"
      :class="{ active: currentPath === item.path }"
      @click="$emit('select', item.path)"
    >
      <div class="icon">{{ getIconText(item.title) }}</div>
      <div class="title">{{ item.title }}</div>
    </li>
  </ul>
</template>

<script lang="ts" setup>
interface NavItem {
  key: string;
  path: string;
  title: string;
}

defineProps<{
  items: NavItem[];
  currentPath: string;
}>();

defineEmits<{
  select: [path: string];
}>();

// 获取图标文字，如果是字母则大写
const getIconText = (title: string) => {
  const firstChar = title.charAt(0);
  return /[a-zA-Z]/.test(firstChar) ? firstChar.toUpperCase() : firstChar;
};
</script>

<style lang="scss" scoped>
.nav-list {
  flex: 1;
  margin: 0;
  padding: 0;
  list-style: none;
  overflow-y: auto;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-thumb {
    background-color: var(--scrollbar-color);
    border-radius: 3px;
  }
  
  li {
    display: flex;
    align-items: center;
    padding: 12px 20px;
    cursor: pointer;
    transition: all 0.2s ease;
    
    &:hover {
      background-color: var(--hover-color);
    }
    
    &.active {
      background-color: var(--active-color);
      
      .icon {
        background-color: var(--primary-color);
        color: white;
      }
      
      .title {
        color: var(--primary-color);
      }
    }
    
    .icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      margin-right: 12px;
      border-radius: 8px;
      background-color: var(--bg-color-gray);
      color: var(--text-color-gray);
      font-size: 16px;
      transition: all 0.2s ease;
    }
    
    .title {
      flex: 1;
      color: var(--text-color);
      font-size: 14px;
      transition: color 0.2s ease;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}

@media screen and (max-width: 768px) {
  .nav-item {
    padding: 14px 12px;
  }
}
</style> 