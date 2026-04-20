import { productService } from "../services/productService.js";
import { successResponse } from "../utils/apiResponse.js";

export const dashboardController = {
  async get(req, res, next) {
    try {
      const dashboard = await productService.dashboard(req.auth.organizationId);
      return res.json(successResponse(dashboard));
    } catch (error) {
      return next(error);
    }
  }
};
