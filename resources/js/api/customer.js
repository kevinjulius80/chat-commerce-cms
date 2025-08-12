import request from '@/utils/request';

export function fetchCustomer(query) {
  return request({
    url: '/customer',
    method: 'get',
    params: query,
  });
}

export function getCustomer(id) {
  return request({
    url: '/customer/' + id,
    method: 'get',
  });
}

