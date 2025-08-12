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
    config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
    // config.headers['Content-Type'] = 'multipart/form-data; ------WebKitFormBoundaryTiPBVqew1aCckre6';
    // config.headers['Accept'] = 'application/json';
    // config.headers['x-api-key'] = process.env.MIX_API_KEY;
    console.log(config);
    return config;
  },
  (error) => {
    // Do something with request error
    // console.log('masuk error di request');
    console.log(error); // for debug
    Promise.reject(error);
  }
);

// response pre-processing
service.interceptors.response.use(
  (response) => {
    // if (response.headers.authorization) {
    //   setLogged(response.headers.authorization);
    //   response.data.token = response.headers.authorization;
    // }

    return response.data;
  },
  (error) => {
    let message = error.message;
    if (error.response.data && error.response.data.errors) {
      message = error.response.data.errors;
    } else if (error.response.data && error.response.data.error) {
      message = error.response.data.error;
    }

    if (!message.includes('username dan password tidak cocok') && !message.includes('Unauthorized Auth Service')) {
      if (error.response.status === 401 || error.response.status === 419) {
        localStorage.setItem('isSessionExpired', true);
        location.reload();
        setLogged(0);
        return Promise.reject(error);
      }
    }

    Message({
      message: message,
      type: 'error',
      duration: 5 * 1000,
    });

    return Promise.reject(error);
  }
);

export default service;
