export const addPath = (data) => {
  const hide = tui.Toast.loading('');
  return axios.post('https://ff827abe-e27d-48d4-a09a-81355a2ce85d.bspapp.com/path/add', {
    ...data,
    createTime: Date.now(),
  }).finally(hide);
};

export const fetchPath = (query) => {
  const hide = tui.Toast.loading('');
  return axios.get('https://ff827abe-e27d-48d4-a09a-81355a2ce85d.bspapp.com/path/get', { params: query }).then(({ status, data }) => {
    if (status === 200 && data.data.length) {
      return data.data[0].path;
    }
    tui.Toast.error('数据加载失败，请重试');
    throw new Error(res);
  }).finally(hide);
};
