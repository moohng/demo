import AV from 'leancloud-storage';
import { Toast } from '@moohng/tui/lib/index';
import { Path } from './Paint';

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
  // 创建 Path 类
  const PathObj = AV.Object.extend('Path');
  const pathObj = new PathObj();
  Object.keys(data).forEach((key: string) => {
    pathObj.set(key, (data as any)[key]);
  });
  return pathObj.save().catch((err: any) => {
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
  const pathQuery = new AV.Query('Path');
  return pathQuery.equalTo('code', query.code).first().then(res => res?.toJSON()).catch((err: any) => {
    Toast.error('数据加载失败，请重试~');
    throw new Error(err);
  }).finally(hide);
};
