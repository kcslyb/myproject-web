import {removeToken, setToken} from '@/utils/auth'
import {default as api} from '../../utils/api'
import store from '../../store'

const user = {
  state: {
    userName: '',
    userId: '',
    avatar: '',
    roleName: '',
    userPhone: '',
    userEmail: '',
    menus: [],
    permissions: []
  },
  mutations: {
    SET_USER: (state, userInfo) => {
      state.userName = userInfo.userName;
      state.avatar = userInfo.userAvatar;
      state.userId = userInfo.userId;
      state.roleName = userInfo.roleName;
      state.userPhone = userInfo.userPhone;
      state.userEmail = userInfo.userEmail;
      state.menus = userInfo.menus;
      state.permissions = userInfo.permissions;
    },
    RESET_USER: (state) => {
      state.userName = '';
      state.avatar = '';
      state.userId = '';
      state.roleName = '';
      state.userPhone = '';
      state.userEmail = '';
      state.menus = '';
      state.permissions = '';
    }
  },
  actions: {
    // 登录
    Login ({commit, state}, loginForm) {
      return new Promise((resolve, reject) => {
        api({
          url: '/api/login',
          method: 'post',
          data: loginForm
        }).then(data => {
          if (data.status === '200') {
            // cookie中保存前端登录状态
            setToken();
          }
          resolve(data)
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 获取用户信息
    GetInfo ({commit, state}) {
      return new Promise((resolve, reject) => {
        api({
          url: '/api/getInfo',
          method: 'post'
        }).then(data => {
          if (data) {
            // 储存用户信息
            commit('SET_USER', data);
            // cookie保存登录状态,仅靠vuex保存的话,页面刷新就会丢失登录状态
            setToken();
            // 生成路由
            store.dispatch('GenerateRoutes', data).then(() => {
              // 生成该用户的新路由json操作完毕之后,调用vue-router的动态新增路由方法,将新路由添加
              // router.addRoutes(store.getters.addRouters)
            });
            resolve(data)
          } else {
            return null
          }
        }).catch(error => {
          // console.info(error);
          reject(error)
        })
      })
    },
    // 登出
    LogOut ({commit}) {
      return new Promise((resolve) => {
        api({
          url: '/api/logout',
          method: 'post'
        }).then(data => {
          commit('RESET_USER');
          removeToken();
          resolve(data)
        }).catch(() => {
          commit('RESET_USER');
          removeToken()
        })
      })
    },
    // 前端 登出
    FedLogOut ({commit}) {
      return new Promise(resolve => {
        commit('RESET_USER')
        removeToken()
        resolve()
      })
    }
  }
}
export default user
