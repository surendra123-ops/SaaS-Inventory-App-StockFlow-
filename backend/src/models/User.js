import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    organizationId: { type: mongoose.Schema.Types.ObjectId, ref: "Organization", required: true }
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const User = mongoose.model("User", userSchema);
