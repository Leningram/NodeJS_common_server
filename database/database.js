const sqlite3 = require('sqlite3');
const { open } = require('sqlite');

async function connectDB() {
  const db = await open({
    filename: './database.sqlite',
    driver: sqlite3.Database,
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL
    )`);
  console.log('Database connected');

  return db;
}

module.exports = connectDB;
