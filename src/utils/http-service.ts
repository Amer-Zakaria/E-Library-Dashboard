import axios from 'axios';
import { toast } from 'react-toastify';

import { getRouter } from './router-services';
import { getToken, removeToken, getTokenExperationDateInMSec } from './token';

export const baseURL = import.meta.env.VITE_API_URL;

axios.defaults.baseURL = baseURL;

// Don't send if token is epxired
axios.interceptors.request.use(
  (config) => {
    const source = axios.CancelToken.source();
    config.cancelToken = source.token;

    const accessToken = getToken();

    const isAccessTokenExpired = accessToken
      ? accessToken
        ? Date.now() > getTokenExperationDateInMSec() - 60 * 1000 //-1m
        : true
      : false;

    if (isAccessTokenExpired) {
      getRouter()?.push('/sign-in', { state: { from: getRouter()?.getLocation() } });
      toast.error(`Your session has expired, please sign in again!`);
      source.cancel('Access token expired');
      removeToken();
    } else {
      config.headers['x-auth-token'] = accessToken;
    }

    return config;
  },
  (err) => Promise.reject(err)
);

axios.interceptors.response.use(
  (response) => response?.data,
  // Handle response errors (token issue, generic errors, custom errors)
  async (error) => {
    const isExpectedError =
      error.response && error.response?.status >= 400 && error.response?.status < 500;

    let isHandlingAuthError = false;
    if (error.response?.status === 401 || error.response?.data?.message === 'Invalid token.') {
      if (isHandlingAuthError) return Promise.reject(error);
      isHandlingAuthError = true;
      getRouter()?.push('/sign-in', { state: { from: getRouter()?.getLocation() } });
      removeToken();
      toast.error('Please try to sign in again!');
    } else if (error.response?.status === 403) toast.error('Forbidden!');
    else if (error.response?.status === 404) toast.error('Not Found!');
    else if (error.response?.status === 429) toast.error(error.response?.data?.message);
    else if (error.response?.status === 400) toast.error(error.response?.data?.message);
    else if (!isExpectedError) toast.error('An unexpected error occurrred.');

    return Promise.reject(error?.response?.data || error);
  }
);

const http = {
  get: axios.get,
  post: axios.post,
  patch: axios.patch,
  put: axios.put,
  delete: axios.delete,
};

export default http;
