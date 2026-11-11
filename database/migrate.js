const path = require('path');
const fs = require('fs/promises');

const migrationsDir = path.join(__dirname, 'migrations');

async function migrate(db) {
  const files = await fs.readdir(migrationsDir);

  const migrations = files
    .map((file) => {
      const migrationFile = require(path.join(migrationsDir, file));
      return migrationFile;
    })
    .sort((a, b) => a.version - b.version);
  const result = await db.get('PRAGMA user_version');
  const currentVersion = result.user_version;

  const migrationsVersions = new Set();
  migrations.forEach((migration) => {
    const version = migration.version;
    const up = migration.up;
    if (!Number.isInteger(version) || version <= 0 || typeof up !== 'function') {
      throw new Error('Invalid migration');
    }
    if (migrationsVersions.has(version)) {
      throw new Error(`Duplicate migration version: ${version}`);
    } else {
      migrationsVersions.add(version);
    }
  });

  const pendingMigrations = migrations.filter((m) => m.version > currentVersion);

  for (const migration of pendingMigrations) {
    await db.exec('BEGIN');
    try {
      await migration.up(db);
      await db.exec(`PRAGMA user_version = ${migration.version}`);
      await db.exec('COMMIT');
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
