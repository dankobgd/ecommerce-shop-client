import _ from 'lodash';

export const defaultLabel = name => (name ? _.startCase(name) : '');
