import { z } from "zod";

export const settingsSchema = z.object({
  defaultLowStockThreshold: z.number().min(0)
});
