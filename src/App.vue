<template>
  <div class="layout" :class="{ fold }">
    <div class="expand-btn" @click="fold = !fold">
      <i class="i-ri:menu-fold-2-line" />
    </div>
    <aside class="aside">
      <header class="flex justify-between items-center mx-16px header">
        <h1 class="my-16px text-1.2em cursor-pointer" @click="handleClick('/demos/home/')">DEMO 大杂烩</h1>
        <div class="fold-btn" @click="fold = !fold">
          <i class="i-ri:menu-fold-line" />
        </div>
      </header>
      <ul class="flex-1 list-style-none m-0 p-16px overflow-auto">
        <li :class="['nav-item', { active: currentDemo === item.path }]" v-for="item in demoList" :key="item.key" @click="handleClick(item.path)">
          <div class="title" :title="item.title">{{ item.title }}</div>
        </li>
      </ul>
    </aside>
    <main class="main relative">
      <div v-show="!hideProgress" class="absolute top-0 left-0 w-full">
        <ProgressBar :progress="progress" />
      </div>
      <iframe v-if="currentDemo" class="block w-full h-100vh border-none" :src="currentDemo" frameborder="0" @load="progress = 100"></iframe>
    </main>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { ProgressBar } from './components/ProgressBar';

const demoList = ref(__DEMO_LIST__ as unknown as any[]);

const currentDemo = ref('/demos/home/');
const hideProgress = ref(false);

const updateProgress = () => {
  const timer = setInterval(() => {
    if (progress.value < 100) {
      progress.value += 10;
    } else {
      clearInterval(timer);
      setTimeout(() => {
        hideProgress.value = true;
      }, 300);
    }
  }, 100);
};

const handleClick = (path: string) => {
  if (currentDemo.value === path) {
    return;
  }

  currentDemo.value = path;
  progress.value = 0;
  hideProgress.value = false;

  updateProgress();
};

onMounted(() => {
  updateProgress();
});

const fold = ref(false);

const progress = ref(0);
</script>

<style lang="scss" scoped>
.layout {
  .aside {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    z-index: 99;
    display: flex;
    flex-direction: column;
    background-color: var(--bg-color-gray);
    overflow: hidden;
    transition: width 0.2s ease;
    width: 250px;
    white-space: nowrap;
  }

  .main {
    margin-left: 250px;
    transition: margin-left 0.2s ease;
  }

  &.fold {
    .aside {
      width: 0;
    }
    .main {
      margin-left: 0;
    }
    .expand-btn {
      transform: translateX(0);
    }
  }
}

.header {
  border-bottom: 1px solid var(--border-color);
}

.nav-item {
  padding: 8px;
  display: flex;
  align-items: center;
  cursor: pointer;

  &:hover {
    background-color: var(--bg-color-hover);
    border-radius: 4px;
  }

  &.active {
    padding-left: 8px;
    font-weight: bold;
  }
  
  .title {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

.fold-btn {
  padding: 4px;
  cursor: pointer;
  font-size: 1.5em;
  color: var(--text-color-gray);
  line-height: 1;

  &:hover {
    color: var(--text-color);
  }
}

.expand-btn {
  position: fixed;
  left: 0;
  top: 32px;
  padding: 8px 8px 8px 12px;
  color: var(--text-color-gray);
  font-size: 1.5em;
  line-height: 1;
  background-color: var(--bg-color-gray);
  border-radius: 0 24px 24px 0;
  box-shadow: 2px 2px 6px rgba(0, 0, 0, .1);
  cursor: pointer;
  z-index: 99999;
  transition: transform 0.2s ease-in-out;
  transform: translateX(-100%);
  display: flex;
  align-items: center;

  &:hover {
    color: var(--text-color);
  }
}
</style>
