import apiClient from './apiClient';

export default {
  async create(details) {
    return apiClient.post(`v1/orders`, { data: details });
  },

  async update(id, details) {
    return apiClient.patch(`v1/orders/${id}`, { data: details });
  },

  async get(id) {
    return apiClient.get(`v1/orders/${id}`);
  },

  async getAll(params) {
    return apiClient.get(`v1/orders`, { params });
  },
};
