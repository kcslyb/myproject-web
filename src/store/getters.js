const getters = {
  sidebar: state => state.app.sidebar,
  visitedViews: state => state.app.visitedViews,

  userName: state => state.user.userName,
  userId: state => state.user.userId,
  avatar: state => state.user.avatar,
  role: state => state.user.roleName,
  menus: state => state.user.menus,
  permissions: state => state.user.permissions,

  permissionRouters: state => state.permission.routers,
  addRouters: state => state.permission.addRouters
};
export default getters
