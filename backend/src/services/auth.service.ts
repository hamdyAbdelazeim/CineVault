import { Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.model';

const JWT_EXPIRES_IN = '7d';
const COOKIE_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000; // 7 days in ms

function signToken(userId: string, email: string): string {
  return jwt.sign({ id: userId, email }, process.env.JWT_SECRET!, {
    expiresIn: JWT_EXPIRES_IN,
  });
}

/** Attach a signed JWT as an HttpOnly cookie on the response. */
function attachCookie(res: Response, token: string): void {
  res.cookie('token', token, {
    httpOnly: true,                                          // JS cannot read this — mitigates XSS
    secure: process.env.NODE_ENV === 'production',           // HTTPS only in production
    sameSite: 'lax',                                         // CSRF protection
    maxAge: COOKIE_MAX_AGE_MS,
  });
}

function createAppError(message: string, statusCode: number): Error {
  const err = new Error(message) as Error & { statusCode: number };
  err.statusCode = statusCode;
  return err;
}

export const authService = {
  async signup(name: string, email: string, password: string, res: Response) {
    const exists = await User.findOne({ email });
    if (exists) throw createAppError('An account with this email already exists.', 409);

    const user = await User.create({ name, email, password });
    attachCookie(res, signToken(user._id.toString(), user.email));
    return { id: user._id.toString(), name: user.name, email: user.email, role: user.role };
  },

  async login(email: string, password: string, res: Response) {
    // Opt-in to select the password hash (excluded by default via `select: false`)
    const user = await User.findOne({ email }).select('+password');
    if (!user) throw createAppError('Invalid email or password.', 401);

    const isMatch = await user.comparePassword(password);
    if (!isMatch) throw createAppError('Invalid email or password.', 401);

    attachCookie(res, signToken(user._id.toString(), user.email));
    return { id: user._id.toString(), name: user.name, email: user.email, role: user.role };
  },

  logout(res: Response) {
    // Overwrite the cookie with an expired empty value
    res.cookie('token', '', { httpOnly: true, expires: new Date(0) });
  },

  async getMe(userId: string) {
    const user = await User.findById(userId).select('-password');
    if (!user) return null;
    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      watchlist: user.watchlist,
    };
  },
};
