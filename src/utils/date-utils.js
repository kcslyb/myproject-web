/**
 * 对Date的扩展，将 Date 转化为指定格式的String
 * 月(M)、日(d)、12小时(h)、24小时(H)、分(m)、秒(s)、周(E)、季度(q) 可以用 1-2 个占位符
 * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
 * eg:
 * (new Date()).pattern("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
 * (new Date()).pattern("yyyy-MM-dd E HH:mm:ss") ==> 2009-03-10 二 20:09:04
 * (new Date()).pattern("yyyy-MM-dd EE hh:mm:ss") ==> 2009-03-10 周二 08:09:04
 * (new Date()).pattern("yyyy-MM-dd EEE hh:mm:ss") ==> 2009-03-10 星期二 08:09:04
 * (new Date()).pattern("yyyy-M-d h:m:s.S") ==> 2006-7-2 8:9:4.18
 */
const dateFmt = function (fmt, time) {
  let date = strToDate(time);
  let o = {
    'M+': date.getMonth() + 1, // 月份
    'd+': date.getDate(), // 日
    'h+': date.getHours() % 12 === 0 ? 12 : date.getHours() % 12, // 小时
    'H+': date.getHours(), // 小时
    'm+': date.getMinutes(), // 分
    's+': date.getSeconds(), // 秒
    'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
    'S': date.getMilliseconds() // 毫秒
  };
  let week = {
    '0': '天',
    '1': '一',
    '2': '二',
    '3': '三',
    '4': '四',
    '5': '五',
    '6': '六'
  };
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  if (/(E+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? '星期' : '周') : '') + week[date.getDay() + '']);
  }
  for (let k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
    }
  }
  return fmt;
};
const longTime = function (time) {
  let now = dateFmt('yyyy-MM-dd', formatDate(new Date()));
  let str = dateFmt('yyyy-MM-dd', time);
  const d = new Date(time);
  let currt = new Date();
  let diff = (currt - d) / 1000;
  // console.info(diff);
  let m = Math.ceil(diff / 60);
  if (m <= 2) { // less 2 min
    return '';
  } else {
    if (now === str) {
      return dateFmt('hh:mm:ss', time);
    } else {
      return dateFmt('yyyy-MM-dd hh:mm:ss', time);
    }
  }
};
const strToDate = function (time) {
  // //兼容Safari转换时间 2019-03-02T01:19:12.000+0000 ---> 2019-03-02T01:19:12
  if (time.length > 19) {
    time = time.slice(0, time.indexOf('.'));
  }
  let date = new Date(time);
  //转换成时间戳
  let dateTime = date.getTime();
  return new Date(dateTime);
};
const currentDate = function () {
  let date = formatDate(new Date());
  let str = dateFmt('yyyy年MM月dd日 EEE', date.valueOf());
  return str;
};
const formatDate = function (date) {
  let myyear = date.getFullYear();
  let mymonth = date.getMonth() + 1;
  let myweekday = date.getDate();
  let h = date.getHours();
  let m = date.getMinutes();
  let s = date.getSeconds();
  if (mymonth < 10) {
    mymonth = '0' + mymonth;
  }
  if (myweekday < 10) {
    myweekday = '0' + myweekday;
  }
  return (myyear + '-' + mymonth + '-' + myweekday + ' ' + h + ':' + m + ':' + s);
};
export {
  dateFmt,
  currentDate,
  longTime
};
