import request from '@/utils/request';

export function fetchStore() {
  return request({
    url: '/store',
    method: 'get',
  });
}

export function fetchStoreDeepLink(id){
  return request({
    url: '/store/' + id,
    method: 'get',
  });
}

export function fetchListStore(query) {
  return request({
    url: '/stores',
    method: 'get',
    params: query,
  });
}

export function createStore(store) {
  return request({
    url: '/store',
    method: 'post',
    data: store,
  });
}

export function updateStore(store) {
  return request({
    url: '/store',
    method: 'put',
    data: store,
  });
}

export function deleteStore(id) {
  return request({
    url: '/store/' + id,
    method: 'delete',
  });
}
