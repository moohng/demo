<template>
  <footer class="footer">
    <a href="https://github.com/moohng/demo" target="_blank" class="github-link">
      <i class="i-ri:github-line mr-2" />
      <span>GitHub</span>
    </a>
  </footer>
</template>

<style lang="scss" scoped>
.footer {
  height: var(--footer-height);
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-top: 1px solid var(--border-color);
  background-color: var(--bg-color);
  
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