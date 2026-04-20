import { ZodError } from "zod";
import { errorResponse } from "../utils/apiResponse.js";

export const errorMiddleware = (err, _req, res, _next) => {
  if (err instanceof ZodError) {
    return res.status(400).json(errorResponse(err.issues[0]?.message || "Validation error"));
  }
  if (err?.code === 11000) {
    return res.status(409).json(errorResponse("Duplicate value"));
  }
  const statusCode = err.statusCode || 500;
  const message = statusCode === 500 ? "Internal server error" : err.message;
  return res.status(statusCode).json(errorResponse(message));
};
