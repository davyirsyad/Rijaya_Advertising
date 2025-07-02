import express from "express";
const router = express.Router();
import {
  authUser,
  registerUser,
  logOutUser,
  getUserProfile,
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

router.post("/register", registerUser);
router.post("/login", authUser);
router.post("/logout", logOutUser);
router.get("/profile", protect, getUserProfile); // Rute profile dilindungi

export default router;
