import { Organization } from "../models/Organization.js";
import { Settings } from "../models/Settings.js";
import { User } from "../models/User.js";

export const authRepository = {
  findUserByEmail(email) {
    return User.findOne({ email: email.toLowerCase() });
  },
  createOrganization(name) {
    return Organization.create({ name });
  },
  createUser(payload) {
    return User.create(payload);
  },
  createDefaultSettings(organizationId) {
    return Settings.create({ organizationId, defaultLowStockThreshold: 10 });
  }
};
