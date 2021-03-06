import Cookies from 'js-cookie';

const app = {
  state: {
    fileUploadPath: 'http://127.0.0.1:8018/api/file/upload',
    bodyHeight: 0,
    windowSize: {width: 1000, height: 500},
    sidebar: {
      opened: !+Cookies.get('sidebarStatus')
    },
    visitedViews: [],
    dictGroup: {},
    searchDto: {},
    logger: {
      logRequestDescribe: '',
      logRequestPageName: ''
    }
  },
  mutations: {
    SET_LOGGER: (state, date) => {
      state.logger = Object.assign({}, state.logger, date);
    },
    SET_FILE_UPLOAD_PATH: (state, date) => {
      state.fileUploadPath = date;
    },
    SET_SEARCH_DTO: (state, date) => {
      state.searchDto = date;
    },
    SET_DICT_GROUP: (state, date) => {
      state.dictGroup = date;
    },
    SET_BODY_HEIGHT: (state, data) => {
      state.bodyHeight = data.height;
      state.windowSize = data.window;
    },
    TOGGLE_SIDEBAR: state => {
      if (state.sidebar.opened) {
        Cookies.set('sidebarStatus', 1)
      } else {
        Cookies.set('sidebarStatus', 0)
      }
      state.sidebar.opened = !state.sidebar.opened
    },
    ADD_VISITED_VIEWS: (state, view) => {
      if (state.visitedViews.some(v => v.path === view.path)) return;
      state.visitedViews.push({ name: view.name, path: view.path })
    },
    DEL_VISITED_VIEWS: (state, view) => {
      let index;
      for (const [i, v] of state.visitedViews.entries()) {
        if (v.path === view.path) {
          index = i;
          break
        }
      }
      state.visitedViews.splice(index, 1)
    }
  },
  actions: {
    ToggleSideBar ({ commit }) {
      commit('TOGGLE_SIDEBAR')
    },
    addVisitedViews ({ commit }, view) {
      commit('ADD_VISITED_VIEWS', view)
    },
    delVisitedViews ({ commit, state }, view) {
      return new Promise((resolve) => {
        commit('DEL_VISITED_VIEWS', view);
        resolve([...state.visitedViews])
      })
    }
  }
};

export default app
