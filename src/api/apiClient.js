import axios from 'axios';

import { transformKeysToCamelCase, transformKeysToSnakeCase } from '../utils/transformObjectKeys';

const client = axios.create({
  baseURL: 'http://localhost:3001/api/',
  headers: {
    'Content-Type': 'application/json; charset=UTF-8',
    Accept: 'application/json',
  },
  withCredentials: true,
  timeout: 4000,
});

function formatURL(url) {
  const adjusted = url[0] === '/' ? url.substring(1) : url;
  return adjusted;
}

function onSuccess(options, method, response) {
  if (options.raw || method === 'HEAD') {
    return response;
  }
  if (options.skipTransformResponse) {
    return response.data;
  }
  return transformKeysToCamelCase(response?.data);
}

function onError(options, error) {
  if (options.raw) {
    return error.response;
  }
  if (options.skipTransformResponse) {
    return error?.response?.data;
  }
  return transformKeysToCamelCase(error?.response?.data);
}

function transform(config, data) {
  if (!data) {
    return null;
  }

  let dataObject;
  if (config.skipTransformRequest) {
    dataObject = data;
  } else {
    dataObject = transformKeysToSnakeCase(data);
  }
  return dataObject;
}

function request(method, url, config = {}, options = {}) {
  const { params, data, headers, maxContentLength } = config;

  let dataObject;
  if (data instanceof FormData) {
    dataObject = data;
  } else {
    dataObject = transform(options, data);
  }

  return new Promise((resolve, reject) =>
    client
      .request({
        method,
        url: formatURL(url),
        params,
        data: dataObject,
        headers,
        maxContentLength,
      })
      .then(res => resolve(onSuccess(options, method, res)))
      .catch(err => reject(onError(options, err)))
  );
}

const apiClient = {
  get: (url, config, options) => request('GET', url, config, options),
  post: (url, config, options) => request('POST', url, config, options),
  put: (url, config, options) => request('PUT', url, config, options),
  patch: (url, config, options) => request('PATCH', url, config, options),
  del: (url, config, options) => request('DELETE', url, config, options),
};

export default apiClient;
