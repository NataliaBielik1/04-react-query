import axios from "axios";
import type { Movie } from "../types/movie";

interface TMDBRespons {
  results: Movie[];
  page: number;
  total_pages: number;
}

export const fetchMovies = async (query: string): Promise<Movie[]> => {
  const response = await axios.get<TMDBRespons>(
    "https://api.themoviedb.org/3/search/movie",
    {
      params: { query },
      headers: { Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}` },
    }
    );
    return response.data.results
};
