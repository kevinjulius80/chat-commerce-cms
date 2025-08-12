import request from '@/utils/request';
import requestAuth from '@/utils/requestAuth';

export function login(data) {
  return request({
    url: '/auth/login',
    method: 'post',
    data: data,
  });
}

export function resetPassword(email) {
  return request({
    url: '/auth/reset-password',
    method: 'post',
    data: email,
  });
}

export function changeResetPassword(password) {
  return request({
    url: '/auth/change-reset-password',
    method: 'post',
    data: password,
  });
}

export function getInfo(token) {
  return request({
    url: '/user',
    method: 'get',
  });
}

export function logout() {
  return request({
    url: '/auth/logout',
    method: 'post',
  });
}

export function csrf() {
  return request({
    url: '/sanctum/csrf-cookie',
    method: 'get',
  });
}

export function loginAuthService() {
  return requestAuth({
    url: '/auth-service/login',
    method: 'post',
  });
}
