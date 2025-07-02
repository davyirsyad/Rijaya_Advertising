// Middleware untuk menangani rute yang tidak ditemukan (404)
const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// Middleware utama untuk menangani semua jenis error
const errorHandler = (err, req, res, next) => {
  // Kadang error datang dengan status 200, kita ubah jadi 500
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  // Khusus untuk error Mongoose (misal: ID tidak valid)
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    statusCode = 404;
    message = 'Resource not found';
  }

  res.status(statusCode).json({
    message: message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

export { notFound, errorHandler };