import apiClient from './apiClient';

export default {
  async getCurrent() {
    return apiClient.get(`v1/users/me`);
  },
  async count() {
    return apiClient.get(`v1/users/count`);
  },
  async get(userId) {
    return apiClient.get(`v1/users/${userId}`);
  },
  async getAll(params) {
    return apiClient.get(`v1/users`, { params });
  },
  async create(data) {
    return apiClient.post(`v1/users/new`, { data });
  },
  async signup(credentials) {
    return apiClient.post(`v1/users`, { data: credentials });
  },
  async login(credentials) {
    return apiClient.post(`v1/users/login`, { data: credentials });
  },
  async logout() {
    return apiClient.post(`v1/users/logout`);
  },
  async forgotPassword(credentials) {
    return apiClient.post(`v1/users/password/reset/send`, { data: credentials });
  },
  async resetPassword(credentials) {
    return apiClient.post(`v1/users/password/reset`, { data: credentials });
  },
  async changePassword(credentials) {
    return apiClient.put(`v1/users/password`, { data: credentials });
  },
  async update(userId, data) {
    return apiClient.patch(`v1/users/${userId}`, { data, headers: { 'Content-Type': 'multipart/form-data' } });
  },
  async updateProfile(data) {
    return apiClient.patch(`v1/users/profile`, { data });
  },
  async delete(id) {
    return apiClient.delete(`v1/users/${id}`);
  },
  async bulkDelete(data) {
    return apiClient.delete(`v1/users/bulk`, { data });
  },
  async uploadAvatar(data) {
    return apiClient.post(`v1/users/avatar`, { data, headers: { 'Content-Type': 'multipart/form-data' } });
  },
  async deleteAvatar() {
    return apiClient.patch(`v1/users/avatar`);
  },
  async getOrders(id, params) {
    return apiClient.get(`v1/users/${id}/orders`, { params });
  },
  async wishlistAdd(data) {
    return apiClient.post(`v1/users/wishlist`, { data });
  },
  async wishlistGet(params) {
    return apiClient.get(`v1/users/wishlist`, { params });
  },
  async wishlistDelete(productId) {
    return apiClient.delete(`v1/users/wishlist/${productId}`);
  },
  async wishlistClear() {
    return apiClient.delete(`v1/users/wishlist/clear`);
  },
  async createAddress(data) {
    return apiClient.post(`v1/users/addresses`, { data });
  },
  async getAddress(id) {
    return apiClient.get(`v1/users/addresses/${id}`);
  },
  async getAddresses() {
    return apiClient.get(`v1/users/addresses`);
  },
  async updateAddress(id, data) {
    return apiClient.patch(`v1/users/addresses/${id}`, { data });
  },
  async deleteAddress(id) {
    return apiClient.delete(`v1/users/addresses/${id}`);
  },
};
