import { settingsRepository } from "../repositories/settingsRepository.js";

export const settingsService = {
  async get(organizationId) {
    const settings = await settingsRepository.getByOrganization(organizationId);
    if (settings) {
      return settings;
    }
    return settingsRepository.updateByOrganization(organizationId, { defaultLowStockThreshold: 10 });
  },
  update(organizationId, payload) {
    return settingsRepository.updateByOrganization(organizationId, payload);
  }
};
