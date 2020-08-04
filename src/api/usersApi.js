import apiClient from './apiClient';

export default {
  async getCurrent() {
    return apiClient.get('v1/users/me');
  },
  async signup(credentials) {
    return apiClient.post('v1/users', { data: credentials });
  },
  async login(credentials) {
    return apiClient.post('v1/users/login', { data: credentials });
  },
  async logout() {
    return apiClient.post('v1/users/logout');
  },
  async forgotPassword(credentials) {
    return apiClient.post('v1/users/password/reset/send', { data: credentials });
  },
  async resetPassword(credentials) {
    return apiClient.post('v1/users/password/reset', { data: credentials });
  },
  async changePassword(credentials) {
    return apiClient.put('v1/users/password', { data: credentials });
  },
  async uploadAvatar(formData) {
    return apiClient.post('v1/users/avatar', { data: formData, headers: { 'Content-Type': 'multipart/form-data' } });
  },
  async deleteAvatar() {
    return apiClient.patch('v1/users/avatar');
  },
};
