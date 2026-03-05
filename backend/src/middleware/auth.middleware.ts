import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JwtPayload } from '../types';

// Augment the Express Request type globally so `req.user` is type-safe
// throughout the entire backend without repeated casting.
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

/**
 * `protect` middleware guards any route that requires authentication.
 *
 * Strategy:
 *  - Reads the JWT from an HttpOnly cookie (never localStorage — immune to XSS).
 *  - Verifies the signature against JWT_SECRET.
 *  - Attaches the decoded payload to `req.user` so downstream controllers
 *    can access the authenticated user's id/email without another DB hit.
 *
 * Usage: router.get('/watchlist', protect, watchlistController.get)
 */
export const protect = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const token: string | undefined = req.cookies?.token;

  if (!token) {
    res.status(401).json({
      success: false,
      message: 'Not authorized. Please log in to access this resource.',
    });
    return;
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    console.error('FATAL: JWT_SECRET environment variable is not defined.');
    res.status(500).json({ success: false, message: 'Server configuration error.' });
    return;
  }

  try {
    const decoded = jwt.verify(token, secret) as JwtPayload;
    req.user = decoded;
    next();
  } catch {
    // Covers both TokenExpiredError and JsonWebTokenError
    res.status(401).json({
      success: false,
      message: 'Not authorized. Token is invalid or has expired.',
    });
  }
};
