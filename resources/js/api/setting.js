import request from '@/utils/request';

export function fetchListFaq(query) {
  return request({
    url: '/setting/faq',
    method: 'get',
    params: query,
  });
}

export function updateFaq(faq) {
  return request({
    url: '/setting/faq',
    method: 'post',
    data: faq,
  });
}

export function fetchListService(storeId) {
  return request({
    url: '/setting/service/' + storeId,
    method: 'get',
  });
}

export function updateService(storeId, service) {
  return request({
    url: '/setting/service/' + storeId,
    method: 'post',
    data: service,
  });
}

export function fetchListFee(storeId) {
  return request({
    url: '/setting/fee/' + storeId,
    method: 'get',
  });
}

export function updateFee(storeId, service) {
  return request({
    url: '/setting/fee/' + storeId,
    method: 'post',
    data: service,
  });
}

export function fetchPayments(merchantId) {
  return request({
    url: '/setting/payments/' + merchantId,
    method: 'get',
  });
}

export function fetchPaymentsOption(merchantId) {
  return request({
    url: '/setting/payment-options',
    method: 'get',
    params: {
      merchant_id: merchantId,
    },
  });
}

export function updatePayments(row) {
  return request({
    url: '/setting/payments',
    method: 'put',
    data: row,
  });
}

export function deletePayments(code, merchantId) {
  return request({
    url: '/setting/payments/' + merchantId + '/' + code,
    method: 'delete',
  });
}

export function fetchStorePaymentsOption(storeId) {
  return request({
    url: '/setting/payment-options',
    method: 'get',
    params: {
      store_id: storeId,
    },
  });
}

export function fetchStorePayments(storeId) {
  return request({
    url: '/setting/store-payments/' + storeId,
    method: 'get',
  });
}

export function updateStorePayments(row) {
  return request({
    url: '/setting/store-payments/',
    method: 'put',
    data: row,
  });
}

export function deleteStorePayments(code, storeId) {
  return request({
    url: '/setting/store-payments/' + storeId + '/' + code,
    method: 'delete',
  });
}
