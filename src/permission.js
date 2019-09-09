import router from './router/routers';
import store from './store';
import NProgress from 'nprogress'; // Progress 进度条
import 'nprogress/nprogress.css'; // Progress 进度条样式
import {getToken} from '@/utils/auth'; // 验权
const whiteList = ['/login', '/404', '/project']; // 白名单,不需要登录的路由
router.beforeEach((to, from, next) => {
  NProgress.start();
  // alert(getToken)
  if (getToken() && getToken() === '1') {
    let logger = {
      logAccessType: to.meta.title,
      logAccessUrl: to.path
    };
    // AddLogger(logger);
    // 如果已经登录
    let permissionPath = store.getters.menus;
    let toPath = '';
    if (to.path.length > 20) {// /user/info/JonQoOLlcZRWfnpcACS ---->user/info
      toPath = to.path.substring(0, to.path.length-20);
    }
    if (to.path === '/login') {
      next({path: '/'});
      NProgress.done() // 结束Progress
      // } else if (!store.getters.role) {
      //   store.dispatch('GetInfo').then((res) => {
      //     next({...to})
      //   }).catch( ()=> {
      //     NProgress.done();
      //   })
    } else if (whiteList.indexOf(to.path) !== -1) {// 如果前往的路径是白名单内的,就可以直接前往
      next()
    } else if (permissionPath.indexOf(to.path) !== -1 || permissionPath.indexOf(toPath)) {// 判断是否有访问该路径的权限
      next()
    } else {
      next(false);
      NProgress.done() // 结束Progress
    }
  } else if (whiteList.indexOf(to.path) !== -1) {// 如果前往的路径是白名单内的,就可以直接前往
    next();
    NProgress.done()
  } else {// 如果路径不是白名单内的,而且又没有登录,就跳转登录页面
    next('/login');
    NProgress.done() // 结束Progress
  }
});
router.afterEach(() => {
  NProgress.done() // 结束Progress
});
