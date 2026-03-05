import { Router } from 'express';
import { movieController } from '../controllers/movie.controller';

const router = Router();

router.get('/trending', movieController.getTrending);
router.get('/top-rated', movieController.getTopRated);
router.get('/genre/:genreId', movieController.getByGenre);
router.get('/search', movieController.search);
// /:id/videos must come before the bare /:id catch-all
router.get('/:id/videos', movieController.getMovieVideos);
router.get('/:id', movieController.getMovieDetails);

export default router;
