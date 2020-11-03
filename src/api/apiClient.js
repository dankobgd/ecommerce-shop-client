import axios from 'axios';
import _ from 'lodash';

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

function checkTransformFormData(config, data) {
  if (config.skipTransformRequest) {
    return data;
  }

  const copyFormData = new FormData();

  // eslint-disable-next-line no-restricted-syntax
  for (const [name, value] of data) {
    if (typeof value === 'string') {
      copyFormData.append(_.snakeCase(name), value);
    } else {
      copyFormData.append(name, value);
    }
  }

  return copyFormData;
}

function checkTransformData(config, data) {
  if (config.skipTransformRequest) {
    return data;
  }
  const withISODate = Object.keys(data).reduce((acc, key) => {
    acc[key] = data[key] instanceof Date ? data[key].toISOString() : data[key];
    return acc;
  }, {});

  return transformKeysToSnakeCase(withISODate);
}

function transform(config, data) {
  if (!data) {
    return null;
  }

  let dataObject;

  if (data instanceof FormData) {
    dataObject = checkTransformFormData(config, data);
  } else {
    dataObject = checkTransformData(config, data);
  }

  return dataObject;
}

function request(method, url, config = {}, options = {}) {
  const { params, data, headers, maxContentLength } = config;

  return new Promise((resolve, reject) =>
    client
      .request({
        method,
        url: formatURL(url),
        params,
        data: transform(options, data),
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
  delete: (url, config, options) => request('DELETE', url, config, options),
};

export default apiClient;
