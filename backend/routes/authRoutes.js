import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  getMyProfile,
  updateMyProfile,
  getAllUsers,
  updateUserRole,
  deleteUser,
} from "../controllers/authController.js";
import { isAuthenticated, authorizeRoles } from "../middleware/auth.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", logoutUser);

router.get("/me", isAuthenticated, getMyProfile);
router.put("/me", isAuthenticated, updateMyProfile);

// Admin-only user management
router.get("/users", isAuthenticated, authorizeRoles("admin"), getAllUsers);
router.put(
  "/users/:id/role",
  isAuthenticated,
  authorizeRoles("admin"),
  updateUserRole
);
router.delete(
  "/users/:id",
  isAuthenticated,
  authorizeRoles("admin"),
  deleteUser
);

export default router;
