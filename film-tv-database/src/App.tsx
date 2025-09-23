import { useState } from "react";
import { movies } from "./data/movies";
import MovieList from "./components/MovieList";
import MovieModal from "./components/MovieModal";
import SearchBar from "./components/SearchBar";
import "./App.css";

function App() {
  const [query, setQuery] = useState("");
  const [selectedMovie, setSelectedMovie] = useState<number | null>(null);

  // Filtrer filmer etter søk
  const filtered = movies.filter((m) =>
    m.title.toLowerCase().includes(query.toLowerCase())
  );

  // Hent valgt film
  const movie = movies.find((m) => m.id === selectedMovie);

  return (
    <div className="app">
      <h1>Film & TV Database</h1>

      <SearchBar query={query} onChange={setQuery} />

      <MovieList movies={filtered} onSelect={setSelectedMovie} />

      {movie && (
        <MovieModal
          title={movie.title}
          description={movie.description}
          onClose={() => setSelectedMovie(null)}
        />
      )}
    </div>
  );
}

export default App;
