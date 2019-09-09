import api from '@/utils/api';

/**
 * create vue-resource's resource like object
 *
 * Default Actions
 *   get: {method: 'GET'}
 *   save: {method: 'POST'}
 *   query: {method: 'GET'}
 *   update: {method: 'PUT'}
 *   delete: {method: 'DELETE'}
 *
 * @param path the resource path
 * @param http axios instance
 * @param actions custom actions
 * @returns the resource object
 */
function resource(path, http, actions) {
  let obj = {
    get: id => http.get(path + '/' + id),
    save: obj => http.post(path, obj),
    query: params => http.get(path + '/query', {params}),
    update: (id, obj) => {
      let url = path + '/' + id;
      if (typeof (id) === 'object') {
        url = path;
        obj = id;
      }
      return http.put(url, obj);
    },
    delete: id => http.delete(path + '/' + id)
  };
  return Object.assign(obj, actions);
}

export const AddLogger = (tLogger) => {
  api.post('/api/logger', JSON.parse(JSON.stringify(tLogger)));
};
export const UserInfo = resource('/user/account', api, {
  getById: id => {
    return api.get('/api/user/account/' + id);
  }
});
export const account = resource('/api/account', api, {
  queryList:params => {
    return api.get('/api/account/query', {params});
  },
  getById: id => {
    return api.get('/api/account/select/' + id);
  },
  edit:(params) => {
    return api.post('/api/account/edit', Object.assign({}, params));
  },
  add:params => {
    return api.post('/api/account/add', Object.assign({}, params));
  },
  delete: id => {
    return api.delete('/api/account/delete/' + id);
  }
});

export const PermMenu = resource('/api/permission/menu', api, {
  queryList:params => {
    return api.get('/api/permission/menu/query', {params});
  },
  getById: id => {
    return api.get('/api/permission/menu/' + id);
  }
});

export const DataDict = resource('/api/dict', api, {
  getDictionaryByGroup: GroupName => {
    return api.get('/api/dict/query?dictionaryGroupName=' + GroupName);
  }
});

export const UserAccount = resource('/api/user/account', api, {});

export const Role = resource('/api/user/role', api, {});

export const UserDepartment= resource('/api/user/department', api, {
  queryAllUserByDepartment: params => {
    return api.get('/api/user/department/query/user', {params});
  }
});

export const RolePermission = resource('/api/user/role', api, {
  queryAllPermissionByRole: params => {
    return api.get('/api/user/role/query/permission', {params});
  },
  updateRolePermission: (path) => {
    return api.post('/api/user/role/update/permission?' + path);
  }
});
export const File = resource('/api/file', api, {
  queryCurrentUserFiles: params => {
    return api.get('/api/file/currentList', {params});
  },
  queryAllUserFiles: (params) => {
    return api.get('/api/file/query/pager', {params});
  }
});
export const Product = resource('/api/product', api, {
  queryPager: (params) => {
    return api.get('/api/product/query/pager', {params});
  }
});

export const Desk = resource('/api/desk', api, {
  queryPager: (params) => {
    return api.get('/api/desk/query/pager', {params});
  }
});
export const Address = resource('/api/address', api, {
  queryByUserId: (params) => {
    return api.get('/api/address/query', {params});
  }
});

export const Order = resource('/api/order', api, {
  queryPager: (params) => {
    return api.get('/api/order/query/pager', {params});
  },
  orderProductAdd: (params) => {
    return api.post('/api/order/product/add', params);
  },
  orderProductUpdate: (params) => {
    return api.put('/api/order/product/update', params);
  },
  orderProductDelete: (params) => {
    return api.delete('/api/order/product/delete', {params});
  },
  serving: (id) => {
    return api.post('/api/order/serving?orderId=' + id);
  },
  settle: (id) => {
    return api.post('/api/order/settle?orderId=' + id);
  },
  queryOrderGoodsByOrderId: (id) => {
    return api.get('/api/order/info?id=' + id);
  }
});
export const PHOTO = resource('/api/photo', api, {
  queryPager: (params) => {
    return api.get('/api/photo/query/pager', {params});
  }
});
export const SCHEDULE = resource('/api/schedule', api, {});
