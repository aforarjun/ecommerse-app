import jwt from "jsonwebtoken";
import User from "../model/user.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import CatchAsyncError from "../middlewares/catchAsyncErrors.js"
import sendMail from "../utils/sendMail.js";

// *************** Create User ***************
const createVerificationToken = (user) => {
  return jwt.sign(user, process.env.VERIFICATION_SECRET_KEY, {
    expiresIn: "5m",
  });
};

export const signupUser = CatchAsyncError(async (req, res, next) => {
  const { email, password, ...otherUser } = req.body;

  const user = await User.findOne({ email });

  if (user) {
    return next(new ErrorHandler("User already exists", 400));
  }

  const newUser = {
    email,
    ...otherUser,
    avatar: {
      public_id: "This is demo",
      url: "profilepicurl",
    },
  };

  // for verify the account by email
  const verificationToken = createVerificationToken(newUser);

  // verification Url
  const verificationUrl = `${req.protocol}://${req.get(
    "host"
  )}/verification/${verificationToken}`;

  try {
    await sendMail({
      email: user.email,
      subject: "Activate your account",
      message: `Hello ${user.name}, please click on the link to activate your account: ${verificationUrl}`,
    });
    res.status(201).json({
      success: true,
      message: `please check your email:- ${user.email} to activate your account!`,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});



// *********** Verify User ***************
export const verifyAccount = CatchAsyncError(async (req, res, next) => {
  const { verificationToken } = req.body;

  const newUser = jwt.verify(
    verificationToken,
    process.env.VERIFICATION_SECRET_KEY
  );

  if (!newUser) {
    return next(new ErrorHandler("Invalid token", 400));
  }

  const { name, email, password, avatar } = newUser;

  let user = await User.findOne({ email });

  if (user) {
    return next(new ErrorHandler("User already exists", 400));
  }

  user = await User.create({
    name,
    email,
    avatar,
    password,
  });

  sendToken(user, 201, res);
});


// *************** Login User ***************
export const loginUser = CatchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return next(new ErrorHandler("Invalid Email or Password."), 400);
  }

  const isPasswordMatched = user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid Email or Password."), 400);
  }

  sendToken(user, 200, res);
})


// *************** LogOut User ***************
export const logoutUser = CatchAsyncError(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged Out",
  });
})


// *************** Forget Password ***************
export const forgetPassword = CatchAsyncError(async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return next(new ErrorHandler("User not found."), 400)
  }

  // Get RESET_PASSWORD TOKEN
  const resetPasswordToken = user.getResetPasswordToken();
  console.log(resetPasswordToken);

  await user.save({ validateBeforeSave: false });

  // reset password url
  const resetPasswordUrl = `${req.protocol}://${req.get(
    "host"
  )}/password-reset/${resetPasswordToken}`;

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
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

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
  sentToken(user, 200, res);
});


// *************** Get user info ***************

