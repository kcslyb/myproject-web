import Vue from 'vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App'
import VueResource from 'vue-resource'
import router from './router/routers'
import store from './store'
import api from './utils/api'
import {socketUtil} from './utils/socket';
import '@/permission' // 权限
import moment from "moment";

import {dateFmt, currentDate} from './utils/data-utils'
import {screenWith, screenHeight} from './utils/screenUtill'
import { DataDict } from './api/resources';

// 引入自定义组件
import customComponent from './components/common/custom';
Vue.use(customComponent);

// 引入echarts
import echarts from 'echarts'

Vue.use(ElementUI);
Vue.use(VueResource);

// 全局的常量
Vue.prototype.$echarts = echarts;
Vue.prototype.$socket = socketUtil;
Vue.prototype.$api = api;
Vue.prototype.$dateFmt = dateFmt;
Vue.prototype.$nowDateTime = currentDate;
Vue.prototype.$screenWith = screenWith;
Vue.prototype.$screenHeight = screenHeight;
Vue.prototype.$HOST = '/api';

Vue.prototype.$moment = moment;
moment.locale('zh-cn');

//全局函数
/**
 * 替换url
 */
Vue.prototype.$HOSTURL = (url) => {
  if (url && url.length > 0) {
    let arrUrl = url.split("//");
    let start = arrUrl[1].indexOf("/");
    let relUrl = arrUrl[1].substring(start);
    let hostUrl = window.location.origin;
    return hostUrl + relUrl;
  }
  return url;
};
/**
 * 替换url
 */
Vue.prototype.$REPLACEURL = (url) => {
  if (url && url.length > 0) {
    let start = url.indexOf("static");
    let relUrl = url.substring(start, url.length -4);
    let type = url.substring(url.length -4);
    switch (type) {
      case '.jpg':
        // return url.substring(start);
        return require('../' + relUrl + '.jpg');
      case '.png':
        // return url.substring(start);
        return require('../' + relUrl + '.png');
      default:
        return url;
    }
  }
  return url;
};

/**
 * 判断对象是否存在某个属性值
 *
 * @param value
 * @param k
 * @returns {boolean}
 */
Vue.prototype.$isInclude = (value, k) => {
  let flag = false;
  Object.keys(value).forEach((o) => {
    if (value[o] !== null && typeof value[o] === 'object') {
      flag = Vue.prototype.$isInclude( value[o], k);
    }else {
      if (value[o] === k) {
        flag = true;
      }
    }
  });
  return flag;
};
/**
 * 去除数组中包含key的项
 *
 * @param list
 * @param key
 */
Vue.prototype.$removeListByKey = (list, key) => {
  let start = 0;
  let end = 0;
  list.forEach((value, index) => {
    if (typeof value === 'object') {
      if (Vue.prototype.$isInclude(value, key)) {
        start = index;
        end = 1;
      }
    } else if (typeof value === 'string') {
      if (value === key) {
        start = index;
        end = 1;
      }
    }
  });
  return list.splice(start, end);
};
/**
 * 格式化时间函数
 *
 * @param array
 * @param index
 * @returns {String}
 */
Vue.prototype.$formatArrayToDateTime= function(array, index) {
  return Array.isArray(array) && array[index] ? this.$moment(array[index]).format('YYYY-MM-DD HH:mm:ss') : '';
};
/**
 * 格式化时间函数
 *
 * @param formatString
 * @returns {String}
 */
Vue.prototype.$formatStringtoDateTime = function (formatString) {
  if (formatString){
    return this.$moment(formatString).format('YYYY-MM-DD HH:mm:ss');
  }else {
    return '';
  }
};
/**
 * 根据数据字典组名获取数据字典项
 *
 * @param {String} groupName 数据字典组名称
 * @returns {Promise} 返回promise对象
 */
Vue.prototype.$getDictionaryByGroup = async function (groupName) {
  if (!groupName) return [];
  const state = this.$store.state.app;
  if (state.dictGroup[groupName]) {
    return state.dictGroup[groupName];
  } else {
    await DataDict.getDictionaryByGroup(groupName).then((res) => {
      state.dictGroup[groupName] = res[0].dictionaries;
      this.$store.commit('SET_DICT_GROUP', state.dictGroup);
    });
    return state.dictGroup[groupName];
  }
};
/**
 * 根据数组字段筛选数组
 *
 * @param dataList 需要筛选的数组
 * @param conditions 需要筛选的数组字段，为数组中对象的属性名 例如['objId', 'objName']
 * @param filterString 筛选字符串
 * @returns {Array} 返回过滤后的数组
 */
Vue.prototype.$filterListOfString = function (dataList, conditions, filterString){
  let state = this.$store.state.app;
  let conditionString = '';
  conditions.forEach((value) => {
    conditionString = conditionString + value;
  });
  if (!state.searchDto[conditionString]) {
    state.searchDto[conditionString] = dataList.slice(0);
    this.$store.commit('SET_SEARCH_DTO', state.searchDto);
  }
  if (filterString !== '') {
    return state.searchDto[conditionString].filter(val => {
      let filterValue = '';
      conditions.forEach(value => {
        filterValue += val[value];
      });
      return filterValue.indexOf(filterString) > -1;
    });
  } else {
    return state.searchDto[conditionString];
  }
};
/**
 * 根据数组对象字段筛选数组
 *
 * @param dataList 需要筛选的数组
 * @param object 数组对象名
 * @param conditions 需要筛选的数组字段，为数组中对象的属性名 例如['objId', 'objName']
 * @param filterString 筛选字符串
 * @returns {Array} 返回过滤后的数组
 */
Vue.prototype.$filterListOfObj = function (dataList, object, conditions, filterString){
  let state = this.$store.state.app;
  let conditionString = '';
  conditions.forEach(value => {
    conditionString = conditionString + value;
  });
  if (!state.searchDto[conditionString]) {
    state.searchDto[conditionString] = dataList.slice(0);
    this.$store.commit('SET_SEARCH_DTO', state.searchDto);
  }
  if (filterString !== '') {
    return state.searchDto[conditionString].filter(val => {
      let filterValue = '';
      let dto = val[object];
      conditions.forEach(value => {
        filterValue += dto[value];
      });
      return filterValue.indexOf(filterString) > -1;
    });
  } else {
    return state.searchDto[conditionString];
  }
};

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
