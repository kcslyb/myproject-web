import store from '../store'

/**
 * 判断是否拥有指定权限
 *
 * @param permission
 * @returns {boolean}
 */
export function hasPermission (permission) {
  let myPermissions = store.getters.permissions;
  return myPermissions.indexOf(permission) > -1;
}
