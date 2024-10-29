<template>
  <div class="layout">
    <div class="expand-btn" :class="{ expand: fold }" @click="fold = !fold">
      <span>展开</span>
      <i class="css-icon icon-expand"></i>
    </div>
    <aside class="aside" :class="{ fold }">
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
      <iframe v-if="currentDemo" class="demo-iframe" :src="currentDemo" frameborder="0"></iframe>
    </main>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
const demoList = ref(__DEMO_LIST__ as unknown as any[]);

const currentDemo = ref('/demos/home/');

const handleClick = (path: string) => {
  currentDemo.value = path;
};

const fold = ref(false);
</script>

<style lang="scss" scoped>
.layout {
  display: flex;
  width: 100vw;
  height: 100vh;
  color: #333;

  .aside {
    display: flex;
    flex-direction: column;
    border-right: 1px solid #e5e5e5;
    overflow: hidden;
    position: relative;
    transition: width 0.2s ease-in-out;
    width: 250px;
    white-space: nowrap;

    &.fold {
      width: 0;
    }
  }
  
  .nav {
    flex: 1;
  }
}

.header {
  padding: 0 12px;
  border-bottom: 1px solid #e5e5e5;
  display: flex;
  align-items: center;
  justify-content: space-between;

  h1 {
    font-size: 1.2em;
    cursor: pointer;
  }
}

.main {
  flex: 1;

  .demo-iframe {
    display: block;
    width: 100%;
    height: 100%;
    border: none;
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
  // width: 200px;
  display: flex;
  cursor: pointer;

  &:hover {
    background-color: #efefef;
  }

  &.active {
    color: #333;
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
    color: #666;
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
  color: #666;
  line-height: 1;

  &:hover {
    color: #333;
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
  color: #333;
  background-color: #fff;
  // border: 1px solid #e5e5e5;
  border-radius: 0 24px 24px 0;
  box-shadow: 2px 2px 6px rgba(0, 0, 0, .1);
  cursor: pointer;
  z-index: 99999;
  transition: transform 0.2s ease-in-out;
  transform: translateX(-100%);
  display: flex;
  align-items: center;

  &.expand {
    transform: translateX(0);
  }

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
