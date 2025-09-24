//import "./MovieCard.css";

interface MovieCardProps {
  id: number;
  title: string;
  year: number;
  genre: string;
  onSelect: (id: number) => void;
}

export function MovieCard({ id, title, year, genre, onSelect }: MovieCardProps) {
  return (
    <div className="card" onClick={() => onSelect(id)}>
      <h3>{title}</h3>
      <p>{year} - {genre}</p>
    </div>
  );
}
