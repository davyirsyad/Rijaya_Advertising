// File: backend/server.js (VERSI BARU YANG LEBIH TANGGUH)

import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose"; // Kita butuh mongoose di sini untuk koneksi
import path from "path";


// Import Rute
import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

dotenv.config();

const app = express();

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// CORS Middleware
app.use(cors());

// Definisi Rute API
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);

// GUNAKAN ERROR HANDLER DI AKHIR
app.use(notFound);
app.use(errorHandler);
// ... (const PORT dan startServer)

// Konfigurasi untuk Produksi & Pengembangan
const __dirname = path.resolve();
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/build")));
  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"))
  );
} else {
  app.use(express.static(path.join(__dirname, "/frontend")));
  app.get("/", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "index.html"));
  });
}

const PORT = process.env.PORT || 5000;

// --- FUNGSI UNTUK MEMULAI SERVER SECARA BERURUTAN ---
const startServer = async () => {
  try {
    // 1. Tunggu hingga koneksi ke MongoDB berhasil
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected successfully!");

    // 2. SETELAH database terhubung, BARU jalankan server Express
    app.listen(PORT, () => {
      console.log(
        `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`
      );
    });
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1); // Keluar dari proses jika koneksi gagal
  }
};

// Panggil fungsi untuk memulai semuanya
startServer();
