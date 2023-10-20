import path from "path";
import fs from "fs";
import jwt from "jsonwebtoken";
import User from "../model/user.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import CatchAsyncError from "../middlewares/catchAsyncErrors.js";
import sendMail from "../utils/sendMail.js";
import sendToken from "../utils/jwtToken.js";

// *************** Create User ***************
const createVarificationToken = (user) => {
  return jwt.sign(user, process.env.ACTIVATION_SECRET_KEY, {
    expiresIn: "5m",
  });
};
export const signupUser = CatchAsyncError(async (req, res, next) => {
  const { email, name, password } = req.body;

  const user = await User.findOne({ email });

  if (user) {
    const filename = req.file.filename;
    const filePath = `/uploaded-images/${filename}`;

    fs.unlink(filePath, (err) => {
      if (err) {
        console.log("File not deleted");
        res.status(500).json({ message: "Error deleting file" });
      } else {
        console.log("File deleted successfully");
        res.status(500).json({ message: "File deleted successfully" });
      }
    });

    return next(new ErrorHandler("User already exists", 400));
  }

  const filename = req.file.filename;
  const fileUrl = path.join(filename);
  const newUser = {
    email,
    name,
    password,
    avatar: `${process.env.API_URL}/${fileUrl}`,
  };

  // for activate the account by email
  const verificationToken = createVarificationToken(newUser);

  // verification Url
  const verificationUrl = `${req.protocol}://localhost:3000/auth/verification/${verificationToken}`;

  try {
    await sendMail({
      email: newUser.email,
      subject: "Verification your account",
      message: `Hello ${newUser.name}, please click on the link to verify your account: ${verificationUrl}`,
    });

    res.status(201).json({
      success: true,
      message: `please check your email:- ${newUser.email} to activate your account!`,
    });
  } catch (error) {
    console.log(error);
    return next(new ErrorHandler(error.message, 500));
  }
});

// *********** Verify User ***************
export const activateAccount = CatchAsyncError(async (req, res, next) => {
  const { verificationToken } = req.body;

  const newUser = jwt.verify(
    verificationToken,
    process.env.ACTIVATION_SECRET_KEY
  );

  if (!newUser) {
    return next(new ErrorHandler("Invalid token", 400));
  }

  const { name, email, password, avatar } = newUser;

  let isUserExist = await User.findOne({ email });

  if (isUserExist) {
    return next(new ErrorHandler("User already exists", 400));
  }

  const user = await User.create({
    name,
    email,
    password,
    avatar,
  });

  sendToken(user, 201, res);
});

// *************** Login User ***************
export const loginUser = CatchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Invalid Email or Password."), 400);
  }

  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid Email or Password."), 400);
  }

  sendToken(user, 200, res);
});

// *************** LogOut User ***************
export const logoutUser = CatchAsyncError(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
    secure: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged Out",
  });
});

// *************** Forget Password ***************
export const forgetPassword = CatchAsyncError(async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return next(new ErrorHandler("User not found."), 400);
  }

  // Get RESET_PASSWORD TOKEN
  const resetPasswordToken = await user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  // reset password url
  const resetPasswordUrl = `${req.protocol}://localhost:3000/password-reset/${resetPasswordToken}`;

  const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\nIf you have not requested this email then, please ignore it.`;

  try {
    await sendMail({
      email: user.email,
      subject: `Ecommerce Password Recovery`,
      message,
    });

    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully`,
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

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  // user not found
  if (!user) {
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

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpiry = undefined;

  await user.save();

  // coz user changes the password => we can allow user to login
  sendToken(user, 200, res);
});

