import { fetchData } from './api';

let refresh;

document.getElementById('vueInit').addEventListener('click', function () {
  Vue.createApp({
    template: `
        <div class="cell-bar" v-for="(item, index) in list" :key="index">
          <div class="avatar" :style="{backgroundImage: 'url(' + item.avatar + ')'}"></div>
          <div class="content">
            <div class="title">{{ item.name }}</div>
            <div class="subtitle">{{ item.bird }}</div>
          </div>
        </div>
      `,
    setup() {
      const list = Vue.ref([]);

      refresh = () => fetchData().then(data => list.value = data);

      refresh();

      return { list };
    },
  }).mount('#app');
}, false);

document.getElementById('vueUpdate').addEventListener('click', () => refresh && refresh(), false);
