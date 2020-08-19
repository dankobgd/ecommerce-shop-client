import apiClient from './apiClient';

export default {
  async create(formData) {
    return apiClient.post(
      'v1/products',
      { data: formData, headers: { 'Content-Type': 'multipart/form-data' } },
      { skipTransformRequest: true }
    );
  },
};
