import { defineConfig, presetUno, presetAttributify } from 'unocss'

export default defineConfig({
  presets: [
    presetUno(),
    presetAttributify()
  ],
  theme: {
    colors: {
      primary: '#3b82f6',
      secondary: '#64748b',
      success: '#10b981',
      warning: '#f59e0b',
      danger: '#ef4444'
    }
  },
  shortcuts: {
    'btn': 'px-4 py-2 rounded font-medium transition-colors',
    'btn-primary': 'btn bg-primary text-white hover:bg-primary-600',
    'btn-secondary': 'btn bg-secondary text-white hover:bg-secondary-600',
    'card': 'p-6 rounded-lg shadow-md bg-white dark:bg-gray-800',
    'input': 'w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary-500'
  }
})