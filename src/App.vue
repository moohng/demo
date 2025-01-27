<template>
  <div class="layout" :class="{ fold }">
    <div class="expand-btn" @click="fold = !fold">
      <i class="i-ri:menu-unfold-line" />
    </div>
    <div class="mask" @click="fold = true"></div>
    <Sidebar
      v-model:fold="fold"
      :demo-list="demoList"
      :current-path="currentDemo"
      @navigate="handleNavigate"
    />
    <main class="main">
      <div v-show="!hideProgress" class="progress-wrapper">
        <ProgressBar :progress="progress" />
      </div>
      <iframe 
        v-if="currentDemo" 
        class="content-frame" 
        :src="currentDemo" 
        frameborder="0" 
        @load="progress = 100"
      ></iframe>
    </main>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { ProgressBar } from './components/ProgressBar';
import Sidebar from './components/Sidebar.vue';

const demoList = ref(__DEMO_LIST__ as unknown as any[]);
const currentDemo = ref('/demos/home/');
const hideProgress = ref(false);
const fold = ref(false);
const progress = ref(0);

// 从 hash 中获取路径
const getPathFromHash = () => {
  const hash = window.location.hash.slice(1); // 去掉 # 号
  return hash || '/demos/home/';
};

// 更新导航和内容
const updateNavigation = (path: string) => {
  if (currentDemo.value === path) return;
  currentDemo.value = path;
  progress.value = 0;
  hideProgress.value = false;
  updateProgress();
  
  if (window.innerWidth <= 768) {
    fold.value = true;
  }
};

const handleNavigate = (path: string) => {
  window.location.hash = path;
};

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

onMounted(() => {
  updateProgress();
  // 初始化时从 hash 读取路径
  const initialPath = getPathFromHash();
  updateNavigation(initialPath);
  
  const handleResize = () => {
    if (window.innerWidth <= 768) {
      fold.value = true;
    }
  };
  
  window.addEventListener('resize', handleResize);
  handleResize();
  
  const handleHashChange = () => {
    const path = getPathFromHash();
    console.log('hash变化', path);
    updateNavigation(path);
  };
  // 监听 hash 变化
  window.addEventListener('hashchange', handleHashChange);
  
  return () => {
    window.removeEventListener('resize', handleResize);
    window.removeEventListener('hashchange', handleHashChange);
  };
});
</script>

<style lang="scss" scoped>
.layout {
  position: relative;
  
  .main {
    margin-left: var(--aside-width);
    transition: margin-left 0.3s ease;
  }

  &.fold {
    .main {
      margin-left: 0;
    }
    .expand-btn {
      transform: translateX(0);
    }
  }
}

.expand-btn {
  position: fixed;
  left: 0;
  top: 32px;
  padding: 12px;
  color: var(--text-color-gray);
  font-size: 1.5em;
  line-height: 1;
  background-color: var(--bg-color);
  border-radius: 0 8px 8px 0;
  box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  z-index: 999;
  transition: all 0.3s ease;
  transform: translateX(-100%);
  
  &:hover {
    color: var(--primary-color);
  }
}

.mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 98;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
  display: none;
}

.progress-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1;
}

.content-frame {
  display: block;
  width: 100%;
  height: 100vh;
  border: none;
}

@media screen and (max-width: 768px) {
  .layout {
    .main {
      margin-left: 0;
    }
    
    &:not(.fold) {
      .mask {
        opacity: 1;
        visibility: visible;
        display: block;
      }
    }
  }
  
  .expand-btn {
    top: 12px;
  }
  
  .aside {
    box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
  }
}
</style>
