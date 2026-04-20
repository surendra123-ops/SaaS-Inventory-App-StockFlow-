import bcrypt from "bcryptjs";
import { authRepository } from "../repositories/authRepository.js";
import { AppError } from "../utils/AppError.js";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../utils/token.js";

export const authService = {
  async signup(input) {
    const existing = await authRepository.findUserByEmail(input.email);
    if (existing) {
      throw new AppError("Email already registered", 409);
    }
    const organization = await authRepository.createOrganization(input.organizationName);
    const password = await bcrypt.hash(input.password, 12);
    const user = await authRepository.createUser({
      email: input.email,
      password,
      organizationId: organization._id
    });
    await authRepository.createDefaultSettings(organization._id);
    return this.issueTokens(user);
  },
  async login(input) {
    const user = await authRepository.findUserByEmail(input.email);
    if (!user) {
      throw new AppError("Invalid email or password", 401);
    }
    const isMatch = await bcrypt.compare(input.password, user.password);
    if (!isMatch) {
      throw new AppError("Invalid email or password", 401);
    }
    return this.issueTokens(user);
  },
  issueTokens(user) {
    const payload = { userId: user._id.toString(), organizationId: user.organizationId.toString() };
    return {
      accessToken: signAccessToken(payload),
      refreshToken: signRefreshToken(payload),
      user: { id: user._id, email: user.email, organizationId: user.organizationId }
    };
  },
  refresh(refreshToken) {
    if (!refreshToken) {
      throw new AppError("Refresh token missing", 401);
    }
    try {
      const decoded = verifyRefreshToken(refreshToken);
      return signAccessToken({ userId: decoded.userId, organizationId: decoded.organizationId });
    } catch {
      throw new AppError("Invalid or expired refresh token", 401);
    }
  }
};
