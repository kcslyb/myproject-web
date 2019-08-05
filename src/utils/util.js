/* util.js */

/**
 * 防抖函数
 * @param func 用户传入的函数
 * @param wait 等待的时间
 * @param immediate 是否立即执行
 * @return {Function}
 */
const debounce = function (func,wait = 3000,immediate = false) {
  // 缓存一个定时器id
  let timer = null;
  let result;
  // 这里返回的函数是每次用户实际调用的防抖函数
  return function(...args){
    // 如果已经设定过定时器了就清空上一次的定时器
    if(timer) clearTimeout(timer);
    if(immediate){
      let callNow = !timer;
      //等待wait的时间间隔后，timer为null的时候，函数才可以继续执行
      timer = setTimeout(()=>{
        timer = null;
      },wait);
      //未执行过，执行
      if(callNow) result = func.apply(this,args);
    }else{
      // 开始一个定时器，延迟执行用户传入的方法
      timer = setTimeout(()=>{
        //将实际的this和参数传入用户实际调用的函数
        func.apply(this,args);
      },wait);
    }
    return result;
  }
};

/**
 * 截流函数
 * @param func 用户传入的函数
 * @param wait 等待的时间
 * @returns {Function}
 */
const throttle = function(func, wait = 3000) {
  let last, deferTimer;
  return function() {
    let that = this;
    let _args = arguments;
    // +new Date() 将会调用 Date.prototype上的 valueOf()方法
    let now = +new Date();
    if (last && now < last + wait) {
      clearTimeout(deferTimer);
      deferTimer = setTimeout(function () {
        last = now;
        func.apply(that, _args)
      }, wait)
    }else {
      last = now;
      func.apply(that,_args)
    }
  }
};

/**
 * 产生随机整数，包含下限值，包括上限值
 * @param {Number} lower 下限
 * @param {Number} upper 上限
 * @return {Number} 返回在下限到上限之间的一个随机整数
 */
const random = function (lower, upper) {
  lower = Math.floor(lower);
  upper = Math.ceil(upper);
  return Math.floor(Math.random() * (upper - lower+1)) + lower;
};

/**
 * 产生一个随机的rgb颜色
 * @return {String}  返回颜色rgb值字符串内容，如：rgb(201, 57, 96)
 */
const randomColor = function () {
  // 随机生成 rgb 值，每个颜色值在 0 - 255 之间
  let r = random(0, 256),
      g = random(0, 256),
      b = random(0, 256);
  // 连接字符串的结果
  return 'rgb(' + r + ',' + g + ',' + b + ')';
};

export {
  debounce,
  throttle,
  randomColor,
  random
}
