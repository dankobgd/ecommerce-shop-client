import apiClient from './apiClient';

export default {
  async create(data) {
    return apiClient.post(`v1/promotions`, { data });
  },
  async get(promoCode) {
    return apiClient.get(`v1/promotions/${promoCode}`);
  },
  async getAll(params) {
    return apiClient.get(`v1/promotions`, { params });
  },
  async update(promoCode, data) {
    return apiClient.patch(`v1/promotions/${promoCode}`, { data });
  },
  async delete(promoCode) {
    return apiClient.delete(`v1/promotions/${promoCode}`);
  },
  async getStatus(promoCode) {
    return apiClient.get(`v1/promotions/${promoCode}/status`);
  },
};
