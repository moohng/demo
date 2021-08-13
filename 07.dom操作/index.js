import { fetchData } from './api';

function createComponent({ avatar, name, bird }) {
  return `
    <div class="cell-bar">
      <div class="avatar" style="background-image: url(${avatar})"></div>
      <div class="content">
        <div class="title">${name}</div>
        <div class="subtitle">${bird}</div>
      </div>
    </div>
    `;
}

function onInitJs() {
  fetchData().then(data => {
    const list = data.reduce((res, item) => res + createComponent(item), '');
    $('#app').html(list);
  });
}

$('#jsInit').on('click', onInitJs);

$('#jsUpdate').on('click', onInitJs);
