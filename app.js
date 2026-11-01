const express = require('express');
const userRouter = require('./routes/users');
const checkApiKey = require('./middleware/apiKey');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(express.json());
app.use((req, _res, next) => {
  console.log(req.method, req.url);
  next();
});
app.use('/users', userRouter);

app.get('/', (_req, res) => {
  res.send('Hello backend!');
});

app.get('/private', checkApiKey, (_req, res) => {
  res.json({ message: 'Access granted' });
});

app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
  });
});
app.use(errorHandler);

module.exports = app;
