import { fetchData } from './api';

function createComponent({ avatar, name, bird }) {
  const template = `
    <div class="cell-bar">
      <div class="avatar" style="background-image: url(${avatar})"></div>
      <div class="content">
        <div class="title">${name}</div>
        <div class="subtitle">${bird}</div>
      </div>
    </div>
    `;
  return template;
}

function onInitJs() {
  fetchData().then(data => {
    const list = data.reduce((res, item) => res + createComponent(item), '');
    document.getElementById('app').innerHTML = list;
  });
}

document.getElementById('jsInit').addEventListener('click', onInitJs, false);
document.getElementById('jsUpdate').addEventListener('click', onInitJs, false);
