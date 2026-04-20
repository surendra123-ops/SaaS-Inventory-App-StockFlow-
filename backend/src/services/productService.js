import mongoose from "mongoose";
import { productRepository } from "../repositories/productRepository.js";
import { settingsRepository } from "../repositories/settingsRepository.js";
import { AppError } from "../utils/AppError.js";
import { escapeRegex } from "../utils/escapeRegex.js";

export const productService = {
  list(organizationId, search) {
    return productRepository.listByOrganization(organizationId, search ? escapeRegex(search) : "");
  },
  async create(organizationId, payload) {
    try {
      return await productRepository.create({ ...payload, organizationId });
    } catch (error) {
      if (error?.code === 11000) {
        throw new AppError("SKU already exists in this organization", 409);
      }
      throw error;
    }
  },
  async update(organizationId, id, payload) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError("Invalid product id", 400);
    }
    try {
      const product = await productRepository.updateByIdAndOrganization(id, organizationId, payload);
      if (!product) {
        throw new AppError("Product not found", 404);
      }
      return product;
    } catch (error) {
      if (error?.code === 11000) {
        throw new AppError("SKU already exists in this organization", 409);
      }
      throw error;
    }
  },
  async remove(organizationId, id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError("Invalid product id", 400);
    }
    const product = await productRepository.deleteByIdAndOrganization(id, organizationId);
    if (!product) {
      throw new AppError("Product not found", 404);
    }
  },
  async dashboard(organizationId) {
    const [totals, products, settings] = await Promise.all([
      productRepository.aggregateTotals(organizationId),
      productRepository.listByOrganization(organizationId),
      settingsRepository.getByOrganization(organizationId)
    ]);
    const defaultThreshold = settings?.defaultLowStockThreshold ?? 10;
    const lowStockItems = products.filter(
      (item) => item.quantity <= (item.lowStockThreshold ?? defaultThreshold)
    );
    return {
      totalProducts: totals[0]?.totalProducts ?? 0,
      totalQuantity: totals[0]?.totalQuantity ?? 0,
      lowStockItems
    };
  }
};
