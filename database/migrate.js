const migration1 = require('./migrations/001_create_users');

async function migrate(db) {
  const result = await db.get('PRAGMA user_version');
  const version = result.user_version;
  console.log('Before migration:', version);
  const migrationVersion = migration1.version;
  if (version < migrationVersion) {
    await db.exec('BEGIN');
    try {
      await migration1.up(db);
      await db.exec(`PRAGMA user_version = ${migrationVersion}`);
      await db.exec('COMMIT')
    } catch (error) {
      console.log('Migration failed:', error.message);
      await db.exec('ROLLBACK');
      throw error;
    }
  }
  const updated = await db.get('PRAGMA user_version');
  console.log('After migration:', updated.user_version);
}

module.exports = migrate;
