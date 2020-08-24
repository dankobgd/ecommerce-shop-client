import apiClient from './apiClient';

export default {
  async create(formData) {
    return apiClient.post('v1/categories', { data: formData, headers: { 'Content-Type': 'multipart/form-data' } });
  },

  async update(id, details) {
    return apiClient.patch(`v1/categories/${id}`, { data: details });
  },

  async get(id) {
    return apiClient.get(`v1/categories/${id}`);
  },

  async getAll() {
    return apiClient.get('v1/categories');
  },

  async delete(id) {
    return apiClient.delete(`v1/categories/${id}`);
  },
};
