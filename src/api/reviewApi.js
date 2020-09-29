import apiClient from './apiClient';

export default {
  async create(details) {
    return apiClient.post(`v1/reviews`, { data: details });
  },

  async update(id, details) {
    return apiClient.patch(`v1/reviews/${id}`, { data: details });
  },

  async get(id) {
    return apiClient.get(`v1/reviews/${id}`);
  },

  async getAll(params) {
    return apiClient.get(`v1/reviews`, { params });
  },

  async delete(id) {
    return apiClient.delete(`v1/reviews/${id}`);
  },
};
