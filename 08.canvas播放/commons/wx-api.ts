import wx from 'weixin-js-sdk';
import { random } from '@moohng/dan';
import { fetchWXSDKConfig } from './api';


/**
 * 微信 sdk 初始化
 */
export async function init() {
  const nonceStr = random(16) as string;
  const timestamp = '' + Date.now();
  const url = location.href;

  const data = await fetchWXSDKConfig({ url, nonceStr, timestamp });

  console.log(data);

  wx.config({
    ...data,
    timestamp: +(data as any).timestamp,
    appId: 'wx79fd704b15fe3852',
    jsApiList: ['downloadImage', 'chooseImage'],
  });

  wx.ready((res: any) => {
    console.log('wx sdk config success', res);
  });

  wx.error((err: any) => {
    console.error(err);
  });
}
