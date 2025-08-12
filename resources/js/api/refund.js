// import requestDirect from '@/utils/requestDirect';
import request from '@/utils/request';

export function RefundVA(query) {
  return request({
    url: '/refund-va',
    method: 'get',
    params: query,
  });
}

export function RefundEW(query) {
  return request({
    url: '/refund-ew',
    method: 'get',
    params: query,
  });
}

export function approveRefund(referenceId) {
  return request({
    url: '/refund/' + referenceId,
    method: 'post',
    data: [],
  });
}
