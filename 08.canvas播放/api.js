axios.interceptors.request.use((config) => {
  config.baseURL = 'https://ff827abe-e27d-48d4-a09a-81355a2ce85d.bspapp.com/draw/';
  config.headers['Content-Type'] = 'application/json';
  return config;
});

axios.interceptors.response.use((res) => {
  if (res.status === 200) {
    return res.data;
  }
  throw new Error(res);
});

export const addPath = (data) => {
  const hide = tui.Toast.loading('');
  return axios.post('path/add', {
    ...data,
    createTime: Date.now(),
  }).catch((err) => {
    tui.Toast.error('网络开小差了，请重试~');
    throw new Error(err);
  }).finally(hide);
};

export const fetchPath = (query) => {
  const hide = tui.Toast.loading('');
  return axios.get('path/get', { params: query }).then(({ data }) => {
    return data;
  }).catch((err) => {
    tui.Toast.error('数据加载失败，请重试~');
    throw new Error(err);
  }).finally(hide);
};
