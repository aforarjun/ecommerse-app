import CatchAsyncError from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import stripe from "stripe";

export const paymentProcess = CatchAsyncError(async (req, res, next) => {
  const stripeKey = await stripe(process.env.STRIPE_SECRET_KEY);

  if (!stripeKey) {
    return next(new ErrorHandler("Stripe Key is not provided.", 400));
  }

  const myPayment = await stripeKey.paymentIntents.create({
    amount: req.body.amount,
    currency: "inr",
    metadata: {
      company: "Eshop",
    },
  });

  res.status(200).json({
    success: true,
    client_secret: myPayment.client_secret,
  });
});

export const stripeApiKey = CatchAsyncError(async (req, res, next) => {
  res.status(200).json({ stripeApikey: process.env.STRIPE_API_KEY });
});
