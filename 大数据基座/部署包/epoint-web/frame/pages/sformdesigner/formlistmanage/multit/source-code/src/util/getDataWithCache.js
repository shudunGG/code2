import { post } from './index.js';

const promiseCache = {};

/**
 * 获取远程数据，并缓存
 *
 * @param {String} url 请求url
 * @param {Object} params 请求参数
 * @param {String} key 缓存key 前面会自动拼接url
 * @returns {Promise<any>}
 */
function getDataWithCache(url, params, key) {
  const tid = url + key;
  if (!promiseCache[tid]) {
    promiseCache[tid] = post(url, params).catch(error => {
      promiseCache[tid] = null;
      delete promiseCache[tid];
      console.error(error);
    });
  }
  return promiseCache[tid];
}

export { getDataWithCache };
export default getDataWithCache;
