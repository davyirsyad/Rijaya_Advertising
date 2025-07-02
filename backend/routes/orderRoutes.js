// File: backend/routes/orderRoutes.js (File Baru)
import express from 'express';
const router = express.Router();
import {
  addOrderItems,
  getOrderById,
  getOrders,
} from '../controllers/orderController.js';

// BENAR:
import { protect } from '../middleware/authMiddleware.js';
import { admin } from '../middleware/adminMiddleware.js';

router.route('/')
    .post(protect, addOrderItems) // User biasa bisa membuat order
    .get(protect, admin, getOrders); // Hanya admin bisa lihat semua order

router.route('/:id').get(protect, getOrderById); // User bisa lihat order miliknya

export default router;