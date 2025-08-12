import request from '@/utils/request';

export function fetchMerchant() {
  return request({
    url: '/merchant',
    method: 'get',
  });
}

export function getMerchant(id) {
  return request({
    url: '/merchant/' + id,
    method: 'get',
  });
}

export function refreshWebhook(id) {
  return request({
    url: '/merchant/' + id + '/refresh-webhook',
    method: 'patch',
  });
}

export function fetchListMerchant(query) {
  return request({
    url: '/merchants',
    method: 'get',
    params: query,
  });
}

export function createMerchant(merchant) {
  return request({
    url: '/merchant',
    method: 'post',
    data: merchant,
  });
}

export function updateMerchant(merchant) {
  return request({
    url: '/merchant',
    method: 'put',
    data: merchant,
  });
}

export function deleteMerchant(id) {
  return request({
    url: '/merchant/' + id,
    method: 'delete',
  });
}
