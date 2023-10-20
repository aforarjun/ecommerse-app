import path from "path";
import fs from "fs";
import bcrypt from "bcryptjs";
import Seller from "../model/seller.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import CatchAsyncError from "../middlewares/catchAsyncErrors.js";
import sendMail from "../utils/sendMail.js";
import sellerToken from "../utils/shopToken.js";
import User from "../model/user.js";

// *************** Create Seller ***************
const getVerifyToken = async (id) => {
  const token = await bcrypt.hash(id.toString(), 10);
  await Seller.findByIdAndUpdate(id, {
    verifyToken: token,
    verifyTokenExpiry: Date.now() + 360000,
  });

  return token;
};
export const createSeller = CatchAsyncError(async (req, res, next) => {
  const { email, ...otherSeller } = req.body;

  const seller = await Seller.findOne({ email });
  const user = await User.findOne({ email });
  const isVerifiedUser = user?.isVerified || false;
  let newSeller;

  if (seller) {
    if (seller.isVerified) {
      return next(new ErrorHandler("Seller Already Exist", 400));
    } else {
      return next(
        new ErrorHandler(
          "Seller Already Exist but not verified, try login for verify again",
          400
        )
      );
    }
  }

  if (isVerifiedUser) {
    const sellerData = {
      name: user.name,
      email: user.email,
      password: user.password,
      phoneNumber: user.phoneNumber,
      address: user.addresses.filter(
        (address) => address.addressType === "home"
      )[0],
      avatar: {
        public_id: "This is demo",
        url: "profilepicurl",
      },
      isVerified: user.isVerified,
    };

    newSeller = await new Seller(sellerData).save();
  } else {
    newSeller = await new Seller({
      email,
      ...otherSeller,
      avatar: {
        public_id: "This is demo",
        url: "profilepicurl",
      },
    }).save();
  }

  // for verify the shop account by email
  let verificationToken;
  if (!isVerifiedUser) {
    verificationToken = await getVerifyToken(newSeller._id);
  }

  console.log(verificationToken);
  // verification Url
  const verificationUrl = `${req.protocol}://localhost:3000/seller/verification/${verificationToken}`;

  try {
    await sendMail({
      email: newSeller.email,
      subject: "Verification your Shop account",
      message: !isVerifiedUser
        ? `Hello ${newSeller.name}, please click on the link to verify your shop account: ${verificationUrl}`
        : `Hello ${newSeller.name}, Your Shop account has been created.`,
    });

    if (!isVerifiedUser) {
      res.status(201).json({
        success: true,
        message: `please check your shop email:- ${newSeller.email} to activate your shop account!`,
      });
    } else {
      res.status(201).json({
        success: true,
        message: "Your account has been created.",
        newSeller,
      });
    }
  } catch (error) {
    console.log(error);
    return next(new ErrorHandler(error.message, 500));
  }
});

// *************** Verify Seller ***************
export const verifySellerAccount = CatchAsyncError(async (req, res, next) => {
  const { verificationToken } = req.body;

  const newSeller = await Seller.findOne({
    verifyToken: verificationToken,
    verifyTokenExpiry: { $gt: Date.now() },
  });

  if (!newSeller) {
    return next(new ErrorHandler("Invalid token", 400));
  }

  newSeller.isVerified = true;
  newSeller.verifyToken = undefined;
  newSeller.verifyTokenExpiry = undefined;
  await newSeller.save();

  sellerToken(newSeller, res, 201);
});

// send verification code again if account exists but not verified
const sendVerificationCode = async (seller, req, res, next) => {
  try {
    const verificationToken = await getVerifyToken(seller._id);
    const verificationUrl = `${req.protocol}://localhost:3000/seller/verification/${verificationToken}`;

    await sendMail({
      email: seller.email,
      subject: "Verification your Shop account",
      message: `${seller.name} is not verified, please click on the link to verify your shop account: ${verificationUrl}`,
    });

    res.status(201).json({
      success: true,
      message: `please check your shop email:- ${seller.email} to activate your shop account!`,
    });
  } catch (error) {
    console.log(error);
    return next(new ErrorHandler(error.message, 500));
  }
};

// *************** Login / logout Seller Account ***************
export const loginSeller = CatchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;

  const seller = await Seller.findOne({ email }).select("+password");

  if (!seller) {
    return next(new ErrorHandler("invalid Email or password", 400));
  }

  const isPasswordMatched = await seller.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("invalid Email or password", 400));
  }

  if (!seller.isVerified) {
    console.log("seller is not verified");
    await sendVerificationCode(seller, req, res, next);
  } else {
    sellerToken(seller, res, 200);
  }
});

export const logoutSeller = CatchAsyncError(async (req, res, next) => {
  res.cookie("seller_token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
    secure: true,
  });

  res.status(200).json({
    success: true,
    message: "Seller Logged Out",
  });
});

