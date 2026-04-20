import { Product } from "../models/Product.js";
import mongoose from "mongoose";

export const productRepository = {
  buildFilter(organizationId, search) {
    const filter = { organizationId };
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { sku: { $regex: search, $options: "i" } }
      ];
    }
    return filter;
  },
  listByOrganization(organizationId, search) {
    const filter = this.buildFilter(organizationId, search);
    return Product.find(filter).sort({ createdAt: -1 });
  },
  async listByOrganizationPaginated(organizationId, search, page, limit) {
    const filter = this.buildFilter(organizationId, search);
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      Product.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Product.countDocuments(filter)
    ]);
    return { items, total };
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
