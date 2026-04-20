import { Settings } from "../models/Settings.js";

export const settingsRepository = {
  getByOrganization(organizationId) {
    return Settings.findOne({ organizationId });
  },
  updateByOrganization(organizationId, payload) {
    return Settings.findOneAndUpdate({ organizationId }, payload, { new: true, upsert: true, runValidators: true });
  }
};
