import apiClient from './apiClient';

export default {
  async create(details) {
    return apiClient.post('v1/tags', { data: details });
  },

  async update(id, details) {
    return apiClient.patch(`v1/tags/${id}`, { data: details });
  },

  async get(id) {
    return apiClient.get(`v1/tags/${id}`);
  },

  async getAll() {
    return apiClient.get('v1/tags');
  },

  async delete(id) {
    return apiClient.delete(`v1/tags/${id}`);
  },
};
