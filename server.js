const createApp = require('./app');
const connectDB = require('./database/database');

async function startServer() {
  const db = await connectDB();
  console.log('Database connected');

  const app = createApp(db);
  app.listen(3000, () => {
    console.log('Server is running');
  });
}

startServer();
