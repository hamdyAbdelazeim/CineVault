import { Router } from 'express';
import { watchlistController } from '../controllers/watchlist.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();

// All watchlist routes require authentication
router.use(protect);

router.get('/', watchlistController.getWatchlist);
router.post('/', watchlistController.addToWatchlist);
router.delete('/:movieId', watchlistController.removeFromWatchlist);

export default router;
