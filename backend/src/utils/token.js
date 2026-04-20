import jwt from "jsonwebtoken";
import ms from "ms";
import { env } from "../config/env.js";

export const signAccessToken = (payload) =>
  jwt.sign(payload, env.jwtAccessSecret, { expiresIn: env.accessTokenExpiresIn });

export const signRefreshToken = (payload) =>
  jwt.sign(payload, env.jwtRefreshSecret, { expiresIn: env.refreshTokenExpiresIn });

export const verifyAccessToken = (token) => jwt.verify(token, env.jwtAccessSecret);
export const verifyRefreshToken = (token) => jwt.verify(token, env.jwtRefreshSecret);

export const getAccessCookieOptions = () => ({
  httpOnly: true,
  secure: env.cookieSecure,
  sameSite: "strict",
  maxAge: ms(env.accessTokenExpiresIn)
});

export const getRefreshCookieOptions = () => ({
  httpOnly: true,
  secure: env.cookieSecure,
  sameSite: "strict",
  maxAge: ms(env.refreshTokenExpiresIn)
});
