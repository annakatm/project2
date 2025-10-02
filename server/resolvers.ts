// server/resolvers.ts
import { openDb } from "./db";

type MoviesArgs = {
  search?: string;
  genre?: string;
  sort?: string; // "year" | "rating" | "title"
  order?: string; // "asc" | "desc"
  limit?: number;
  offset?: number;
};

export const resolvers = {
  Query: {
    movies: async (_: unknown, args: MoviesArgs) => {
      const db = await openDb();
      const where: string[] = [];
      const params: any[] = [];

      if (args.search && args.search.trim() !== "") {
        where.push("LOWER(title) LIKE ?");
        params.push(`%${args.search.toLowerCase()}%`);
      }

      if (args.genre && args.genre.trim() !== "") {
        where.push("genre = ?");
        params.push(args.genre);
      }

      const whereClause = where.length > 0 ? `WHERE ${where.join(" AND ")}` : "";

      const sortableColumns: Record<string, string> = {
        title: "title",
        year: "year",
        rating: "rating",
      };
      const sortColumn = args.sort && sortableColumns[args.sort] ? sortableColumns[args.sort] : undefined;
      const order = args.order && args.order.toLowerCase() === "asc" ? "ASC" : "DESC";
      const orderClause = sortColumn ? `ORDER BY ${sortColumn} ${order}` : "";

      const limit = typeof args.limit === "number" && args.limit > 0 ? args.limit : 20;
      const offset = typeof args.offset === "number" && args.offset >= 0 ? args.offset : 0;

      const sql = `SELECT * FROM movies ${whereClause} ${orderClause} LIMIT ? OFFSET ?`;
      const rows = await db.all(sql, [...params, limit, offset]);
      await db.close();
      return rows;
    },

    movie: async (_: unknown, args: { id: string }) => {
      const db = await openDb();
      const row = await db.get("SELECT * FROM movies WHERE id = ?", [args.id]);
      await db.close();
      return row;
    },

    favorites: async (_: unknown, args: { userId: string }) => {
      const db = await openDb();
      const rows = await db.all(
        `SELECT m.* FROM movies m 
         INNER JOIN user_favorites uf ON m.id = uf.movie_id 
         WHERE uf.user_id = ?`,
        [args.userId]
      );
      await db.close();
      return rows;
    },
  },

  Mutation: {
    rateMovie: async (_: unknown, args: { movieId: number; userId: string; value: number }) => {
      const db = await openDb();
      await db.run(
        `INSERT INTO movie_ratings (movie_id, user_id, value)
         VALUES (?, ?, ?)
         ON CONFLICT(movie_id, user_id) DO UPDATE SET value=excluded.value`,
        [args.movieId, args.userId, args.value]
      );

      const avg = await db.get(`SELECT AVG(value) as average FROM movie_ratings WHERE movie_id = ?`, [args.movieId]);
      await db.run(`UPDATE movies SET rating = ? WHERE id = ?`, [avg.average, args.movieId]);

      const movie = await db.get(`SELECT * FROM movies WHERE id = ?`, [args.movieId]);
      await db.close();
      return movie;
    },

    toggleFavorite: async (_: unknown, args: { userId: string; movieId: number }) => {
      const db = await openDb();
      const exists = await db.get(
        `SELECT * FROM user_favorites WHERE user_id = ? AND movie_id = ?`,
        [args.userId, args.movieId]
      );

      if (exists) {
        await db.run(`DELETE FROM user_favorites WHERE user_id = ? AND movie_id = ?`, [args.userId, args.movieId]);
      } else {
        await db.run(`INSERT INTO user_favorites (user_id, movie_id) VALUES (?, ?)`, [args.userId, args.movieId]);
      }

      const favorites = await db.all(
        `SELECT m.* FROM movies m 
         INNER JOIN user_favorites uf ON m.id = uf.movie_id 
         WHERE uf.user_id = ?`,
        [args.userId]
      );

      await db.close();
      return favorites;
    },
  },
};
