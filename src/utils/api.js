import axios from 'axios';
import {Message} from 'element-ui';
import store from '../store';
import {aesDecrypt, aesEncrypt} from '../utils/encryption';
// 创建axios实例
const service = axios.create({
  baseURL: process.env.BASE_URL, // api的base_url
  timeout: 15000 // 请求超时时间2
});
// request拦截器
service.interceptors.request.use(config => {
  let logger = {
    logUrl: config.url
  };
  // axios.post('/api/logger',Object.assign({}, logger, store.app.logger));
  // 对请求方式为post，put的请求进行加密
  if (config.method === 'post' || config.method === 'put') {
    config.data = aesEncrypt(JSON.stringify(config.data));
    config.headers= {'Content-Type': 'application/json;charset=utf-8'}
  }
  return config
}, error => {
  Promise.reject(error)
});
// respone拦截器
service.interceptors.response.use(
  response => {
    //对进行加密过的string进行解密
    if(typeof(response.data) == "string"){
      response.data = aesDecrypt(response.data);
    }
    const res = response.data === null ? '': response.data;

    if (res.status === '200' || res.status === 200) {
      return res.hasOwnProperty('data')?res.data:res;
    }

    if (res.status === '201') {
      Message({
        showClose: true,
        message: res.message,
        type: 'error',
        duration: 500,
        onClose: () => {
          store.dispatch('FedLogOut').then(() => {
            location.reload()
          })
        }
      });
      return Promise.reject('未登录');
    } else if (res.hasOwnProperty('status') && res.status !== '200') {
      Message({
        type: 'error',
        message: res.message
      });
      return Promise.reject(res.message);
    } else {
      return res
    }
  },
  error => {
    console.error('error' + error);
    Message({
      message: error.message,
      type: 'error',
      duration: 3 * 1000
    });
    return Promise.reject(error.message)
  }
);
export default service
