// File: backend/middleware/adminMiddleware.js
const admin = (req, res, next) => {
  // Middleware ini harus dijalankan setelah middleware 'protect'
  if (req.user && req.user.isAdmin) {
    next(); // Jika user ada dan dia adalah admin, lanjutkan
  } else {
    res.status(403); // 403 Forbidden
    throw new Error('Not authorized as an admin');
  }
};

export { admin };