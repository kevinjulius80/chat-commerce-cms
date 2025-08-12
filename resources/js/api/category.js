import request from '@/utils/request';

export function fetchListCategory(query) {
  return request({
    url: '/category',
    method: 'get',
    params: query,
  });
}

export function createCategory(category) {
  return request({
    url: '/category',
    method: 'post',
    data: category,
  });
}

export function updateCategory(category) {
  return request({
    url: '/category',
    method: 'put',
    data: category,
  });
}

export function deleteCategory(id) {
  return request({
    url: '/category/' + id,
    method: 'delete',
  });
}
