import apiClient from './apiClient';

export default {
  // product
  async create(data) {
    return apiClient.post(
      `v1/products`,
      { data, headers: { 'Content-Type': 'multipart/form-data' } },
      { skipTransformRequest: true }
    );
  },
  async update(id, data) {
    return apiClient.patch(`v1/products/${id}`, { data });
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
  async getFeatured(params) {
    return apiClient.get(`v1/products/featured`, { params });
  },
  async search(params) {
    return apiClient.get(`v1/products/search`, { params });
  },
  async bulkDelete(data) {
    return apiClient.delete(`v1/products/bulk`, { data });
  },

  // product tags
  async createTag(productId, data) {
    return apiClient.post(`v1/products/${productId}/tags`, { data });
  },
  async updateTag(productId, tagId, data) {
    return apiClient.patch(`v1/products/${productId}/tags/${tagId}`, { data });
  },
  async getTags(productId) {
    return apiClient.get(`v1/products/${productId}/tags`);
  },
  async replaceTags(productId, data) {
    return apiClient.put(`v1/products/${productId}/tags/replace`, { data });
  },
  async deleteTag(productId, tagId) {
    return apiClient.delete(`v1/products/${productId}/tags/${tagId}`);
  },
  async bulkDeleteTags(productId, data) {
    return apiClient.delete(`v1/products/${productId}/tags/bulk`, { data });
  },

  // product images
  async createImages(productId, data) {
    return apiClient.post(`v1/products/${productId}/images/bulk`, {
      data,
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  async createImage(productId, data) {
    return apiClient.post(`v1/products/${productId}/images`, {
      data,
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  async updateImage(productId, imageId, data) {
    return apiClient.patch(`v1/products/${productId}/images/${imageId}`, {
      data,
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  async getImages(productId) {
    return apiClient.get(`v1/products/${productId}/images`);
  },
  async deleteImage(productId, imageId) {
    return apiClient.delete(`v1/products/${productId}/images/${imageId}`);
  },
  async bulkDeleteImages(productId, data) {
    return apiClient.delete(`v1/products/${productId}/images/bulk`, { data });
  },

  // product reviews
  async createReview(productId, data) {
    return apiClient.post(`v1/products/${productId}/reviews`, { data });
  },
  async updateReview(productId, reviewId, data) {
    return apiClient.patch(`v1/products/${productId}/reviews/${reviewId}`, { data });
  },
  async getReviews(productId) {
    return apiClient.get(`v1/products/${productId}/reviews`);
  },
  async getReview(productId, reviewId) {
    return apiClient.get(`v1/products/${productId}/reviews/${reviewId}`);
  },
  async deleteReview(productId, reviewId) {
    return apiClient.delete(`v1/products/${productId}/reviews/${reviewId}`);
  },
  async bulkDeleteReviews(productId, data) {
    return apiClient.delete(`v1/products/${productId}/reviews/bulk`, { data });
  },
};
