import request from '@/utils/request';
import requestForm from '@/utils/requestForm';

export function fetchList(query) {
  return request({
    url: '/orders',
    method: 'get',
    params: query,
  });
}

export function fetchOrder(referenceId) {
  const url = '/order/' + referenceId;
  return request({
    url: url,
    method: 'get',
  });
}

export function updatePayment(referenceId, status) {
  const data = {
    status: status,
  };
  return request({
    url: '/order/' + referenceId + '/payment',
    method: 'post',
    data: data,
  });
}

export function updateOrderStatus(referenceId, status) {
  const data = {
    status: status,
  };
  return request({
    url: '/order/' + referenceId + '/status',
    method: 'post',
    data: data,
  });
}

export function acceptOrder(referenceId) {
  return request({
    url: '/order/' + referenceId + '/accept',
    method: 'post',
  });
}

export function acceptOrders(data) {
  return requestForm({
    url: '/order/acceptorders',
    method: 'post',
    data: data,
  });
}

export function rejectOrder(referenceId) {
  return request({
    url: '/order/' + referenceId + '/reject',
    method: 'post',
  });
}

export function rejectOrders(data) {
  return requestForm({
    url: '/order/rejectorders',
    method: 'post',
    data: data,
  });
}

export function updateDelivery(referenceId) {
  return request({
    url: '/order/' + referenceId + '/delivery',
    method: 'post',
  });
}

export function createDeliveries(data) {
  return requestForm({
    url: '/order/createdeliveries',
    method: 'post',
    data: data,
  });
}

export function confirmCourier(referenceId){
  const data = {
    reference_id: referenceId,
  };
  return request({
    url: '/order/confirm-courier',
    method: 'post',
    data: data,
  });
}

export function rejectCourier(referenceId){
  const data = {
    reference_id: referenceId,
  };
  return request({
    url: '/order/cancel-courier',
    method: 'post',
    data: data,
  });
}
