import apiClient from './apiClient';

export default {
  async create(formData) {
    return apiClient.post(`v1/brands`, { data: formData, headers: { 'Content-Type': 'multipart/form-data' } });
  },

  async update(id, details) {
    return apiClient.patch(`v1/brands/${id}`, { data: details });
  },

  async get(id) {
    return apiClient.get(`v1/brands/${id}`);
  },

  async getAll(params) {
    return apiClient.get(`v1/brands`, { params });
  },

  async delete(id) {
    return apiClient.delete(`v1/brands/${id}`);
  },
};
