module.exports = {
  version: 1,
  up: async (db) => {
    await db.exec('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL)');
  },
};
