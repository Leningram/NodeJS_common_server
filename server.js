const createApp = require('./app');
const connectDB = require('./database/database');
const migrate = require('./database/migrate');

async function startServer() {
  const db = await connectDB();
  await migrate(db);
  console.log('Database connected');

  const app = createApp(db);
  app.listen(3000, () => {
    console.log('Server is running');
  });
}

startServer();
