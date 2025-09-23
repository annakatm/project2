type Props = {
  title: string;
  year: number;
  genre: string;
  rating: number;
  description: string;
  onBack: () => void;
};

export function MovieDetails({ title, year, genre, rating, description, onBack }: Props) {
  return (
    <div className="p-4">
      <button onClick={onBack} className="mb-3 underline">
        ← Back to list
      </button>
      <h1 className="text-xl font-bold">{title}</h1>
      <p>{year} · {genre}</p>
      <p>⭐ {rating}</p>
      <p className="mt-2">{description}</p>
    </div>
  );
}
