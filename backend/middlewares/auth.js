import ErrorHandler from "../utils/ErrorHandler.js";
import CatchAsyncError from "./catchAsyncErrors.js";
import jwt from "jsonwebtoken";
import User from "../model/user.js";
import Seller from "../model/seller.js";

export const isAuthenticatedUser = CatchAsyncError(async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return next(new ErrorHandler("Please login to continue", 401));
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

  req.user = await User.findById(decoded.id);

  next();
});

export const isSeller = CatchAsyncError(async (req, res, next) => {
  const { seller_token } = req.cookies;

  if (!seller_token) {
    return next(new ErrorHandler("Please login to continue", 401));
  }

  const decoded = jwt.verify(seller_token, process.env.JWT_SECRET_KEY);

  req.seller = await Seller.findById(decoded.id);

  next();
});

export const isAdmin = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(`${req.user.role} can not access this resources!`)
      );
    }

    next();
  };
};
