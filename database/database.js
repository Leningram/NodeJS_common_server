const sqlite3 = require('sqlite3');
const { open } = require('sqlite');

async function connectDB(database) {
  const db = await open({
    filename: database || './database.sqlite',
    driver: sqlite3.Database,
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL
    )`);

  return db;
}

module.exports = connectDB;
