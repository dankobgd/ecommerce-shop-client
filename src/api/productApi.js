import apiClient from './apiClient';

export default {
  async create(formData) {
    return apiClient.post(
      `v1/products`,
      { data: formData, headers: { 'Content-Type': 'multipart/form-data' } },
      { skipTransformRequest: true }
    );
  },

  async update(id, details) {
    return apiClient.patch(`v1/products/${id}`, { data: details });
  },

  async get(id) {
    return apiClient.get(`v1/products/${id}`);
  },

  async getAll(params) {
    return apiClient.get(`v1/products`, { params });
  },

  async delete(id) {
    return apiClient.delete(`v1/products/${id}`);
  },

  async getTags(id) {
    return apiClient.get(`v1/products/${id}/tags`);
  },

  async getImages(id) {
    return apiClient.get(`v1/products/${id}/images`);
  },

  async getProperties() {
    return apiClient.get(`v1/products/properties`);
  },
};
