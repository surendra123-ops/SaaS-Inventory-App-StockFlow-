import { AppError } from "../utils/AppError.js";
import { verifyAccessToken } from "../utils/token.js";

export const authMiddleware = (req, _res, next) => {
  const token = req.cookies?.accessToken;
  if (!token) {
    return next(new AppError("Unauthorized", 401));
  }
  try {
    const decoded = verifyAccessToken(token);
    req.auth = { userId: decoded.userId, organizationId: decoded.organizationId };
    return next();
  } catch {
    return next(new AppError("Invalid or expired access token", 401));
  }
};
