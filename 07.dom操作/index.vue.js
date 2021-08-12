import { fetchData } from './api';

let app;

document.getElementById('vueInit').addEventListener('click', function () {
  app = new Vue({
    template: `
      <div>
        <div class="cell-bar" v-for="(item, index) in list" :key="index">
          <div class="avatar" :style="{backgroundImage: 'url(' + item.avatar + ')'}"></div>
          <div class="content">
            <div class="title">{{ item.name }}</div>
            <div class="subtitle">{{ item.bird }}</div>
          </div>
        </div>
      </div>
      `,
    data() {
      return {
        list: [],
      };
    },
    created() {
      this.refresh();
    },
    methods: {
      refresh() {
        fetchData().then(data => {
          this.list = data;
        });
      },
    },
  }).$mount('#app');
}, false);

document.getElementById('vueUpdate').addEventListener('click', function () {
  app.refresh();
}, false);
