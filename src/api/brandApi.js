import apiClient from './apiClient';

export default {
  async create(data) {
    return apiClient.post(`v1/brands`, { data, headers: { 'Content-Type': 'multipart/form-data' } });
  },
  async update(id, data) {
    return apiClient.patch(`v1/brands/${id}`, { data });
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
