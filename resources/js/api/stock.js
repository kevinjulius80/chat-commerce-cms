import request from '@/utils/request';

export function fetchEmptyStock(query) {
  return request({
    url: '/stock/empty',
    method: 'get',
    params: query,
  });
}

export function fetchLowStock(query) {
  return request({
    url: '/stock/threshold',
    method: 'get',
    params: query,
  });
}

export function fetchNoSalesStock(query) {
  return request({
    url: '/stock/nosales',
    method: 'get',
    params: query,
  });
}

export function fetchSettingStock(query) {
  return request({
    url: '/stock/setting',
    method: 'get',
    params: query,
  });
}

export function setSettingStock(updateSetting) {
  return request({
    url: '/stock/setting',
    method: 'post',
    data: updateSetting,
  });
}
