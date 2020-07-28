import axios from 'axios';

import { transformKeysToCamelCase, transformKeysToSnakeCase } from './helpers';

const host = 'http://localhost:3001';

const client = axios.create({
  baseURL: `${host}/api/`,
  headers: {
    'Content-type': 'application/json; charset=UTF-8',
    Accept: 'application/json',
  },
  withCredentials: true,
  timeout: 5000,
});

function formatURL(url) {
  const adjusted = url[0] === '/' ? url.substring(1) : url;
  return adjusted;
}

function request(method, url, payload = {}, options = {}) {
  const { params, data, headers, maxContentLength } = payload;
  const { raw = false, skipTransform = false } = options;

  let dataObject;
  if (skipTransform) {
    dataObject = data;
  } else {
    dataObject = transformKeysToSnakeCase(data);
  }

  const onSuccess = response => {
    if (raw || method === 'HEAD') {
      return response;
    }
    if (skipTransform) {
      return response.data;
    }
    return transformKeysToCamelCase(response.data);
  };

  const onError = error => {
    if (raw) {
      return error.response;
    }
    if (skipTransform) {
      return error.response.data;
    }
    return transformKeysToCamelCase(error.response.data);
  };

  return new Promise((resolve, reject) => {
    const requestOptions = {
      method,
      url: formatURL(url),
      params,
      data: dataObject,
      headers,
      maxContentLength,
    };

    return client
      .request(requestOptions)
      .then(res => resolve(onSuccess(res)))
      .catch(err => reject(onError(err)));
  });
}

const apiClient = {
  get: (url, payload, options) => request('GET', url, payload, options),
  post: (url, payload, options) => request('POST', url, payload, options),
  put: (url, payload, options) => request('PUT', url, payload, options),
  patch: (url, payload, options) => request('PATCH', url, payload, options),
  del: (url, payload, options) => request('DELETE', url, payload, options),
  head: (url, payload, options) => request('HEAD', url, payload, options),
};

export default apiClient;
