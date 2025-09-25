// src/components/MovieCard.tsx
import React from "react";

interface MovieCardProps {
  id: number;
  title: string;
  year: number;
  genre: string;
  onSelect: (id: number) => void;
}

export const MovieCard: React.FC<MovieCardProps> = ({ id, title, year, genre, onSelect }) => {
  return (
    <div className="card" onClick={() => onSelect(id)}>
      <h3>{title}</h3>
      <p>{year} • {genre}</p>
    </div>
  );
};