// *************** Load user ***************
export const loadUser = CatchAsyncError(async (req, res, next) => {
  try {
    const id = req.user.id;
    const user = await User.findById({ _id: id });

    if (!user) {
      return next(new ErrorHandler("User doesn't exists, please login", 400));
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// *************** update user avatar - LoggedIn User ***************
export const updateUserAvatar = CatchAsyncError(async (req, res, next) => {
  if (!req.file) {
    return next(new ErrorHandler("File not exist", 400));
  }

  let existsUser = await User.findById(req.user.id);

  // remove already exist image
  const existAvatar = existsUser.avatar.split(`${process.env.API_URL}/`)[1];
  const __dirname = path.resolve();
  fs.unlink(`${__dirname}/uploaded-images/${existAvatar}`, (err) => {
    if (err) {
      console.log(err, "File not deleted");
    } else {
      console.log("File deleted successfully");
    }
  });

  // upload new avatar
  const filename = req.file.filename;
  const fileUrl = path.join(filename);
  existsUser.avatar = `${process.env.API_URL}/${fileUrl}`;

  await existsUser.save();

  res.status(200).json({
    success: true,
    message: "Avatar has been updated.",
    user: existsUser,
  });
});

// *************** UPDATE USER DETAILS - LoggedIn User ***************
export const updateUser = CatchAsyncError(async (req, res, next) => {
  const { body } = req;

  const user = await User.findById(req.user.id);

  if (!user) {
    return next(new ErrorHandler("User not found, Something went wrong", 400));
  }

  const updatedUser = await User.findByIdAndUpdate(req.user.id, body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({ success: true, user: updatedUser });
});

// *************** UPDATE User Password - LoggedIn User ***************
export const updatePassword = CatchAsyncError(async (req, res, next) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;
  const userId = req.user._id;

  const user = await User.findById(userId).select("+password");

  const isPasswordMatch = await user.comparePassword(oldPassword);

  if (!isPasswordMatch) {
    return next(new ErrorHandler("Old password is incorrect", 400));
  }

  if (newPassword !== confirmPassword) {
    return next(
      new ErrorHandler("new password is not matched with confirm password", 400)
    );
  }

  user.password = newPassword;

  await user.save();

  sendToken(user, 200, res);
});

// *************** Delete a User - LoggedIn User ***************
export const deleteUser = CatchAsyncError(async (req, res, next) => {
  const { userId } = req.params;

  await User.findByIdAndDelete(userId);

  res.status(200).json({ success: true, message: "User delete" });
});

// update user addresses
export const updateUserAddresses = CatchAsyncError(async (req, res, next) => {
  const { body } = req;

  const user = await User.findById(req.user.id);

  const sameTypeAddress = user.addresses.find(
    (address) => address.addressType === body.addressType
  );

  if (sameTypeAddress) {
    return next(
      new ErrorHandler(`${req.body.addressType} address already exists`)
    );
  }

  const existsAddress = user.addresses.find(
    (address) => address._id === req.body._id
  );

  if (existsAddress) {
    Object.assign(existsAddress, req.body);
  } else {
    // add the new address to the array
    user.addresses.push(req.body);
  }

  await user.save();

  res.status(200).json({
    success: true,
    user,
    message: "Address updated.",
  });
});

// delete user address
export const deleteUserAddress = CatchAsyncError(async (req, res, next) => {
  const userId = req.user._id;
  const addressId = req.params.addressId;

  await User.updateOne(
    {
      _id: userId,
    },
    { $pull: { addresses: { _id: addressId } } }
  );

  const user = await User.findById(userId);

  res.status(200).json({ success: true, user });
});

// *************** Get User info - Admin / User ***************
export const getUserDetails = CatchAsyncError(async (req, res, next) => {
  const { userId } = req.params;

  const user = await User.findById(userId);

  if (!user) {
    return next(
      new ErrorHandler("User not found or you are not allowed to access"),
      400
    );
  }

  res.status(200).json({
    success: true,
    user,
  });
});

// *************** Get All User info - Admin / User ***************
export const getAllUsers = CatchAsyncError(async (req, res, next) => {
  const users = await User.findById();

  if (!users) {
    return next(
      new ErrorHandler("Users not found or you are not allowed to access"),
      400
    );
  }

  res.status(200).json({
    success: true,
    users,
  });
});
