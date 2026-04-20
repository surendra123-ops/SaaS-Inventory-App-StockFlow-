import { Product } from "../models/Product.js";
import mongoose from "mongoose";

export const productRepository = {
  listByOrganization(organizationId, search) {
    const filter = { organizationId };
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { sku: { $regex: search, $options: "i" } }
      ];
    }
    return Product.find(filter).sort({ createdAt: -1 });
  },
  create(payload) {
    return Product.create(payload);
  },
  findByIdAndOrganization(id, organizationId) {
    return Product.findOne({ _id: id, organizationId });
  },
  updateByIdAndOrganization(id, organizationId, payload) {
    return Product.findOneAndUpdate({ _id: id, organizationId }, payload, { new: true, runValidators: true });
  },
  deleteByIdAndOrganization(id, organizationId) {
    return Product.findOneAndDelete({ _id: id, organizationId });
  },
  aggregateTotals(organizationId) {
    return Product.aggregate([
      { $match: { organizationId: new mongoose.Types.ObjectId(organizationId) } },
      {
        $group: {
          _id: null,
          totalProducts: { $sum: 1 },
          totalQuantity: { $sum: "$quantity" }
        }
      }
    ]);
  }
};
