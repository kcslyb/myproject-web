const CryptoJS = require('crypto-js');  //引用AES源码js

/**
 * 需要跟后台保持一致
 */
const key  = CryptoJS.enc.Latin1.parse('ABCDEF9876543210');

/**
 * 加密
 *
 * @param {String} data 需要加密的内容
 * @returns {String} 加密后的内容
 */
const aesEncrypt = function (data) {
  let src = CryptoJS.enc.Utf8.parse(data);
  let encrypted = CryptoJS.AES.encrypt(src, key, {
    mode : CryptoJS.mode.ECB,
    padding : CryptoJS.pad.Pkcs7
  });
  return encrypted.toString();
};
/**
 * 解密
 *
 * @param {String} data 需要解密的内容
 * @returns {String} 解密后的内容
 */
const aesDecrypt = function (data) {
  let decrypt = CryptoJS.AES.decrypt(data, key, {
    mode : CryptoJS.mode.ECB,
    padding : CryptoJS.pad.Pkcs7
  });
  return JSON.parse(CryptoJS.enc.Utf8.stringify(decrypt).toString());
};

export {
  aesDecrypt,
  aesEncrypt
};
