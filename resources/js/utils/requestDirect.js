import '@/bootstrap';
import { Message } from 'element-ui';
import { setLogged } from './auth';

// Create axios instance
const service = window.axios.create({
  baseURL: process.env.MIX_BASE_API,
  timeout: 10000, // Request timeout
});

// Request intercepter
service.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    config.headers['Authorization'] = 'Bearer ' + token; // Set JWT token
    return config;
  },
  (error) => {
    // Do something with request error
    // console.log('masuk error di request');
    console.log('error'); // for debug
    console.log(error); // for debug
    Promise.reject(error);
  }
);

// response pre-processing
service.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    let message = error.message;
    if (error.response.data && error.response.data.errors) {
      message = error.response.data.errors;
    } else if (error.response.data && error.response.data.error) {
      message = error.response.data.error;
    }

    if (message.includes('username dan password tidak cocok')) {
      Message({
        message: message,
        type: 'error',
        duration: 5 * 1000,
      });
      return Promise.reject(error);
    }

    if (error.response.status === 401 || error.response.status === 419) {
      localStorage.setItem('isSessionExpired', true);
      setLogged('0');
      location.reload();
      return Promise.reject(error);
    }

    return error.response;
  }
);

export default service;
