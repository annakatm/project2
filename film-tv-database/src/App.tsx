import { useMemo, useState } from "react";
import { useQuery } from "@apollo/client/react";
import { gql } from "@apollo/client";
import MovieList from "./components/MovieList";
import MovieModal from "./components/MovieModal";
import SearchBar from "./components/SearchBar";
import "./App.css";

const MOVIES_QUERY = gql`
  query Movies($search: String, $genre: String, $sort: String, $order: String, $limit: Int, $offset: Int) {
    movies(search: $search, genre: $genre, sort: $sort, order: $order, limit: $limit, offset: $offset) {
      id
      title
      year
      genre
      rating
      description
    }
  }
`;

function App() {
  const [query, setQuery] = useState("");
  const [genre, setGenre] = useState("");
  const [sort, setSort] = useState("year");
  const [order, setOrder] = useState("desc");
  const limit = 12;
  const [offset, setOffset] = useState(0);
  const [selectedMovie, setSelectedMovie] = useState<number | null>(null);

  const variables = useMemo(() => ({
    search: query || undefined,
    genre: genre || undefined,
    sort,
    order,
    limit,
    offset
  }), [query, genre, sort, order, limit, offset]);
  type Movie = { id: number; title: string; year: number; genre: string; rating: number; description: string };
  type MoviesData = { movies: Movie[] };
  type MoviesVars = { search?: string; genre?: string; sort?: string; order?: string; limit?: number; offset?: number };

  const { data, loading, error, fetchMore, refetch } = useQuery<MoviesData, MoviesVars>(MOVIES_QUERY, { variables, notifyOnNetworkStatusChange: true });
  console.log({ data, loading, error });

  const movies = data?.movies ?? [];
  const loadMore = async () => {
    const nextOffset = offset + limit;
    setOffset(nextOffset);
    await fetchMore({ variables: { ...variables, offset: nextOffset } });
  };

  const selected = movies.find((m: any) => m.id === selectedMovie);

  return (
    <div className="app">
      <h1>Film & TV Database</h1>

      <SearchBar query={query} onChange={(v) => { setQuery(v); setOffset(0); refetch({ ...variables, search: v || undefined, offset: 0 }); }} />

      <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 12 }}>
        <select value={genre} onChange={(e) => { setGenre(e.target.value); setOffset(0); refetch({ ...variables, genre: e.target.value || undefined, offset: 0 }); }}>
          <option value="">All genres</option>
          <option value="Sci-Fi">Sci-Fi</option>
          <option value="Action/Adventure">Action/Adventure</option>
          <option value="Fantasy/Adventure">Fantasy/Adventure</option>
          <option value="Fantasy">Fantasy</option>
          <option value="Drama/Mystery">Drama/Mystery</option>
          <option value="Biography/Drama">Biography/Drama</option>
        </select>
        <select value={sort} onChange={(e) => { setSort(e.target.value); setOffset(0); refetch({ ...variables, sort: e.target.value, offset: 0 }); }}>
          <option value="year">Year</option>
          <option value="rating">Rating</option>
          <option value="title">Title</option>
        </select>
        <select value={order} onChange={(e) => { setOrder(e.target.value); setOffset(0); refetch({ ...variables, order: e.target.value, offset: 0 }); }}>
          <option value="desc">Desc</option>
          <option value="asc">Asc</option>
        </select>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>Error: {error.message}</p>}

      <MovieList movies={movies} onSelect={setSelectedMovie} />

      <div style={{ marginTop: 12 }}>
        <button onClick={loadMore}>Load more</button>
      </div>

      {selected && (
        <MovieModal
          title={selected.title}
          description={selected.description}
          onClose={() => setSelectedMovie(null)}
        />
      )}
    </div>
  );
}

export default App;
