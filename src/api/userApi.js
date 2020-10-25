import apiClient from './apiClient';

export default {
  async getCurrent() {
    return apiClient.get(`v1/users/me`);
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
  async update(details) {
    return apiClient.patch(`v1/users`, { data: details });
  },
  async uploadAvatar(formData) {
    return apiClient.post(`v1/users/avatar`, { data: formData, headers: { 'Content-Type': 'multipart/form-data' } });
  },
  async deleteAvatar() {
    return apiClient.patch(`v1/users/avatar`);
  },
  async getOrders(id, params) {
    return apiClient.get(`v1/users/${id}/orders`, { params });
  },
  async wishlistAdd(details) {
    return apiClient.post(`v1/users/wishlist`, { data: details });
  },
  async wishlistGet(params) {
    return apiClient.get(`v1/users/wishlist`, { params });
  },
  async wishlistDelete(details) {
    return apiClient.delete(`v1/users/wishlist`, { data: details });
  },
  async wishlistClear(details) {
    return apiClient.delete(`v1/users/wishlist/clear`, { data: details });
  },
  async createAddress(details) {
    return apiClient.post(`v1/users/addresses`, { data: details });
  },
  async getAddress(id) {
    return apiClient.get(`v1/users/addresses/${id}`);
  },
  async getAddresses() {
    return apiClient.get(`v1/users/addresses`);
  },
  async updateAddress(id, details) {
    return apiClient.patch(`v1/users/addresses/${id}`, { data: details });
  },
  async deleteAddress(id) {
    return apiClient.delete(`v1/users/addresses/${id}`);
  },
};
