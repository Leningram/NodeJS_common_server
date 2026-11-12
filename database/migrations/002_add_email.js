module.exports = {
  version: 2,
  up: async (db) => {
    const columns = await db.all('PRAGMA table_info(users)');
    const columnExists = columns.some((item) => item.name === 'email');
    if (!columnExists) {
      await db.exec('ALTER TABLE users ADD COLUMN email text');
    }
  },
};
