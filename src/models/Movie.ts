import { Schema, model, Document, Types } from "mongoose";

interface IMovie extends Document {
  title: string;
  description?: string;
  posterUrl?: string;
  trailerUrl?: string;
  genres: string[];
  rating?: {
    average: number;
    count: number;
  };
  duration?: string;
  releaseDate?: string;
  status?: string;
  countries: string[];
  budget?: string;
  revenue?: string;
  tagline?: string;
  productionCompanies?: string[];
  homepage?: string;
  likes: Types.ObjectId[];
}

const movieSchema = new Schema<IMovie>(
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
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }], // Store user IDs who liked the movie
  },
  { timestamps: true }
);

export const Movie = model<IMovie>("Movie", movieSchema);
