import apiClient from './apiClient';

export default {
  async create(data) {
    return apiClient.post(`v1/tags`, { data });
  },
  async update(id, data) {
    return apiClient.patch(`v1/tags/${id}`, { data });
  },
  async count() {
    return apiClient.get(`v1/tags/count`);
  },
  async get(id) {
    return apiClient.get(`v1/tags/${id}`);
  },
  async getAll(params) {
    return apiClient.get(`v1/tags`, { params });
  },
  async delete(id) {
    return apiClient.delete(`v1/tags/${id}`);
  },
  async bulkDelete(data) {
    return apiClient.delete(`v1/tags/bulk`, { data });
  },
};
