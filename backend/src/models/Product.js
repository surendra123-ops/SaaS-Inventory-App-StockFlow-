import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    organizationId: { type: mongoose.Schema.Types.ObjectId, ref: "Organization", required: true, index: true },
    name: { type: String, required: true, trim: true },
    sku: { type: String, required: true, trim: true },
    description: { type: String, default: "", trim: true },
    quantity: { type: Number, required: true, min: 0 },
    costPrice: { type: Number, required: true, min: 0 },
    sellingPrice: { type: Number, required: true, min: 0 },
    lowStockThreshold: { type: Number, min: 0, default: null }
  },
  { timestamps: true }
);

productSchema.index({ organizationId: 1, sku: 1 }, { unique: true });

export const Product = mongoose.model("Product", productSchema);
