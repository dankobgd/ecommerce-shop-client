import apiClient from './apiClient';

export default {
  async create(data) {
    return apiClient.post(`v1/orders`, { data });
  },
  async update(id, data) {
    return apiClient.patch(`v1/orders/${id}`, { data });
  },
  async get(id) {
    return apiClient.get(`v1/orders/${id}`);
  },
  async getAll(params) {
    return apiClient.get(`v1/orders`, { params });
  },
  async getDetails(orderId) {
    return apiClient.get(`v1/orders/${orderId}/details`);
  },
};