// *************** Forget Password ***************
export const forgetPassword = CatchAsyncError(async (req, res, next) => {
  const { email } = req.body;

  const seller = await Seller.findOne({ email });

  if (!seller) {
    return next(new ErrorHandler("Seller account not found."), 400);
  }

  // Get RESET_PASSWORD TOKEN
  const resetPasswordToken = await seller.getResetPasswordToken();

  await seller.save({ validateBeforeSave: false });

  // reset password url
  const resetPasswordUrl = `${req.protocol}://localhost:3000/seller/password-reset/${resetPasswordToken}`;

  const message = `Your seller account password reset token is :- \n\n ${resetPasswordUrl} \n\nIf you have not requested this email then, please ignore it.`;

  try {
    await sendMail({
      email: seller.email,
      subject: `Ecommerce Password Recovery for seller account`,
      message,
    });

    res.status(200).json({
      success: true,
      message: `Email sent to ${seller.email} successfully`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiry = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new ErrorHandler(error.message, 500));
  }
});

// *************** Reset Password ***************
export const resetPassword = CatchAsyncError(async (req, res, next) => {
  // Hashing the token
  const { resetPasswordToken } = req.params;

  const seller = await Seller.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  // user not found
  if (!seller) {
    return next(
      new ErrorHandler(
        "Reset password token is invalid or has been exprired",
        400
      )
    );
  }

  // if user found but password and confirm password not patched
  if (req.body.password !== req.body.confirmPassword) {
    return next(
      new ErrorHandler("Password and confirm password is not matched", 400)
    );
  }

  seller.password = req.body.password;
  seller.resetPasswordToken = undefined;
  seller.resetPasswordExpiry = undefined;

  await user.save();

  // coz user changes the password => we can allow user to login
  sellerToken(seller, 200, res);
});

// *************** Load Seller ***************
export const loadSeller = CatchAsyncError(async (req, res, next) => {
  const seller = req.seller;

  if (!seller) {
    return next(new ErrorHandler("Something went wrong, Please login", 400));
  }

  res.status(200).json({
    success: true,
    seller,
  });
});

// *************** UPDATE Seller Password - LoggedIn Seller ***************
export const updatePassword = CatchAsyncError(async (req, res, next) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;
  const { sellerId } = req.params;

  const seller = await Seller.findById(sellerId).select("+password");

  const isPasswordMatch = await seller.comparePassword(oldPassword);

  if (!isPasswordMatch) {
    return next(new ErrorHandler("Old password is incorrect", 400));
  }

  if (newPassword !== confirmPassword) {
    return next(
      new ErrorHandler("new password is not matched with confirm password", 400)
    );
  }

  seller.password = newPassword;

  await seller.save();

  sendToken(seller, 200, res);
});

// *************** Delete a Seller - LoggedIn Seller ***************
export const deleteSeller = CatchAsyncError(async (req, res, next) => {
  const { sellerId } = req.params;

  await Seller.findByIdAndDelete(sellerId);

  res.status(200).json({ success: true, message: "Seller delete" });
});

// *************** Get Seller info - isSeller ***************
export const getSellerDetails = CatchAsyncError(async (req, res, next) => {
  const { sellerId } = req.params;

  const seller = await Seller.findById(sellerId);

  if (!seller) {
    return next(
      new ErrorHandler("User not found or you are not allowed to access"),
      400
    );
  }

  res.status(200).json({
    success: true,
    seller,
  });
});

// *************** UPDATE Seller DETAILS - LoggedIn Seller ***************
export const updateSeller = CatchAsyncError(async (req, res, next) => {
  const {
    params: { sellerId },
    body,
  } = req;

  const seller = await Seller.findById(sellerId);

  if (!seller) {
    return next(
      new ErrorHandler("Seller not found or Something went wrong", 400)
    );
  }

  const updatedSeller = await Seller.findByIdAndUpdate(sellerId, body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res
    .status(200)
    .json({ success: true, message: "Seller Updated", seller: updatedSeller });
});

// *************** update Seller avatar - LoggedIn Seller ***************
export const updateSellerAvatar = CatchAsyncError(async (req, res, next) => {
  if (!req.file) {
    return next(new ErrorHandler("File not exist", 400));
  }

  let existSeller = await Seller.findById(req.seller.id);

  // remove already exist image
  if (existSeller.avatar) {
    const existAvatar = existSeller.avatar.split(`${process.env.API_URL}/`)[1];
    const __dirname = path.resolve();
    fs.unlink(`${__dirname}/uploaded-images/${existAvatar}`, (err) => {
      if (err) {
        console.log(err, "File not deleted");
      } else {
        console.log("File deleted successfully");
      }
    });
  }

  // upload new avatar
  const filename = req.file.filename;
  const fileUrl = path.join(filename);
  existSeller.avatar = `${process.env.API_URL}/${fileUrl}`;

  await existSeller.save();

  res.status(200).json({
    success: true,
    seller: existSeller,
  });
});

// *************** Get All Sellers info - Admin ***************
export const getAllSellers = CatchAsyncError(async (req, res, next) => {
  const sellers = await Seller.findById();

  if (!sellers) {
    return next(
      new ErrorHandler("Users not found or you are not allowed to access"),
      400
    );
  }

  res.status(200).json({
    success: true,
    sellers,
  });
});
