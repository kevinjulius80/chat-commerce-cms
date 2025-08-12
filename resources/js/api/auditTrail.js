import request from '@/utils/request';

export function search(query) {
  return request({
    url: '/audit-trail',
    method: 'get',
    params: query,
  });
}
