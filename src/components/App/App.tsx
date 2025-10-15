import toast, { Toaster } from "react-hot-toast";
import { useState } from "react";
import SeearchBar from "../SearchBar/SeearchBar";
import styles from "./App.module.css";
import type { Movie } from "../../types/movie";
import { fetchMovies } from "../../services/movieService";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieGrid from "../MovieGrid/MovieGrid";
import MovieModal from "../MovieModal/MovieModal";
function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const handleSearch = async (query: string) => {
    try {
      setIsError(false);
      setIsLoading(true);
      setMovies([]);
      const fetchedMovies = await fetchMovies(query);
      if (fetchedMovies.length === 0) {
        toast.error("no movies found for your request");
        return;
      }
      setMovies(fetchedMovies);
    } catch {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectMovie = (movie: Movie | null) => {
   setSelectedMovie(movie)
 }
  return (
    <div className={styles.app}>
      
      <SeearchBar onSubmit={handleSearch} />
      {isLoading && <Loader />}
      {isError && <ErrorMessage />}
      {movies.length > 0 && <MovieGrid movies={movies} onSelect={handleSelectMovie} />}
      {selectedMovie && <MovieModal movie={selectedMovie} onClose={()=>handleSelectMovie(null) } /> }
      <Toaster />
    </div>
  );
}

export default App;
