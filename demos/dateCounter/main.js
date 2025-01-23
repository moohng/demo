// DOM 元素
const dateCard = document.getElementById('dateCard');
const cardTitle = document.getElementById('cardTitle');
const daysNumber = document.getElementById('daysNumber');
const cardDate = document.getElementById('cardDate');
const datePickerModal = document.getElementById('datePickerModal');
const dateForm = document.getElementById('dateForm');
const titleInput = document.getElementById('titleInput');
const dateInput = document.getElementById('dateInput');
const colorInput = document.getElementById('colorInput');
const unitSelect = document.getElementById('unitSelect');
const cancelBtn = document.getElementById('cancelBtn');

// 时间单位配置
const TIME_UNITS = [
  { value: 'year', label: '年', divisor: 365 * 24 * 60 * 60 * 1000 },
  { value: 'month', label: '月', divisor: 30 * 24 * 60 * 60 * 1000 },
  { value: 'week', label: '周', divisor: 7 * 24 * 60 * 60 * 1000 },
  { value: 'day', label: '天', divisor: 24 * 60 * 60 * 1000 },
  { value: 'hour', label: '时', divisor: 60 * 60 * 1000 },
  { value: 'minute', label: '分', divisor: 60 * 1000 },
  { value: 'second', label: '秒', divisor: 1000 }
];

// 默认配置
const DEFAULT_CONFIG = {
  title: '我们已经相识',
  date: formatDate(new Date()),
  color: '#6b8afd',
  unit: 'day'
};

// 从 URL 获取参数
function getQueryParams() {
  const params = new URLSearchParams(window.location.search);
  const config = {};
  
  // 获取所有可配置项
  for (const key of Object.keys(DEFAULT_CONFIG)) {
    const value = params.get(key);
    if (value) {
      config[key] = key === 'title' ? decodeURIComponent(value) : value;
    }
  }
  
  return config;
}

// 初始化数据
let dateInfo = { ...DEFAULT_CONFIG };

// 从本地存储加载数据
function loadData() {
  const urlParams = getQueryParams();
  const saved = localStorage.getItem('dateCounter');
  
  if (saved) {
    // 合并本地存储数据，确保所有字段都有值
    dateInfo = { ...DEFAULT_CONFIG, ...JSON.parse(saved) };
  }
  
  // URL 参数优先级最高
  dateInfo = { ...dateInfo, ...urlParams };
  
  // 初始化表单数据
  initFormData();
  // 更新显示
  updateCard();
  updateThemeColor();
  // 开始自动更新
  startAutoUpdate();
}

// 初始化表单数据
function initFormData() {
  titleInput.value = dateInfo.title;
  dateInput.value = dateInfo.date;
  colorInput.value = dateInfo.color;
  unitSelect.value = dateInfo.unit;
}

// 生成分享链接
function generateShareUrl() {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(dateInfo)) {
    params.set(key, key === 'title' ? encodeURIComponent(value) : value);
  }
  return `${window.location.origin}${window.location.pathname}?${params.toString()}`;
}

// 保存数据到本地存储
function saveData() {
  localStorage.setItem('dateCounter', JSON.stringify(dateInfo));
  // 更新 URL，但不包含默认值
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(dateInfo)) {
    if (value !== DEFAULT_CONFIG[key]) {
      params.set(key, key === 'title' ? encodeURIComponent(value) : value);
    }
  }
  const newUrl = `${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}`;
  window.history.replaceState({}, '', newUrl);
}

// 计算时间差
function calculateTimeDiff(targetDate, unit) {
  const now = new Date();
  const diffTime = Math.abs(targetDate.getTime() - now.getTime());
  const unitConfig = TIME_UNITS.find(u => u.value === unit);
  return Math.floor(diffTime / unitConfig.divisor);
}

// 更新卡片显示
function updateCard() {
  const targetDate = new Date(dateInfo.date);
  const unitConfig = TIME_UNITS.find(u => u.value === dateInfo.unit);
  const count = calculateTimeDiff(targetDate, dateInfo.unit);
  
  cardTitle.textContent = dateInfo.title;
  daysNumber.textContent = count;
  document.getElementById('unitLabel').textContent = unitConfig.label;
  cardDate.textContent = dateInfo.date;

  // 更新后重新设置定时器
  startAutoUpdate();
}

// 更新主题颜色
function updateThemeColor() {
  document.documentElement.style.setProperty('--primary-color', dateInfo.color);
}

// 格式化日期 YYYY-MM-DD
function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// 显示设置面板
function showDatePicker() {
  // 每次打开时都重新初始化表单数据
  initFormData();
  datePickerModal.classList.add('show');
}

// 隐藏设置面板
function hideDatePicker() {
  datePickerModal.classList.remove('show');
}

// 事件监听
dateCard.addEventListener('click', showDatePicker);

cancelBtn.addEventListener('click', hideDatePicker);

// 表单提交时更新单位和重置定时器
dateForm.addEventListener('submit', (e) => {
  e.preventDefault();

  // 更新数据
  dateInfo = {
    title: titleInput.value || DEFAULT_CONFIG.title,
    date: dateInput.value,
    color: colorInput.value || DEFAULT_CONFIG.color,
    unit: unitSelect.value || DEFAULT_CONFIG.unit
  };

  // 保存并更新显示
  saveData();
  updateCard();
  updateThemeColor();
  hideDatePicker();
});

// 如果选择的是秒或分，需要更频繁地更新显示
function startAutoUpdate() {
  // 清除现有定时器
  if (window.updateTimer) {
    clearInterval(window.updateTimer);
  }

  let interval = 60000; // 默认1分钟更新一次
  
  // 根据单位设置更新频率
  switch (dateInfo.unit) {
    case 'second':
      interval = 1000; // 秒级更新
      break;
    case 'minute':
      interval = 1000; // 分钟级也用秒更新，以显示更精确
      break;
    case 'hour':
      interval = 60000; // 分钟级更新
      break;
    default:
      interval = 60000 * 5; // 其他单位 5 分钟更新一次
  }
  
  window.updateTimer = setInterval(updateCard, interval);
}

// 在页面卸载时清理定时器
window.addEventListener('unload', () => {
  if (window.updateTimer) {
    clearInterval(window.updateTimer);
  }
});

// 初始化
loadData();