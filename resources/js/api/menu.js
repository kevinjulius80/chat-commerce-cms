import request from '@/utils/request';

export function fetchListMenu(query) {
  return request({
    url: '/menu',
    method: 'get',
    params: query,
  });
}

export function createMenu(menu) {
  return request({
    url: '/menu',
    method: 'post',
    data: menu,
  });
}

export function updateMenu(menu) {
  return request({
    url: '/menu',
    method: 'put',
    data: menu,
  });
}

export function updateStockAndPrice(menu) {
  return request({
    url: '/menu/pricestock',
    method: 'put',
    data: menu,
  });
}

export function deleteMenu(id) {
  return request({
    url: '/menu/' + id,
    method: 'delete',
  });
}

export function getTemplateMenu(storeId) {
  return request({
    url: '/template-menu/' + storeId,
    method: 'get',
  });
}

export function uploadMenu(storeId, data) {
  return request({
    url: '/upload/' + storeId,
    method: 'post',
    data: data,
  });
}

export function deleteMenuMultiple(data) {
  return request({
    url: '/menu/multipleDelete',
    method: 'post',
    data: data,
  });
}
