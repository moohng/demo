<template>
  <div class="layout">
    <aside class="aside">
      <header class="header">
        <h1 @click="handleClick('/demos/home/')">DEMO 大杂烩</h1>
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
    border-right: 1px solid #eee;
  }
  
  .nav {
    flex: 1;
  }
}

.header {
  padding: 0 12px;
  border-bottom: 1px solid #eee;

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
  width: 200px;
  display: flex;
  cursor: pointer;

  &:hover {
    background-color: #efefef;
  }

  &.active {
    color: deepskyblue;
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
</style>
