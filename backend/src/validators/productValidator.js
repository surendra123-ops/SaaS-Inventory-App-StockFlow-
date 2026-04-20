import { z } from "zod";

export const productSchema = z.object({
  name: z.string().trim().min(1),
  sku: z.string().trim().min(1),
  description: z.string().trim().optional().default(""),
  quantity: z.number().min(0),
  costPrice: z.number().min(0),
  sellingPrice: z.number().min(0),
  lowStockThreshold: z.number().min(0).nullable().optional()
});
