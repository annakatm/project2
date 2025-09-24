// server/db.ts
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import path from "path";

export async function openDb() {
  // Database file anchored to this file's directory: server/database/movies.db
  const dbPath = path.resolve(__dirname, "database", "movies.db");
  return open({
    filename: dbPath,
    driver: sqlite3.Database,
  });
}




