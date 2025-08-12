import '@/bootstrap';

// Create axios instance
const service = window.axios.create({
  baseURL: process.env.MIX_BASE_API,
  timeout: 10000, // Request timeout
});

// Request intercepter
service.interceptors.request.use(
  (config) => {
    config.headers['x-api-key'] = process.env.MIX_API_KEY;
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
    return error.response;
  }
);

export default service;
