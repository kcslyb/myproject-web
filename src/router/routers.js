import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

const router = new Router({
  routes: [
    {path: '/login', name: 'login', component: () => import('../components/login/index')},
    {path: '/', name: 'home', redirect: '/home', hidden: true},
    {path: '*', redirect: '/404', hidden: true},
    {path: '/404', name: 'notFound', component: () => import('../components/404.vue')},
    {
      path: '/user/info/:userId',
      name: 'userInfo',
      perm: 'user-info',
      component: () => import('../components/user/userInfo.vue')
    },
    {path: '/play', name: 'play', perm: 'play-manage', component: () => import('../components/message/playpage.vue')},
    {
      path: '/test',
      name: 'socket-info',
      perm: 'socket-manager',
      component: () => import('../components/message/test-all.vue')
    },
    {
      path: '/home',
      component: () => ('../components/top.vue'),
      meta: {moduleId: 'home', title: '首页', icon: 'el-icon-location-outline', perm: 'home'},
      children: [
        {
          path: '/home',
          component: () => ('../components/message/info.vue'),
          meta: {moduleId: 'home', title: '主页', perm: 'home-main'}
        }
      ]
    },
    {
      path: '/account',
      component: () => ('../components/top.vue'),
      meta: {moduleId: 'account', title: '备忘录', icon: 'el-icon-edit-outline', perm: 'menu-account'},
      children: [
        // {
        //   path: '/system/leave',
        //   component: resolve => require(['../components/literature/recommendPoetry.vue'], resolve),
        //   meta: {moduleId: 'account', title: '日程', perm: 'system-leave'}
        // },
        {
          path: '/system/leave',
          component: () => import('../components/schedule/index.vue'),
          meta: {moduleId: 'account', title: '日程', perm: 'system-leave'}
        },
        {
          path: '/account/list',
          component: () => import('../components/account/index.vue'),
          meta: {moduleId: 'account', title: '备忘录', perm: 'account-list'}
        }
      ]
    },
    // {
    //   path: '/file',
    //   component: r => require.ensure([], () => r(require('../components/top.vue')), 'file'),
    //   meta: {moduleId: 'file', title: '文件管理', icon: 'el-icon-document', perm: 'menu-file'},
    //   children: [
    //     {
    //       path: '/file/list',
    //       component: resolve => require(['../components/file/file.vue'], resolve),
    //       meta: {moduleId: 'file', title: '文件列表', perm: 'file-list'}
    //     },
    //     {
    //       path: '/image/list',
    //       component: resolve => require(['../components/account/image/images.vue'], resolve),
    //       meta: {moduleId: 'file', title: '图片列表', perm: 'image-list'}
    //     }
    //   ]
    // },
    // {
    //   path: '/account',
    //   component: r => require.ensure([], () => r(require('../components/top.vue')), 'demo'),
    //   meta: {moduleId: 'system', title: '用户管理', icon: 'el-icon-menu', perm: 'menu-system'},
    //   children: [
    //     {
    //       path: '/account/user',
    //       component: resolve => require(['../components/account/user/account.vue'], resolve),
    //       meta: {moduleId: 'user', title: '用户列表', perm: 'user-list'}
    //     },
    //     {
    //       path: '/account/role',
    //       component: resolve => require(['../components/account/role/role.vue'], resolve),
    //       meta: {moduleId: 'user', title: '角色列表', perm: 'role-list'}
    //     },
    //     {
    //       path: '/account/permission',
    //       component: resolve =>  require(['../components/account/permissiontree/permissiontree.vue'], resolve),
    //       meta: {moduleId: 'user', title: '权限列表', perm: 'perm-list'}
    //     }
    //   ]
    // },
    // // {
    // //   path: '/user',
    // //   component: r => require.ensure([], () => r(require('../components/top.vue')), 'demo'),
    // //   meta: {moduleId: 'system', title: '用户管理', icon: 'el-icon-menu', perm: 'menu-system'},
    // //   children: [
    // //     {
    // //       path: '/user/list',
    // //       component: resolve => require(['../components/user/userlist.vue'], resolve),
    // //       meta: {moduleId: 'user', title: '用户列表', perm: 'user-list'}
    // //     },
    // //     {
    // //       path: '/role/list',
    // //       component: resolve => require(['../components/user/role/rolelist.vue'], resolve),
    // //       meta: {moduleId: 'user', title: '角色列表', perm: 'role-list'}
    // //     },
    // //     {
    // //       path: '/menu/list',
    // //       component: resolve => require(['../components/user/permission/permissionlist.vue'], resolve),
    // //       meta: {moduleId: 'user', title: '菜单权限', perm: 'menu-list'}
    // //     },
    // //     {
    // //       path: '/perm/list',
    // //       component: resolve =>  require(['../components/account/permissiontree/permissiontree.vue'], resolve),
    // //       meta: {moduleId: 'user', title: '权限列表', perm: 'perm-list'}
    // //     }
    // //   ]
    // // },
    // {
    //   path: '/system',
    //   component: r => require.ensure([], () => r(require('../components/top.vue')), 'demo'),
    //   meta: {moduleId: 'system', title: '系统设置', icon: 'el-icon-setting', perm: 'menu-system'},
    //   children: [
    //     {
    //       path: '/system/dict',
    //       component: resolve => require(['../components/dict/dictionary.vue'], resolve),
    //       meta: {moduleId: 'system', title: '数据字典', perm: 'system-dict'}
    //     },
    //     {
    //       path: '/system/note',
    //       component: resolve => require(['../components/note/note.vue'], resolve),
    //       meta: {moduleId: 'system', title: '公告管理', perm: 'system-note'}
    //     },
    //     {
    //       path: '/system/log',
    //       component: resolve => require(['../components/log/log.vue'], resolve),
    //       meta: {moduleId: 'system', title: '系统日志', perm: 'system-log'}
    //     }
    //   ]
    // },
    // {
    //   path: '/order',
    //   component: r => require.ensure([], () => r(require('../components/top.vue')), 'demo'),
    //   meta: {moduleId: 'purchase', title: '系统服务', icon: 'el-icon-rank', perm: 'menu-order'},
    //   children: [
    //     {
    //       path: '/order/main',
    //       component: resolve => require(['../components/product/todolist.vue'], resolve),
    //       meta: {moduleId: 'purchase', title: '点餐首页', perm: 'main-manager'}
    //     },
    //     {
    //       path: '/order/list',
    //       component: resolve => require(['../components/order/orderlist.vue'], resolve),
    //       meta: {moduleId: 'purchase', title: '订单列表', perm: 'order-manager'}
    //     },
    //     {
    //       path: '/order/product',
    //       component: resolve => require(['../components/product/productmanager.vue'], resolve),
    //       meta: {moduleId: 'purchase', title: '菜品管理', perm: 'product-manager'}
    //     },
    //     {
    //       path: '/order/desk',
    //       component: resolve => require(['../components/desk/desklist.vue'], resolve),
    //       meta: {moduleId: 'purchase', title: '座位管理', perm: 'desk-manager'}
    //     }
    //   ]
    // }
  ]
});
export default router
