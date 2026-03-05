import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service';

/** Thin controller layer — validates inputs, delegates to service, shapes response. */
export const authController = {
  signup: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { name, email, password } = req.body;
      if (!name || !email || !password) {
        res.status(400).json({ success: false, message: 'Name, email, and password are required.' });
        return;
      }
      const user = await authService.signup(name, email, password, res);
      res.status(201).json({ success: true, user });
    } catch (err) {
      next(err);
    }
  },

  login: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        res.status(400).json({ success: false, message: 'Email and password are required.' });
        return;
      }
      const user = await authService.login(email, password, res);
      res.status(200).json({ success: true, user });
    } catch (err) {
      next(err);
    }
  },

  logout: (_req: Request, res: Response): void => {
    authService.logout(res);
    res.status(200).json({ success: true, message: 'Logged out successfully.' });
  },

  getMe: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = await authService.getMe(req.user!.id);
      res.status(200).json({ success: true, user });
    } catch (err) {
      next(err);
    }
  },
};
