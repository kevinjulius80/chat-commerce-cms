import request from '@/utils/request';
import Resource from '@/api/resource';

class UserResource extends Resource {
  constructor() {
    super('users');
  }

  permissions(id) {
    return request({
      url: '/' + this.uri + '/' + id + '/permissions',
      method: 'get',
    });
  }

  updatePermission(id, permissions) {
    return request({
      url: '/' + this.uri + '/' + id + '/permissions',
      method: 'put',
      data: permissions,
    });
  }

  changeStatus(id, data) {
    return request({
      url: '/' + this.uri + '/' + id + '/change-status',
      method: 'put',
      data: data,
    });
  }
}

export function changePassword(data) {
  return request({
    url: '/change-password',
    method: 'post',
    data: data,
  });
}

export { UserResource as default };
