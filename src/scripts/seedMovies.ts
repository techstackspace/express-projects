import mongoose from 'mongoose';
import axios from 'axios';
import { Movie } from '../models/Movie';

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE = 'https://api.themoviedb.org/3';

const fetchTopRatedMovies = async () => {
  const { data } = await axios.get(`${TMDB_BASE}/movie/top_rated`, {
    params: { api_key: TMDB_API_KEY, language: 'en-US', page: 1 },
  });
  return data.results.slice(0, 10); // Top 10 movies
};

const fetchMovieDetails = async (id: number) => {
  const { data } = await axios.get(`${TMDB_BASE}/movie/${id}`, {
    params: { api_key: TMDB_API_KEY, language: 'en-US' },
  });
  return data;
};

const seed = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/movies-db');

    const topMovies = await fetchTopRatedMovies();

    for (const movie of topMovies) {
      const details = await fetchMovieDetails(movie.id);

      const movieData = {
        title: details.title,
        description: details.overview,
        posterUrl: `https://image.tmdb.org/t/p/original${details.poster_path}`,
        trailerUrl: `https://www.youtube.com/results?search_query=${encodeURIComponent(
          details.title + ' trailer'
        )}`, // not direct, but works as a link
        genres: details.genres.map((g: any) => g.name),
        rating: {
          average: details.vote_average,
          count: details.vote_count,
        },
        duration: `${Math.floor(details.runtime / 60)}h ${
          details.runtime % 60
        }m`,
        releaseDate: details.release_date,
        status: details.status,
        countries: details.production_countries.map((c: any) => c.name),
        budget: `$${details.budget.toLocaleString()}`,
        revenue: `$${details.revenue.toLocaleString()}`,
        tagline: details.tagline,
        productionCompanies: details.production_companies.map(
          (p: any) => p.name
        ),
        homepage: details.homepage,
      };

      await Movie.create(movieData);
      console.log(`✅ Seeded movie: ${details.title}`);
    }

    console.log('🌱 Seeding complete.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  }
};

seed();