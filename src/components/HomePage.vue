<template>
  <div class="home-page">
    <div class="top-actions">
      <div class="theme-switch">
        <button 
          v-for="mode in themeModes" 
          :key="mode.value"
          :class="{ active: currentMode === mode.value }"
          @click="switchTheme(mode.value)"
        >
          <i :class="mode.icon" />
        </button>
      </div>
      <a href="https://github.com/moohng/demo" target="_blank" class="github-link">
        <i class="i-ri:github-line" />
      </a>
    </div>
    <div class="search-container" :class="{ fixed: isSearchFixed }">
      <div class="search-wrapper">
        <h1>Demo 大杂烩</h1>
        <div class="search-box">
          <input 
            v-model="searchText" 
            type="text" 
            placeholder="搜索 Demo..."
          >
          <i class="i-ri:search-line search-icon" />
        </div>
      </div>
    </div>
    <div class="search-placeholder" v-show="isSearchFixed"></div>
    <div class="demo-grid">
      <div 
        v-for="demo in filteredDemos" 
        :key="demo.path"
        class="demo-card"
        @click="$emit('navigate', demo.path)"
      >
        <h3>{{ demo.title }}</h3>
        <p>{{ demo.description }}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue';
import { ThemeMode, getThemeMode, setThemeMode } from '@/utils/theme';

interface Demo {
  path: string;
  title: string;
  description?: string;
}

const props = defineProps<{
  demoList: Demo[];
}>();

defineEmits<{
  (e: 'navigate', path: string): void;
}>();

const searchText = ref('');

const filteredDemos = computed(() => {
  if (!searchText.value) return props.demoList;
  const searchLower = searchText.value.toLowerCase();
  return props.demoList.filter(demo => 
    demo.title.toLowerCase().includes(searchLower) || 
    demo.description?.toLowerCase().includes(searchLower)
  );
});

const currentMode = ref<ThemeMode>('system');

const themeModes = [
  { value: 'light', icon: 'i-ri:sun-line' },
  { value: 'dark', icon: 'i-ri:moon-line' },
  { value: 'system', icon: 'i-ri:computer-line' },
] as const;

const switchTheme = (mode: ThemeMode) => {
  currentMode.value = mode;
  setThemeMode(mode);
};

const isSearchFixed = ref(false);

onMounted(() => {
  currentMode.value = getThemeMode();
  
  const handleScroll = () => {
    const scrollTop = window.scrollY;
    isSearchFixed.value = scrollTop > 100;
  };
  
  window.addEventListener('scroll', handleScroll);
  return () => window.removeEventListener('scroll', handleScroll);
});
</script>

<style lang="scss" scoped>
.home-page {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.search-container {
  text-align: center;
  margin-bottom: 3rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  &.fixed {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 100;
    margin: 0;
    padding: 1rem;
    background: var(--bg-color);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    
    .search-wrapper {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      gap: 2rem;
    }
    
    h1 {
      margin: 0;
      font-size: 1.5rem;
      white-space: nowrap;
    }
    
    .search-box {
      flex: 1;
      max-width: none;
    }
  }
  
  h1 {
    font-size: 2.5rem;
    margin-bottom: 2rem;
    color: var(--primary-color);
  }
}

.search-placeholder {
  height: 180px;
  margin-bottom: 3rem;
}

.search-box {
  position: relative;
  max-width: 600px;
  margin: 0 auto;
  background: var(--bg-color);
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s;
  
  &:hover {
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
  }
  
  &:focus-within {
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.16);
    
    input {
      border-color: var(--primary-color);
    }
    
    .search-icon {
      color: var(--primary-color);
    }
  }
  
  input {
    width: 100%;
    padding: 1.2rem 3rem 1.2rem 1.5rem;
    font-size: 1.2rem;
    color: var(--text-color);
    background: transparent;
    border: 2px solid var(--border-color);
    border-radius: inherit;
    outline: none;
    transition: all 0.3s;
    box-sizing: border-box;
    
    &::placeholder {
      color: var(--text-color-gray);
    }
  }
  
  .search-icon {
    position: absolute;
    right: 1rem;
    top: 50%;
    transform: translateY(-50%);
    font-size: 1.3rem;
    width: 1.3rem;
    height: 1.3rem;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-color-gray);
    transition: color 0.3s;
  }
}

.demo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

.demo-card {
  padding: 1.5rem;
  background: var(--bg-color);
  border-radius: 8px;
  border: 1px solid var(--border-color);
  cursor: pointer;
  transition: all 0.3s;
  
  &:hover {
    transform: translateY(-2px);
    border-color: var(--primary-color);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
  
  h3 {
    margin: 0 0 0.5rem;
    color: var(--text-color);
  }
  
  p {
    margin: 0;
    color: var(--text-color-gray);
    font-size: 0.9rem;
  }
}

.top-actions {
  position: fixed;
  top: 1rem;
  right: 1rem;
  display: flex;
  gap: 1rem;
  z-index: 10;

  .theme-switch {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 4px;
    border-radius: 8px;
    background-color: var(--bg-color-gray);
    
    button {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      height: 28px;
      padding: 0;
      border: none;
      border-radius: 6px;
      background: none;
      color: var(--text-color-gray);
      cursor: pointer;
      transition: all 0.2s ease;
      
      i {
        display: block;
        font-size: 1.2em;
        line-height: 1;
      }
      
      &:hover {
        color: var(--text-color);
        background-color: var(--hover-color);
      }
      
      &.active {
        color: var(--primary-color);
        background-color: var(--bg-color);
      }
    }
  }

  .github-link {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: 8px;
    background: var(--bg-color);
    border: 1px solid var(--border-color);
    color: var(--text-color-gray);
    font-size: 1.2rem;
    transition: all 0.3s;
    
    &:hover {
      color: var(--primary-color);
      border-color: var(--primary-color);
    }
  }
}

@media screen and (max-width: 768px) {
  .home-page {
    padding: 1rem;
  }
  
  .search-container {
    &.fixed {
      padding: 0.5rem;
      
      .search-wrapper {
        gap: 1rem;
      }
      
      h1 {
        font-size: 1.2rem;
      }
    }
  }
  
  .search-placeholder {
    height: 140px;
  }
  
  .search-container h1 {
    font-size: 2rem;
  }
  
  .demo-grid {
    grid-template-columns: 1fr;
  }

  .top-actions {
    top: 0.5rem;
    right: 0.5rem;
  }

  .search-box {
    input {
      padding: 1rem 2.8rem 1rem 1.2rem;
      font-size: 1.1rem;
    }
    
    .search-icon {
      right: 0.8rem;
      font-size: 1.2rem;
      width: 1.2rem;
      height: 1.2rem;
    }
  }
}
</style>
