import request from '@/utils/request';

/**
 * Simple RESTful resource class
 */
class Resource {
  constructor(uri) {
    this.uri = uri;
  }
  list(query) {
    return request({
      url: '/' + this.uri,
      method: 'get',
      params: query,
    });
  }
  get(id) {
    return request({
      url: '/' + this.uri + '/' + id,
      method: 'get',
    });
  }
  store(resource) {
    return request({
      url: '/' + this.uri,
      method: 'post',
      data: resource,
    });
  }
  update(id, resource) {
    return request({
      url: '/' + this.uri + '/' + id,
      method: 'put',
      data: resource,
    });
  }
  destroy(id) {
    return request({
      url: '/' + this.uri + '/' + id,
      method: 'delete',
    });
  }
  assignMerchantPermission(id) {
    return request({
      url: '/' + this.uri + '/assign-merchant-permission/' + id,
      method: 'put',
    });
  }
  revokeMerchantPermission(id) {
    return request({
      url: '/' + this.uri + '/revoke-merchant-permission/' + id,
      method: 'delete',
    });
  }
  assignStorePermission(id) {
    return request({
      url: '/' + this.uri + '/assign-store-permission/' + id,
      method: 'put',
    });
  }
  revokeStorePermission(id) {
    return request({
      url: '/' + this.uri + '/revoke-store-permission/' + id,
      method: 'delete',
    });
  }
}

export { Resource as default };
