import apiClient from './apiClient';

export default {
  async create(details) {
    return apiClient.post('v1/products', { data: details });
  },
};
