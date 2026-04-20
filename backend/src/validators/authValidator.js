import { z } from "zod";

const emailSchema = z.string().trim().email();
const passwordSchema = z.string().min(8);

export const signupSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  organizationName: z.string().trim().min(2)
});

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema
});
