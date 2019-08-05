import router from '@/router/routers'

/**
 * 判断用户是否拥有此菜单
 *
 * @param menus
 * @param route
 */
function hasPermission (route, menus) {
  if (menus.indexOf(route.meta.perm) > -1) {
    /*
    * 如果这个路由有perm属性,就需要判断用户是否拥有此menu权限
    */
    return true
  } else {
    return false
  }
}

/**
 * 递归过滤异步路由表，返回符合用户菜单权限的路由表
 *
 * @param router
 * @param menus
 */
function filterAsyncRouter (router, menus) {
  const accessedRouters = router.filter(route => {
    // filter,js语法里数组的过滤筛选方法
    if (hasPermission(route, menus)) {
      if (route.children && route.children.length) {
        // 如果这个路由下面还有下一级的话,就递归调用
        route.children = filterAsyncRouter(route.children, menus)
        // 如果过滤一圈后,没有子元素了,这个父级菜单就也不显示了
        return (route.children && route.children.length)
      }
      return true
    }
    return false
  });
  return accessedRouters
}

const permission = {
  state: {
    routers: router.options.routes, // 本用户所有的路由,包括了固定的路由和下面的addRouters
    addRouters: [] // 本用户的角色赋予的新增的动态路由
  },
  mutations: {
    SET_ROUTERS: (state, accessedRouters) => {
      state.addRouters = accessedRouters;
      // console.info(state.addRouters);
      // state.routers = router.concat(routers) // 将固定路由和新增路由进行合并, 成为本用户最终的全部路由信息
    }
  },
  actions: {
    GenerateRoutes ({commit}, data) {
      // 生成路由
      return new Promise(resolve => {
        // roles是后台传过来的角色数组,比如['管理员']
        const role = data.roleName;
        const menus = data.permissions;
        // 声明该角色可用的路由
        let accessedRouters = [];
        let routList = [];
        permission.state.routers.forEach(route => {
          if (route.children) {
            accessedRouters.push(route);
          }
        });
        // 如果角色里包含'SuperAdmin',那么所有的路由都可以用
        // 其实管理员也拥有全部菜单,这里主要是利用角色判断,节省加载时间
        if (role !== 'SuperAdmin') {
          routList = filterAsyncRouter(accessedRouters, menus)
        } else {
          routList = accessedRouters;
        }
        // 执行设置路由的方法
        commit('SET_ROUTERS', routList);
        resolve()
      })
    }
  }
};
export default permission
