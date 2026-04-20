import { settingsService } from "../services/settingsService.js";
import { successResponse } from "../utils/apiResponse.js";

export const settingsController = {
  async get(req, res, next) {
    try {
      const settings = await settingsService.get(req.auth.organizationId);
      return res.json(successResponse({ settings }));
    } catch (error) {
      return next(error);
    }
  },
  async update(req, res, next) {
    try {
      const settings = await settingsService.update(req.auth.organizationId, req.body);
      return res.json(successResponse({ settings }));
    } catch (error) {
      return next(error);
    }
  }
};
