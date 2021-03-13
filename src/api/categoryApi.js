import apiClient from './apiClient';

export default {
  async create(data) {
    return apiClient.post(`v1/categories`, { data, headers: { 'Content-Type': 'multipart/form-data' } });
  },
  async update(id, data) {
    return apiClient.patch(`v1/categories/${id}`, { data });
  },
  async count() {
    return apiClient.get(`v1/categories/count`);
  },
  async get(id) {
    return apiClient.get(`v1/categories/${id}`);
  },
  async getAll(params) {
    return apiClient.get(`v1/categories`, { params });
  },
  async getFeatured(params) {
    return apiClient.get(`v1/categories/featured`, { params });
  },
  async delete(id) {
    return apiClient.delete(`v1/categories/${id}`);
  },
  async bulkDelete(data) {
    return apiClient.delete(`v1/categories/bulk`, { data });
  },
};
