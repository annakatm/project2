// server/seed.ts
import { openDb } from "./db";

async function seed() {
  const db = await openDb();

  await db.exec(`
    DROP TABLE IF EXISTS movies;
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS movies (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      year INTEGER NOT NULL,
      genre TEXT NOT NULL,
      director TEXT,
      rating REAL,
      description TEXT
    )
  `);

  const movies = [
    // Christopher Nolan
    { title: "Interstellar", year: 2014, genre: "Sci-Fi", director: "Christopher Nolan", rating: 8.6, description: "Explorers travel through a wormhole in space to ensure humanity's survival." },
    { title: "Tenet", year: 2020, genre: "Action/Sci-Fi", director: "Christopher Nolan", rating: 7.4, description: "A secret agent manipulates time to prevent WWIII." },
    { title: "Inception", year: 2010, genre: "Sci-Fi/Thriller", director: "Christopher Nolan", rating: 8.8, description: "A thief enters dreams to steal secrets." },
    { title: "The Prestige", year: 2006, genre: "Drama/Mystery", director: "Christopher Nolan", rating: 8.5, description: "Two magicians compete in a rivalry." },
    { title: "Oppenheimer", year: 2023, genre: "Biography/Drama", director: "Christopher Nolan", rating: 8.0, description: "J. Robert Oppenheimer and the atomic bomb." },

    // The Hunger Games series
    { title: "The Hunger Games", year: 2012, genre: "Action/Adventure", director: "Gary Ross", rating: 7.2, description: "A dystopian fight for survival in televised games." },
    { title: "Catching Fire", year: 2013, genre: "Action/Adventure", director: "Francis Lawrence", rating: 7.5, description: "Katniss must survive the Quarter Quell." },
    { title: "Mockingjay Part 1", year: 2014, genre: "Action/Adventure", director: "Francis Lawrence", rating: 6.6, description: "Rebellion against the Capitol escalates." },
    { title: "Mockingjay Part 2", year: 2015, genre: "Action/Adventure", director: "Francis Lawrence", rating: 6.5, description: "The final battle for Panem." },

    // The Hobbit trilogy
    { title: "The Hobbit: An Unexpected Journey", year: 2012, genre: "Fantasy/Adventure", director: "Peter Jackson", rating: 7.8, description: "Bilbo joins dwarves to reclaim a mountain." },
    { title: "The Hobbit: The Desolation of Smaug", year: 2013, genre: "Fantasy/Adventure", director: "Peter Jackson", rating: 7.8, description: "Smaug awakens." },
    { title: "The Hobbit: The Battle of the Five Armies", year: 2014, genre: "Fantasy/Adventure", director: "Peter Jackson", rating: 7.4, description: "Epic battle for Erebor." },

    // The Lord of the Rings trilogy
    { title: "The Lord of the Rings: The Fellowship of the Ring", year: 2001, genre: "Fantasy/Adventure", director: "Peter Jackson", rating: 8.8, description: "A hobbit must destroy a powerful ring." },
    { title: "The Lord of the Rings: The Two Towers", year: 2002, genre: "Fantasy/Adventure", director: "Peter Jackson", rating: 8.7, description: "The fellowship is scattered; battles ensue." },
    { title: "The Lord of the Rings: The Return of the King", year: 2003, genre: "Fantasy/Adventure", director: "Peter Jackson", rating: 8.9, description: "The final confrontation for Middle-Earth." },

    // Harry Potter series (all 8)
    { title: "Harry Potter and the Philosopher's Stone", year: 2001, genre: "Fantasy", director: "Chris Columbus", rating: 7.6, description: "A young wizard begins his journey." },
    { title: "Harry Potter and the Chamber of Secrets", year: 2002, genre: "Fantasy", director: "Chris Columbus", rating: 7.4, description: "The mystery of the Chamber unfolds." },
    { title: "Harry Potter and the Prisoner of Azkaban", year: 2004, genre: "Fantasy", director: "Alfonso Cuarón", rating: 7.9, description: "Sirius Black escapes from Azkaban." },
    { title: "Harry Potter and the Goblet of Fire", year: 2005, genre: "Fantasy", director: "Mike Newell", rating: 7.7, description: "The Triwizard Tournament begins." },
    { title: "Harry Potter and the Order of the Phoenix", year: 2007, genre: "Fantasy", director: "David Yates", rating: 7.5, description: "The Order fights Voldemort's return." },
    { title: "Harry Potter and the Half-Blood Prince", year: 2009, genre: "Fantasy", director: "David Yates", rating: 7.6, description: "Secrets about Voldemort's past revealed." },
    { title: "Harry Potter and the Deathly Hallows: Part 1", year: 2010, genre: "Fantasy", director: "David Yates", rating: 7.7, description: "Searching for Horcruxes." },
    { title: "Harry Potter and the Deathly Hallows: Part 2", year: 2011, genre: "Fantasy", director: "David Yates", rating: 8.1, description: "Final battle against Voldemort." },
  ];

  const insert = await db.prepare(
    `INSERT INTO movies (title, year, genre, director, rating, description) VALUES (?, ?, ?, ?, ?, ?)`
  );
  try {
    for (const m of movies) {
      await insert.run(m.title, m.year, m.genre, m.director, m.rating, m.description);
    }
  } finally {
    await insert.finalize();
  }

  console.log("✅ Seeded movies database!");
  await db.close();
}

seed();




