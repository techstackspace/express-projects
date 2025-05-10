import { Schema, model } from 'mongoose';

const movieSchema = new Schema(
  {
    title: { type: String, required: true },
    description: String,
    posterUrl: String,
    trailerUrl: String,
    genres: [String],
    rating: {
      average: Number,
      count: Number,
    },
    duration: String,
    releaseDate: String,
    status: String,
    countries: [String],
    budget: String,
    revenue: String,
    tagline: String,
    productionCompanies: [String],
    homepage: String,
  },
  { timestamps: true }
);

export const Movie = model('Movie', movieSchema);