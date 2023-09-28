import CouponCode from "../model/couponCode.js";
import CatchAsyncError from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../utils/ErrorHandler.js";

export const createCouponCode = CatchAsyncError(async (req, res, next) => {
  const isCouponCodeExists = await CouponCode.find({
    name: req.body.name,
  });

  if (isCouponCodeExists.length !== 0) {
    return next(new ErrorHandler("Coupoun code already exists!", 400));
  }

  const couponCode = await CouponCode.create(req.body);

  res.status(201).json({
    success: true,
    couponCode,
  });
});

// get coupon codes of seller
export const getCouponCodes = CatchAsyncError(async (req, res, next) => {
  const couponCodes = await CouponCode.find({ sellerId: req.seller.id });

  res.status(201).json({
    success: true,
    couponCodes,
  });
});

// delete a coupon code
export const deleteCouponCode = CatchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  const couponCode = await CouponCode.findByIdAndDelete(id);

  if (!couponCode) {
    return next(new ErrorHandler("Coupon code dosen't exists!", 400));
  }

  res.status(201).json({
    success: true,
    message: "Coupon code deleted successfully!",
    id: couponCode._id,
  });
});

// get coupon code value by its name
export const getCouponCode = CatchAsyncError(async (req, res, next) => {
  const { name } = req.params;
  const couponCode = await CouponCode.findOne({ name });

  res.status(200).json({
    success: true,
    couponCode,
  });
});
