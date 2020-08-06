import _ from 'lodash';

export function defaultLabel(name) {
  if (name) {
    return _.startCase(name);
  }
  return '';
}
