import _ from 'lodash';

export function transformKeysToSnakeCase(obj) {
  return _.transform(obj, (acc, value, key, target) => {
    const camelKey = _.isArray(target) ? key : _.snakeCase(key);

    acc[camelKey] = _.isObject(value) ? transformKeysToSnakeCase(value) : value; // eslint-disable-line
  });
}

export function transformKeysToCamelCase(obj) {
  return _.transform(obj, (acc, value, key, target) => {
    const camelKey = _.isArray(target) ? key : _.camelCase(key);

    acc[camelKey] = _.isObject(value) ? transformKeysToCamelCase(value) : value; // eslint-disable-line
  });
}

export function transformValuesToNumbers(obj, keysArr) {
  return Object.keys(obj).reduce((acc, key) => {
    acc[key] = keysArr.includes(key) ? Number.parseFloat(obj[key]) : obj[key];
    return acc;
  }, {});
}
