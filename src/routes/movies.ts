import { Router } from 'express';
import { Movie } from '../models/Movie';

const router = Router();

// 🎬 GET /api/movies/genres
router.get('/genres', async (_req, res) => {
  try {
    const genres = await Movie.distinct('genres');
    res.json(genres);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching genres', error });
  }
});

// 🔍 GET /api/movies?search=&genre=&country=&limit=&page=
router.get('/', async (req, res) => {
  try {
    const { search = '', genre, country, limit = 10, page = 1 } = req.query;

    const filters: any = {};

    // Search by title (case-insensitive)
    if (search) {
      filters.title = { $regex: search, $options: 'i' };
    }

    // Filter by genre
    if (genre) {
      filters.genres = genre;
    }

    // Filter by country
    if (country) {
      filters.countries = country;
    }

    const perPage = parseInt(limit as string, 10);
    const currentPage = parseInt(page as string, 10);

    const movies = await Movie.find(filters)
      .sort({ releaseDate: -1 }) // Latest first
      .skip((currentPage - 1) * perPage)
      .limit(perPage);

    const total = await Movie.countDocuments(filters);

    res.json({
      page: currentPage,
      totalPages: Math.ceil(total / perPage),
      totalMovies: total,
      movies,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching movies', error });
  }
});

// 🌟 GET /api/movies/top
router.get('/top', async (_req, res) => {
  try {
    const topMovies = await Movie.find()
      // .sort({ "rating.average": -1, "rating.count": -1 });
      .limit(9);

    res.json(topMovies);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching top movies', error });
  }
});

// 🔍 GET /api/movies/:id
router.get('/:id', async (req: any, res: any) => {
  try {
    const movie = await Movie.findById(req.params.id);

    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    res.json(movie);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching movie by ID', error });
  }
});

// ➕ POST /api/movies
router.post('/', async (req, res) => {
  try {
    const movie = new Movie(req.body);
    await movie.save();
    res.status(201).json(movie);
  } catch (error) {
    res.status(400).json({ message: 'Invalid movie data', error });
  }
});

export default router;
