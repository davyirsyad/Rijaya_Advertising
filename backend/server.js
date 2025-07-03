// File: backend/server.js (VERSI BARU YANG SUDAH DIPERBAIKI)

import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js'; // Kita akan menggunakan file koneksi terpisah

// Import Rute
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

// Jalankan konfigurasi environment dan koneksi DB
dotenv.config();
connectDB(); // Panggil fungsi koneksi database

const app = express();

// Middleware untuk body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware untuk CORS (Konfigurasi Anda sudah benar)
app.use(cors({
  origin: [
    'http://127.0.0.1:5500', 
    'https://rijaya-advertising.vercel.app'
  ],
  credentials: true
}));

// Rute Utama untuk tes cepat
app.get('/', (req, res) => {
  res.send('API for Rijaya Advertising is running...');
});

// Definisi Rute API
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);

// Middleware untuk penanganan error (Harus di bagian akhir)
app.use(notFound);
app.use(errorHandler);

// Ekspor 'app' untuk Vercel
export default app;