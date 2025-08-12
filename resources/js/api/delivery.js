import request from '@/utils/request';

export function fetchListDelivery(query) {
  return request({
    url: '/delivery',
    method: 'get',
    params: query,
  });
}

export function createDelivery(delivery) {
  return request({
    url: '/delivery',
    method: 'post',
    data: delivery,
  });
}

export function updateDelivery(delivery) {
  return request({
    url: '/delivery',
    method: 'put',
    data: delivery,
  });
}

export function deleteDelivery(id) {
  return request({
    url: '/delivery/' + id,
    method: 'delete',
  });
}
