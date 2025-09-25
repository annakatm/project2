// MovieDetails.tsx

import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";

interface Props {
  id: number;
  title: string;
  year: number;
  genre: string;
  rating: number;
  description: string;
  userId: string;
  isFavorite: boolean;
  onBack: () => void;
  refetchMovies: () => void;
  refetchFavorites: () => void;
}

const TOGGLE_FAVORITE = gql`
  mutation ToggleFavorite($userId: ID!, $movieId: ID!) {
    toggleFavorite(userId: $userId, movieId: $movieId) {
      id
    }
  }
`;

const RATE_MOVIE = gql`
  mutation RateMovie($movieId: ID!, $userId: ID!, $value: Float!) {
    rateMovie(movieId: $movieId, userId: $userId, value: $value) {
      id
      rating
    }
  }
`;

export const MovieDetails: React.FC<Props> = ({
  id,
  title,
  year,
  genre,
  rating,
  description,
  userId,
  isFavorite,
  onBack,
  refetchMovies,
  refetchFavorites,
}) => {
  const [toggleFavorite] = useMutation(TOGGLE_FAVORITE);
  const [rateMovie] = useMutation(RATE_MOVIE);

  const handleFavoriteClick = async () => {
    await toggleFavorite({ variables: { userId, movieId: id } });
    refetchFavorites();
  };

  const handleRating = async (value: number) => {
    await rateMovie({ variables: { movieId: id, userId, value } });
    refetchMovies();
  };

  return (
    <div className="modal">
      <button onClick={onBack} style={{ marginBottom: 12, textDecoration: "underline" }}>
        ← Back to list
      </button>

      <h1>{title}</h1>
      <p>{year} • {genre}</p>
      <p style={{ marginTop: 4 }}>⭐ {rating.toFixed(1)}</p>
      <p style={{ marginTop: 8 }}>{description}</p>

      <div style={{ marginTop: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <button
          onClick={handleFavoriteClick}
          style={{
            backgroundColor: isFavorite ? "#ffcc00" : "#eee",
            border: "none",
            padding: "4px 8px",
            borderRadius: 6,
            cursor: "pointer",
          }}
        >
          {isFavorite ? "★ Favorite" : "☆ Favorite"}
        </button>

        <div>
          {[1, 2, 3, 4, 5].map((r) => (
            <span
              key={r}
              onClick={() => handleRating(r)}
              style={{
                cursor: "pointer",
                color: r <= Math.round(rating) ? "#ff9900" : "#ccc",
                fontWeight: "bold",
                marginLeft: 2,
                fontSize: 18,
              }}
            >
              ★
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};