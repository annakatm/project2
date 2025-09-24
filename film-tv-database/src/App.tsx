import { useEffect, useMemo, useState } from "react";
import MovieList from "./components/MovieList";
import MovieModal from "./components/MovieModal";
import SearchBar from "./components/SearchBar";
import "./App.css";

const MOVIES_QUERY = `
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
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetchMovies(v: Record<string, unknown>) {
    const res = await fetch("http://localhost:3001/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: MOVIES_QUERY, variables: v })
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    if (json.errors?.length) throw new Error(json.errors[0].message || "GraphQL error");
    return json.data.movies as Array<any>;
  }

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetchMovies(variables)
      .then((data) => { if (!cancelled) setMovies(data); })
      .catch((e) => { if (!cancelled) setError(e.message || String(e)); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [variables]);

  const loadMore = async () => {
    const nextOffset = offset + limit;
    setOffset(nextOffset);
    try {
      const more = await fetchMovies({ ...variables, offset: nextOffset });
      setMovies((prev) => [...prev, ...more]);
    } catch (e: any) {
      setError(e.message || String(e));
    }
  };

  const selected = movies.find((m: any) => m.id === selectedMovie);

  return (
    <div className="app">
      <h1>Film & TV Database</h1>

      <SearchBar query={query} onChange={(v) => { setQuery(v); setOffset(0); }} />

      <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 12 }}>
        <select value={genre} onChange={(e) => { setGenre(e.target.value); setOffset(0); }}>
          <option value="">All genres</option>
          <option value="Sci-Fi">Sci-Fi</option>
          <option value="Action/Adventure">Action/Adventure</option>
          <option value="Fantasy/Adventure">Fantasy/Adventure</option>
          <option value="Fantasy">Fantasy</option>
          <option value="Drama/Mystery">Drama/Mystery</option>
          <option value="Biography/Drama">Biography/Drama</option>
        </select>
        <select value={sort} onChange={(e) => { setSort(e.target.value); setOffset(0); }}>
          <option value="year">Year</option>
          <option value="rating">Rating</option>
          <option value="title">Title</option>
        </select>
        <select value={order} onChange={(e) => { setOrder(e.target.value); setOffset(0); }}>
          <option value="desc">Desc</option>
          <option value="asc">Asc</option>
        </select>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}

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
