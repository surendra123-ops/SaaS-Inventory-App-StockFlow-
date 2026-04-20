import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema(
  {
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
      unique: true,
      index: true
    },
    defaultLowStockThreshold: { type: Number, required: true, min: 0 }
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

export const Settings = mongoose.model("Settings", settingsSchema);
