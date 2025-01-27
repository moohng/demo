<template>
  <aside class="aside" :class="{ fold }">
    <SidebarHeader 
      :fold="fold" 
      @toggle="$emit('update:fold', !fold)"
      @home="$emit('navigate', '/demos/home/')"
    />
    <SearchBox
      v-model="searchText"
      @search="handleSearch"
    />
    <NavList
      :items="filteredDemoList"
      :current-path="currentPath"
      @select="(path: string) => $emit('navigate', path)"
    />
    <SidebarFooter />
  </aside>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import SidebarHeader from './sidebar/SidebarHeader.vue';
import SearchBox from './sidebar/SearchBox.vue';
import NavList from './sidebar/NavList.vue';
import SidebarFooter from './sidebar/SidebarFooter.vue';

const props = defineProps<{
  fold: boolean;
  demoList: any[];
  currentPath: string;
}>();

const emit = defineEmits<{
  'update:fold': [value: boolean];
  'navigate': [path: string];
}>();

const searchText = ref('');

// 搜索过滤
const filteredDemoList = computed(() => {
  if (!searchText.value) return props.demoList;
  const searchLower = searchText.value.toLowerCase();
  return props.demoList.filter(item => 
    item.title.toLowerCase().includes(searchLower) || 
    item.description?.toLowerCase().includes(searchLower)
  );
});

const handleSearch = () => {
  // 可以添加防抖处理
};
</script>

<style lang="scss" scoped>
.aside {
  position: fixed;
  top: 0;
  left: 0;
  width: var(--aside-width);
  height: 100vh;
  background-color: var(--bg-color);
  border-right: 1px solid var(--border-color);
  z-index: 99;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  transform: translateX(0); /* PC端默认不位移 */
  
  &.fold {
    transform: translateX(-100%);
  }
}

@media screen and (max-width: 768px) {
  .aside {
    width: var(--mobile-aside-width);
    transform: translateX(-100%); /* 移动端默认隐藏 */
    
    &:not(.fold) {
      transform: translateX(0);
    }
  }
}
</style> 