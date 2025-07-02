import express from "express";
const router = express.Router();

// Impor controller yang sudah kita perbaiki
import {
  getProducts,
  getProductById,
  deleteProduct,
  createProduct,
  updateProduct,
} from "../controllers/productController.js";

// Impor middleware otentikasi kita sendiri
import { protect, admin } from "../middleware/authMiddleware.js";

// --- Definisi Rute ---

// Rute untuk GET semua produk dan POST produk baru
router.route("/").get(getProducts).post(protect, admin, createProduct); // Dilindungi: Hanya admin yang bisa membuat produk

// Rute untuk GET, DELETE, dan UPDATE produk tunggal berdasarkan ID
router
  .route("/:id")
  .get(getProductById)
  .delete(protect, admin, deleteProduct) // Dilindungi: Hanya admin yang bisa menghapus
  .put(protect, admin, updateProduct); // Dilindungi: Hanya admin yang bisa mengedit

export default router;
