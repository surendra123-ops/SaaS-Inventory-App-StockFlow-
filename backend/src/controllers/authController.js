import { authService } from "../services/authService.js";
import { successResponse } from "../utils/apiResponse.js";
import { getAccessCookieOptions, getRefreshCookieOptions } from "../utils/token.js";

const clearCookieOptions = {
  httpOnly: true,
  sameSite: "strict"
};

export const authController = {
  async signup(req, res, next) {
    try {
      const result = await authService.signup(req.body);
      res.cookie("accessToken", result.accessToken, getAccessCookieOptions());
      res.cookie("refreshToken", result.refreshToken, getRefreshCookieOptions());
      return res.status(201).json(successResponse({ user: result.user }));
    } catch (error) {
      return next(error);
    }
  },
  async login(req, res, next) {
    try {
      const result = await authService.login(req.body);
      res.cookie("accessToken", result.accessToken, getAccessCookieOptions());
      res.cookie("refreshToken", result.refreshToken, getRefreshCookieOptions());
      return res.json(successResponse({ user: result.user }));
    } catch (error) {
      return next(error);
    }
  },
  async refresh(req, res, next) {
    try {
      const accessToken = authService.refresh(req.cookies?.refreshToken);
      res.cookie("accessToken", accessToken, getAccessCookieOptions());
      return res.json(successResponse({}));
    } catch (error) {
      return next(error);
    }
  },
  logout(_req, res) {
    res.clearCookie("accessToken", clearCookieOptions);
    res.clearCookie("refreshToken", clearCookieOptions);
    return res.json(successResponse({}));
  }
};
