import request from '@/utils/request';

export function fetchDashboard(storeId) {
  return request({
    url: '/dashboard/' + storeId,
    method: 'get',
  });
}

export function fetchCountEmptyStock(storeId) {
  return request({
    url: '/stock/countempty',
    method: 'get',
    params: {
      store_id: storeId,
    },
  });
}

export function fetchCountLowStock(storeId) {
  return request({
    url: '/stock/countthreshold',
    method: 'get',
    params: {
      store_id: storeId,
    },
  });
}

export function fetchCountNoSalesStock(storeId) {
  return request({
    url: '/stock/countnosales',
    method: 'get',
    params: {
      store_id: storeId,
    },
  });
}

export function OrderStatus(storeId) {
  return request({
    url: '/orders/countstatus/' + storeId,
    method: 'get',
  });
}
