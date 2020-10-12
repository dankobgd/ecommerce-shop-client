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
  async updateAddress(details) {
    return apiClient.patch(`v1/users/address`, { data: details });
  },
  async deleteAddress() {
    return apiClient.patch(`v1/users/address`);
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
};
