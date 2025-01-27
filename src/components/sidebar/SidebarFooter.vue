<template>
  <footer class="footer">
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
      <i class="i-ri:github-line mr-2" />
      <span>GitHub</span>
    </a>
  </footer>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { ThemeMode, getThemeMode, setThemeMode } from '../../utils/theme';

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

onMounted(() => {
  currentMode.value = getThemeMode();
});
</script>

<style lang="scss" scoped>
.footer {
  height: var(--footer-height);
  padding: 10px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid var(--border-color);
  background-color: var(--bg-color);
  
  .theme-switch {
    display: flex;
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
      
      &:hover {
        color: var(--text-color);
        background-color: var(--hover-color);
      }
      
      &.active {
        color: var(--primary-color);
        background-color: var(--bg-color);
      }
      
      i {
        font-size: 1.2em;
      }
    }
  }
  
  .github-link {
    display: flex;
    align-items: center;
    color: var(--text-color-gray);
    text-decoration: none;
    transition: color 0.2s ease;
    
    &:hover {
      color: var(--text-color);
    }
  }
}
</style> 