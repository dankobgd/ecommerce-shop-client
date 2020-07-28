import apiClient from './client';

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
};
