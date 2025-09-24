import { MovieCard } from "./MovieCard";

interface Movie {
  id: number;
  title: string;
  year: number;
  genre: string;
}

interface MovieListProps {
  movies: Movie[];
  onSelect: (id: number) => void;
}

function MovieList({ movies, onSelect }: MovieListProps) {
  return (
    <div className="movie-grid">
      {movies.map((movie) => (
        <MovieCard
          key={movie.id}
          id={movie.id}
          title={movie.title}
          year={movie.year}
          genre={movie.genre}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}

export default MovieList;
