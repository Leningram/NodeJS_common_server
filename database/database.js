const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');

async function connectDB(database) {
  const db = await open({
    filename:
      database === ':memory:'
        ? database
        : database
          ? path.resolve(projectRoot, database)
          : path.resolve(projectRoot, 'database.sqlite'),
    driver: sqlite3.Database,
  });

  return db;
}

module.exports = connectDB;
