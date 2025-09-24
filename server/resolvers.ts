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

    movie: async (_: unknown, args: { id: number }) => {
      const db = await openDb();
      const row = await db.get("SELECT * FROM movies WHERE id = ?", [args.id]);
      await db.close();
      return row;
    },
  },
};




