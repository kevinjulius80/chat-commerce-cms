import request from '@/utils/request';

export function fetchListStoreCategory(query) {
  return request({
    url: '/store/category',
    method: 'get',
    params: query,
  });
}

export function createCategory(category) {
  return request({
    url: '/store/category',
    method: 'post',
    data: category,
  });
}
