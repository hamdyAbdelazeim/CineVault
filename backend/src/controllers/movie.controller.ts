import { Request, Response, NextFunction } from 'express';
import { tmdbService } from '../services/tmdb.service';

export const movieController = {
  getTrending: async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await tmdbService.getTrending();
      res.json({ success: true, ...data });
    } catch (err) { next(err); }
  },

  getTopRated: async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await tmdbService.getTopRated();
      res.json({ success: true, ...data });
    } catch (err) { next(err); }
  },

  getByGenre: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await tmdbService.getByGenre(req.params.genreId);
      res.json({ success: true, ...data });
    } catch (err) { next(err); }
  },

  getMovieDetails: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await tmdbService.getMovieDetails(req.params.id);
      res.json(data);
    } catch (err) { next(err); }
  },

  getMovieVideos: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await tmdbService.getMovieVideos(req.params.id);
      // Prefer official YouTube trailers; gracefully fall back to teasers/any clip
      const youtube = data.results.filter((v) => v.site === 'YouTube');
      const trailer =
        youtube.find((v) => v.official && v.type === 'Trailer') ??
        youtube.find((v) => v.type === 'Trailer') ??
        youtube.find((v) => v.type === 'Teaser') ??
        youtube[0] ??
        null;
      res.json({ success: true, trailer });
    } catch (err) { next(err); }
  },

  search: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const query = (req.query.q as string) ?? '';
      if (query.trim().length < 2) {
        res.json({ success: true, results: [], total_results: 0 });
        return;
      }
      const data = await tmdbService.search(query);
      res.json({ success: true, ...data });
    } catch (err) { next(err); }
  },
};
