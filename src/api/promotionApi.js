import apiClient from './apiClient';

export default {
  async create(details) {
    return apiClient.post(`v1/promotions`, { data: details });
  },

  async get(code) {
    return apiClient.get(`v1/promotions/${code}`);
  },

  async getAll(params) {
    return apiClient.get(`v1/promotions`, { params });
  },

  async update(code, details) {
    return apiClient.patch(`v1/promotions/${code}`, { data: details });
  },

  async delete(code) {
    return apiClient.delete(`v1/promotions/${code}`);
  },

  async getStatus(code) {
    return apiClient.get(`v1/promotions/${code}/status`);
  },
};
