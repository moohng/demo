<template>
  <div class="layout" :class="{ fold }">
    <div class="expand-btn" @click="fold = !fold">
      <span>展开</span>
      <i class="css-icon icon-expand"></i>
    </div>
    <aside class="aside">
      <header class="header">
        <h1 @click="handleClick('/demos/home/')">DEMO 大杂烩</h1>
        <div class="fold-btn" @click="fold = !fold">
          <i class="css-icon icon-fold"></i>
        </div>
      </header>
      <ul class="nav">
        <li :class="['nav-item', { active: currentDemo === item.path }]" v-for="item in demoList" :key="item.key" @click="handleClick(item.path)">
          <div class="title" :title="item.title">{{ item.title }}</div>
          <!-- <div class="desc">{{ item.description }}</div> -->
        </li>
      </ul>
    </aside>
    <main class="main">
      <div v-show="!hideProgress" class="fixed-top">
        <ProgressBar :progress="progress" />
      </div>
      <iframe v-if="currentDemo" class="demo-iframe" :src="currentDemo" frameborder="0" @load="progress = 100"></iframe>
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
  
  .nav {
    flex: 1;
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
  margin: 0 16px;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: space-between;

  h1 {
    margin: 16px 0;
    font-size: 1.2em;
    cursor: pointer;
  }
}

.main {
  position: relative;

  .demo-iframe {
    display: block;
    width: 100%;
    height: 100vh;
    border: none;
  }

  .fixed-top {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
  }
}

.nav {
  list-style: none;
  margin: 0;
  padding: 16px;
  overflow: auto;
}

.nav-item {
  padding: 8px;
  display: flex;
  cursor: pointer;

  &:hover {
    background-color: var(--bg-color-hover);
    border-radius: 4px;
  }

  &.active {
    font-weight: bold;
  }
  
  .title {
    font-size: 1em;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .desc {
    font-size: .8em;
    color: var(--text-color-gray);
  }
}

.css-icon {
  position: relative;
  display: inline-block;
  width: 1em;
  height: 1em;
  vertical-align: middle;

  &::before,
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
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

  .icon-fold {
    border: 0.08em solid currentColor;
    border-radius: 50%;

    &::before {
      width: 0.4em;
      height: 0.4em;
      border: 0.08em solid currentColor;
      border-right: none;
      border-bottom: none;
      transform: translate(-28%, -50%) rotate(-45deg);
    }
  }
}

.expand-btn {
  position: fixed;
  left: 0;
  top: 32px;
  padding: 6px 8px;
  // width: 40px;
  font-size: 14px;
  line-height: 1;
  background-color: var(--bg-color-gray);
  // border: 1px solid var(--border-color);
  border-radius: 0 24px 24px 0;
  box-shadow: 2px 2px 6px rgba(0, 0, 0, .1);
  cursor: pointer;
  z-index: 99999;
  transition: transform 0.2s ease-in-out;
  transform: translateX(-100%);
  display: flex;
  align-items: center;

  .icon-expand {
    margin-left: 2px;
    font-size: 1.34em;
    &::before {
      width: 0.36em;
      height: 0.36em;
      border: 0.08em solid currentColor;
      border-right: none;
      border-bottom: none;
      transform: translate(-35%, -50%) rotate(135deg);
      box-shadow: 4px;
    }
    &::after {
      width: 0.36em;
      height: 0.36em;
      border: 0.08em solid currentColor;
      border-right: none;
      border-bottom: none;
      transform: translate(-105%, -50%) rotate(135deg);
      box-shadow: 4px;
    }
  }
}
</style>
