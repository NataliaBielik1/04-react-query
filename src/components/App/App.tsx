import toast, { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
import SeearchBar from "../SearchBar/SeearchBar";
import styles from "./App.module.css";
import type { Movie } from "../../types/movie";
import { fetchMovies } from "../../services/movieService";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieGrid from "../MovieGrid/MovieGrid";
import MovieModal from "../MovieModal/MovieModal";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import ReactPaginate from "react-paginate";
function App() {
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [query, setQuery] = useState<string>("")
  const [page, setPage] = useState<number>(1)

  const { data, isPending, isError, isSuccess } = useQuery({
    queryKey: ["movies", query, page],
    queryFn: () => fetchMovies(query, page),
    enabled: query !== "",
    placeholderData: keepPreviousData,
  });

  const handleSearch = (newQuery: string) => {
    setPage(1)
    setQuery(newQuery);
  };

  const handleSelectMovie = (movie: Movie | null) => {
   setSelectedMovie(movie)
  }
  
  useEffect(() => {

    if (isSuccess && data.results.length === 0) {
  toast.error("No movies found for your request.");
}


  }, [data?.results.length, isSuccess])  

const totalPages = data?.total_pages ?? 0

  return (
    <div className={styles.app}>
      <SeearchBar onSubmit={handleSearch} />
      {isSuccess && totalPages > 1 && (
        <ReactPaginate
          pageCount={totalPages}
          pageRangeDisplayed={5}
          marginPagesDisplayed={1}
          onPageChange={({ selected }) => setPage(selected + 1)}
          forcePage={page - 1}
          containerClassName={styles.pagination}
          activeClassName={styles.active}
          nextLabel="→"
          previousLabel="←"
        />
      )}
      {query !== "" && isPending && <Loader />}
      {isError && <ErrorMessage />}
      {isSuccess && data.results.length > 0 && (
        <MovieGrid movies={data.results} onSelect={handleSelectMovie} />
      )}
      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          onClose={() => handleSelectMovie(null)}
        />
      )}
      <Toaster />
    </div>
  );
}

export default App;
