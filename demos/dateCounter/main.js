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
const shareInput = document.getElementById('shareInput');
const shareBtn = document.getElementById('shareBtn');
const shareTip = document.getElementById('shareTip');
const timeInput = document.getElementById('timeInput');

// 时间单位配置
const TIME_UNITS = [
  { value: 'year', label: '年', divisor: 365 * 24 * 60 * 60 * 1000 },
  { value: 'month', label: '月', divisor: 30 * 24 * 60 * 60 * 1000 },
  { value: 'week', label: '周', divisor: 7 * 24 * 60 * 60 * 1000 },
  { value: 'day', label: '天', divisor: 24 * 60 * 60 * 1000 },
  { value: 'hour', label: '小时', divisor: 60 * 60 * 1000 },
  { value: 'minute', label: '分钟', divisor: 60 * 1000 },
  { value: 'second', label: '秒', divisor: 1000 }
];

// 默认配置
const DEFAULT_CONFIG = {
  title: '我们已经相识',
  date: new Date().toISOString(), // 使用 ISO 格式存储完整的日期时间
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

// 格式化日期时间 YYYY-MM-DD HH:mm:ss
function formatDateTime(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return {
    date: `${year}-${month}-${day}`,
    time: `${hours}:${minutes}:${seconds}`
  };
}

// 解析日期时间字符串
function parseDateTime(dateStr, timeStr = '00:00:00') {
  const [year, month, day] = dateStr.split('-').map(Number);
  const [hours, minutes, seconds] = timeStr.split(':').map(Number);
  return new Date(year, month - 1, day, hours, minutes, seconds);
}

// 初始化表单数据
function initFormData() {
  const currentDateTime = new Date(dateInfo.date);
  const formatted = formatDateTime(currentDateTime);
  
  titleInput.value = dateInfo.title;
  dateInput.value = formatted.date;
  timeInput.value = formatted.time;
  colorInput.value = dateInfo.color;
  unitSelect.value = dateInfo.unit;
}

// 根据表单数据生成配置对象
function getFormData() {
  const dateTime = parseDateTime(dateInput.value, timeInput.value);
  return {
    title: titleInput.value || DEFAULT_CONFIG.title,
    date: dateTime.toISOString(),
    color: colorInput.value || DEFAULT_CONFIG.color,
    unit: unitSelect.value || DEFAULT_CONFIG.unit
  };
}

// 生成分享链接
function generateShareUrl(config = dateInfo) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(config)) {
    params.set(key, key === 'title' ? encodeURIComponent(value) : value);
  }
  return `${window.location.origin}${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}`;
}

// 复制文本到剪贴板
async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('复制失败:', err);
    return false;
  }
}

// 显示复制成功提示
function showCopyTip() {
  shareTip.classList.add('show');
  setTimeout(() => {
    shareTip.classList.remove('show');
  }, 2000);
}

// 生成并复制分享链接
async function handleShare() {
  // 使用当前表单数据生成链接
  const formData = getFormData();
  const url = generateShareUrl(formData);
  shareInput.value = url;
  const success = await copyToClipboard(url);
  if (success) {
    showCopyTip();
  }
}

// 点击输入框时自动选中
shareInput.addEventListener('click', function() {
  if (this.value) {
    this.select();
  }
});

// 生成分享链接按钮点击事件
shareBtn.addEventListener('click', handleShare);

// 表单提交时更新单位和重置定时器
dateForm.addEventListener('submit', (e) => {
  e.preventDefault();

  // 更新数据
  dateInfo = getFormData();

  // 保存并更新显示
  saveData();
  updateCard();
  updateThemeColor();
  hideDatePicker();
});

// 保存数据到本地存储
function saveData() {
  localStorage.setItem('dateCounter', JSON.stringify(dateInfo));
  // 更新 URL，但不包含默认值（除了单位和日期）
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(dateInfo)) {
    if (key === 'unit' || key === 'date' || value !== DEFAULT_CONFIG[key]) {
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
  
  // 格式化显示日期时间
  const formatted = formatDateTime(targetDate);
  cardDate.textContent = `${formatted.date} ${formatted.time}`;

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