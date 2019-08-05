/**
 * 从dataList中获取指定页
 *
 * @param index 当前页
 * @param pagerSize 页面大小
 * @param dataList list数组
 * @returns {*}
 */
const getPager = function (index, pagerSize, dataList) {
  let start = (index - 1 > 0 ? index - 1 : 0) * pagerSize;
  let end = index * pagerSize > dataList.length ? dataList.length : index * pagerSize;
  return dataList.slice(start, end);
};

/**
 * 返回编号
 *
 * @param current 当前页
 * @param pagerSize 页面大小
 * @returns {*}
 */
const serialNumber = function (current, pagerSize) {
  return (current - 1) * pagerSize + 1;
};

/**
 * 文件下载
 *
 * @param fileId 文件ID
 * @param fileName 下载后的文件名
 */
const downloadFile = function (fileId, fileName) {
  let url = this.window.location.origin + '/file/' + fileId;
  return new Promise((resolve, reject) => {
    // Get file name from url.
    let xhr = new XMLHttpRequest();
    xhr.responseType = 'blob';
    xhr.onload = () => {
      resolve(xhr);
    };
    xhr.onerror = reject;
    xhr.open('GET', url);
    xhr.send();
  }).then((xhr) => {
    let a = document.createElement('a');
    a.href = window.URL.createObjectURL(xhr.response); // xhr.response is a blob
    a.download = fileName; // Set the file name.
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    this.getFileList();
    return xhr;
  });
};

export {
  getPager,
  serialNumber,
  downloadFile
}
