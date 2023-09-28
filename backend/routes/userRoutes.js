import express from "express";
import { upload } from "../multer/multer.js";

import {
  deleteUser,
  deleteUserAddress,
  forgetPassword,
  getAllUsers,
  getUserDetails,
  loadUser,
  loginUser,
  logoutUser,
  resetPassword,
  signupUser,
  updatePassword,
  updateUserAddresses,
  updateUserAvatar,
  activateAccount,
  updateUser,
} from "../controllers/userController.js";

import { isAdmin, isAuthenticatedUser } from "../middlewares/auth.js";

const router = express.Router();

// register
router.post("/create-user", upload.single("file"), signupUser);
router.post("/activate-user", activateAccount);

// login - logout
router.post("/login-user", loginUser);
router.get("/logout-user", logoutUser);

// password forget and the reset
router.post("/forget-password", forgetPassword);
router.post("/reset-password", resetPassword);

// Load user - LOGGEDIN USER
router.get("/load-user", isAuthenticatedUser, loadUser);

// Get user Details - ADMIN / LOGGEDIN USER
router.get("/get-user/:userId", isAuthenticatedUser, getUserDetails);

// Update a User Details    -   ADMIN / LOGGEDIN USER
router.put("/update-user", isAuthenticatedUser, updateUser);

// Update password    -   LOGGEDIN USER
router.put("/update-password/:userId", isAuthenticatedUser, updatePassword);

// Delete User   -   LOGGEDIN USER
router.post("/delete-user/:userId", isAuthenticatedUser, deleteUser);

// update user address
router.put("/update-user-addresses", isAuthenticatedUser, updateUserAddresses);

// delete user address
router.delete(
  "/delete-user-address/:addressId",
  isAuthenticatedUser,
  deleteUserAddress
);

// Get all the users    - ADMIN
router.get("/users", isAuthenticatedUser, isAdmin("Admin"), getAllUsers);

// Update User avatar
router.put(
  "/update-avatar",
  isAuthenticatedUser,
  upload.single("file"),
  updateUserAvatar
);

export default router;
