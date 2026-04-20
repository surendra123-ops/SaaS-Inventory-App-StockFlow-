import dotenv from "dotenv";

dotenv.config();

const required = [
  "PORT",
  "MONGO_URI",
  "JWT_ACCESS_SECRET",
  "JWT_REFRESH_SECRET",
  "ACCESS_TOKEN_EXPIRES_IN",
  "REFRESH_TOKEN_EXPIRES_IN",
  "COOKIE_SECURE",
  "COOKIE_SAME_SITE",
  "CORS_ORIGIN"
];

for (const key of required) {
  if (!process.env[key]) {
    throw new Error(`Missing environment variable: ${key}`);
  }
}

const cookieSameSite = process.env.COOKIE_SAME_SITE.toLowerCase();
const allowedSameSite = ["lax", "strict", "none"];
if (!allowedSameSite.includes(cookieSameSite)) {
  throw new Error("COOKIE_SAME_SITE must be one of: lax, strict, none");
}

const cookieSecure = process.env.COOKIE_SECURE === "true";
if (cookieSameSite === "none" && !cookieSecure) {
  throw new Error("COOKIE_SECURE must be true when COOKIE_SAME_SITE is none");
}

export const env = {
  port: Number(process.env.PORT),
  mongoUri: process.env.MONGO_URI,
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET,
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
  accessTokenExpiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN,
  refreshTokenExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN,
  cookieSecure,
  cookieSameSite,
  corsOrigin: process.env.CORS_ORIGIN
};
