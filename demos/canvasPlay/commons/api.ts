import axios from 'axios';
import { Toast } from '@moohng/tui/lib/index';
import { Path } from './Paint';

axios.interceptors.request.use((config: any) => {
  config.baseURL = 'https://ff827abe-e27d-48d4-a09a-81355a2ce85d.bspapp.com';
  config.headers['Content-Type'] = 'application/json';
  return config;
});

axios.interceptors.response.use((res: any) => {
  if (res.status === 200) {
    return res.data;
  }
  throw new Error(res);
});

interface PaintPath {
  path: Path[];
  code: string;
  background?: string;
  pwd?: string;
}

/**
 * 保存路径
 * @param {*} data
 * @returns
 */
export const addPath = (data: PaintPath) => {
  const hide = Toast.loading('');
  return axios.post('/draw/path/add', {
    ...data,
    createTime: Date.now(),
  }).catch((err: any) => {
    Toast.error('网络开小差了，请重试~');
    throw new Error(err);
  }).finally(hide);
};

/**
 * 获取路径
 * @param {*} query
 * @returns
 */
export const fetchPath = (query: { code: string }) => {
  const hide = Toast.loading('');
  return axios.get('/draw/path/get', { params: query }).then(({ data }: any) => {
    return data;
  }).catch((err: any) => {
    Toast.error('数据加载失败，请重试~');
    throw new Error(err);
  }).finally(hide);
};

interface WXSDKConfigParams {
  nonceStr: string;
  timestamp: string;
  url: string;
}

/**
 * 获取微信sdk初始化配置
 * @param params
 * @returns
 */
export const fetchWXSDKConfig = (params: WXSDKConfigParams) => {
  return axios.get('/wx/ticket/get', { params })
}
