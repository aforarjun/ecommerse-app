import express from "express";

import {
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
    verifyAccount,
} from "../controllers/userController.js";

import { authorizeRoles, isAuthenticatedUser } from "../middlewares/auth.js";

const router = express.Router();

// register
router.post("/create-user", signupUser);
router.post("/verify-user", verifyAccount);

// login - logout
router.post("/login-user", loginUser);
router.post("/logout-user", logoutUser);

// password forget and the reset
router.post("/forget-password", forgetPassword);
router.post("/reset-password", resetPassword);

// Load user - LOGGEDIN USER
router.get("/load-user", isAuthenticatedUser, loadUser);


// Get user Details - ADMIN / LOGGEDIN USER
router.get("/get-user/:userId", isAuthenticatedUser, getUserDetails);

// Update a User Details    -   ADMIN / LOGGEDIN USER
router.put("/update-user/:userId", isAuthenticatedUser, getAllUsers);

// Update password    -   LOGGEDIN USER
router.put("/update-password/:userId", isAuthenticatedUser, updatePassword);

// Delete User   -   LOGGEDIN USER
router.post("/delete-user/:userId", isAuthenticatedUser, updatePassword);

// update user address
router.put("/update-user-addresses/:userId", isAuthenticatedUser, updateUserAddresses)

// delete user address
router.post("/delete-user-address/:userId", isAuthenticatedUser, deleteUserAddress)

// Get all the users    - ADMIN
router.get("/users", isAuthenticatedUser, authorizeRoles("admin"), getAllUsers);

// Update User avatar
router.put("/update-avatar", isAuthenticatedUser, updateUserAvatar)

export default router;
