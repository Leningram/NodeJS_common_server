function errorHandler(err, _req, res, _next) {
  const statusCode = err.statusCode ?? 500;

  if (statusCode === 500) {
    console.log(err.message);

    return res.status(500).json({
      error: 'Internal server error',
    });
  }

  res.status(statusCode).json({
    error: err.message || 'Internal server error',
  });
}

module.exports = errorHandler;
