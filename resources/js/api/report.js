import request from '@/utils/request';

export function fetchReport(query) {
  return request({
    url: '/report',
    method: 'get',
    params: query,
  });
}

export function fetchUser(query) {
  return request({
    url: '/store_user',
    method: 'get',
    params: query,
  });
}
