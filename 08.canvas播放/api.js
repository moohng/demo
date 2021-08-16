export const addPath = (data) => axios.post('https://ff827abe-e27d-48d4-a09a-81355a2ce85d.bspapp.com/path/add', {
  ...data,
  createTime: Date.now(),
});

export const fetchPath = (query) => axios.get('https://ff827abe-e27d-48d4-a09a-81355a2ce85d.bspapp.com/path/get', { params: query }).then(res => {
  if (res.status === 200) {
    return res.data;
  }
  throw new Error(res);
});
