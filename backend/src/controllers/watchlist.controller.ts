import { Request, Response, NextFunction } from 'express';
import User from '../models/User.model';

export const watchlistController = {
  getWatchlist: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = await User.findById(req.user!.id).select('watchlist');
      res.status(200).json({ success: true, watchlist: user?.watchlist ?? [] });
    } catch (err) {
      next(err);
    }
  },

  addToWatchlist: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id, title, posterPath } = req.body;
      if (!id || !title) {
        res.status(400).json({ success: false, message: 'id and title are required.' });
        return;
      }

      const user = await User.findByIdAndUpdate(
        req.user!.id,
        { $addToSet: { watchlist: { id, title, posterPath: posterPath ?? null } } },
        { new: true, select: 'watchlist' },
      );

      res.status(200).json({ success: true, watchlist: user?.watchlist ?? [] });
    } catch (err) {
      next(err);
    }
  },

  removeFromWatchlist: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const movieId = Number(req.params.movieId);
      if (isNaN(movieId)) {
        res.status(400).json({ success: false, message: 'Invalid movie id.' });
        return;
      }

      const user = await User.findByIdAndUpdate(
        req.user!.id,
        { $pull: { watchlist: { id: movieId } } },
        { new: true, select: 'watchlist' },
      );

      res.status(200).json({ success: true, watchlist: user?.watchlist ?? [] });
    } catch (err) {
      next(err);
    }
  },
};
