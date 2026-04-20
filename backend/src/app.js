import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import settingsRoutes from "./routes/settingsRoutes.js";
import { authMiddleware } from "./middlewares/authMiddleware.js";
import { errorMiddleware } from "./middlewares/errorMiddleware.js";
import { env } from "./config/env.js";
import { errorResponse } from "./utils/apiResponse.js";

export const app = express();
const allowedOrigins = env.corsOrigin
  .split(",")
  .map((origin) => origin.trim().replace(/\/$/, ""))
  .filter(Boolean);

app.use(helmet());
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());
app.use(morgan("dev"));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 300 }));

app.get("/api/health", (_req, res) => res.json({ success: true, data: { status: "ok" } }));
app.use("/api/auth", authRoutes);
app.use("/api/products", authMiddleware, productRoutes);
app.use("/api/dashboard", authMiddleware, dashboardRoutes);
app.use("/api/settings", authMiddleware, settingsRoutes);
app.use((_req, res) => res.status(404).json(errorResponse("Route not found")));
app.use(errorMiddleware);
