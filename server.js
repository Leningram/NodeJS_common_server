const createApp = require('./app');
const connectDB = require('./database/database');
const migrate = require('./database/migrate');

async function startServer() {
  const db = await connectDB(':memory:');
  await migrate(db);
  console.log('Database connected');

  const version = await db.get('PRAGMA user_version');
  const columns = await db.all('PRAGMA table_info(users)');

  console.log('user_version:', version.user_version);
  console.log('columns:', columns);
  const app = createApp(db);
  app.listen(3000, () => {
    console.log('Server is running');
  });
}

startServer();
