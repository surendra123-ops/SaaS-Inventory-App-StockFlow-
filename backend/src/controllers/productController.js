import { productService } from "../services/productService.js";
import { successResponse } from "../utils/apiResponse.js";

export const productController = {
  async list(req, res, next) {
    try {
      const products = await productService.list(req.auth.organizationId, req.query.search?.trim() || "");
      return res.json(successResponse({ products }));
    } catch (error) {
      return next(error);
    }
  },
  async create(req, res, next) {
    try {
      const product = await productService.create(req.auth.organizationId, req.body);
      return res.status(201).json(successResponse({ product }));
    } catch (error) {
      return next(error);
    }
  },
  async update(req, res, next) {
    try {
      const product = await productService.update(req.auth.organizationId, req.params.id, req.body);
      return res.json(successResponse({ product }));
    } catch (error) {
      return next(error);
    }
  },
  async remove(req, res, next) {
    try {
      await productService.remove(req.auth.organizationId, req.params.id);
      return res.json(successResponse({}));
    } catch (error) {
      return next(error);
    }
  }
};
