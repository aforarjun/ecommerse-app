import express from 'express';

import { forgetPassword, loginUser, logoutUser, resetPassword, signupUser, verifyAccount } from "../controllers/userController.js";

// const {
//   authorizeRoles,
//   isAuthenticatedUser,
// } = require("../middlewares/Authentication.js");

const router = express.Router();

// register
router.post("/create-user", signupUser);
router.post("/verify-user", verifyAccount);
router.post("/login-user", loginUser);
router.post("/logout-user", logoutUser);
router.post("/forget-password", forgetPassword);
router.post("/reset-password", resetPassword);

// Get user Details - ADMIN / LOGGEDIN USER
// router.get("/user/:userId", isAuthenticatedUser, getUserDetaila);

// Get all the users
// router.get("/users", isAuthenticatedUser, authorizeRoles("admin"), getAllUsers);

// Update a User Details
// router.post("/user/:userId", isAuthenticatedUser, getAllUsers);

export default router;
