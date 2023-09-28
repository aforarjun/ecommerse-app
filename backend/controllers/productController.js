import CatchAsyncError from "../middlewares/catchAsyncErrors.js";
import Product from "../model/product.js";
import Seller from "../model/seller.js";
import ErrorHandler from "../utils/ErrorHandler.js";

// create product
export const createProduct = CatchAsyncError(async (req, res, next) => {
  const { sellerId } = req.body;

  const seller = await Seller.findById(sellerId);

  if (!seller) {
    return next(new ErrorHandler("Seller id is invalid.", 401));
  }

  const product = await Product.create({
    ...req.body,
    seller,
  });

  res.status(201).json({
    success: true,
    product,
    message: "Product created successfully.",
  });
});

// update product of a Seller
export const updateProduct = CatchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  const seller = await Seller.findById(id);

  if (!seller) {
    return next(new ErrorHandler("you are not authenticated for update.", 401));
  }

  const product = await Product.updateOne(req.body);

  if (product) {
    return next(
      new ErrorHandler("Product not updated. Something went wrong", 400)
    );
  }

  res.status(200).json({
    success: true,
    product,
    message: "Update successfully",
  });
});

// get a product details of a Seller
export const getProductDetails = CatchAsyncError(async (req, res, next) => {
  const id = req.params;

  const product = await Product.findById({ _id: id });

  if (product) {
    return next(new ErrorHandler("Product not exist", 400));
  }

  res.status(200).json({
    success: true,
    product,
  });
});

// get all products of a Seller
export const getAllSellerProducts = CatchAsyncError(async (req, res, next) => {
  const { sellerId } = req.params;
  const products = await Product.find({ sellerId: sellerId });

  if (!products) {
    return next(new ErrorHandler("Products list not exist", 400));
  }

  res.status(200).json({
    success: true,
    products,
  });
});

// Delete a product of a Seller
export const deleteProduct = CatchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  const product = await Product.findById(id);

  if (!product) {
    return next(new ErrorHandler("Product is not found with this id", 404));
  }

  // product.images.forEach(async image => await cloudinary.v2.uploader.destroy(image.public_id));

  await product.deleteOne();

  res.status(201).json({
    success: true,
    message: "Product Deleted successfully!",
    productId: product._id,
  });
});

// get all products
export const getAllProducts = CatchAsyncError(async (req, res, next) => {
  const products = await Product.find().sort({ createdAt: -1 });

  res.status(201).json({
    success: true,
    products,
  });
});

// review for a product
export const reviewProduct = CatchAsyncError(async (req, res, netx) => {
  const { user, rating, comment, productId, orderId } = req.body;

  const product = await Product.findById(productId);

  const review = {
    user,
    rating,
    comment,
    productId,
  };

  const isReviewed = product.reviews.find(
    (review) => review.user._id === req.user._id
  );

  if (isReviewed) {
    product.reviews.forEach((review) => {
      if (review.user._id === req.user._id) {
        review.rating = rating;
        review.comment = comment;
        review.user = user;
      }
    });
  } else {
    product.reviews.push(review);
  }

  let avg = 0;

  product.reviews.forEach((review) => {
    avg += review.rating;
  });

  product.ratings = avg / product.reviews.length;

  await product.save({ validateBeforeSave: false });

  // await Order.findByIdAndUpdate(
  //     orderId,
  //     { $set: { "cart.$[elem].isReviewed": true } },
  //     { arrayFilters: [{ "elem._id": productId }], new: true }
  // );

  res.status(200).json({
    success: true,
    message: "Reviwed succesfully!",
  });
});

//all products --- for admin
export const getAllProductsAdmin = CatchAsyncError(async (req, res, next) => {
  const products = await Product.find().sort({
    createdAt: -1,
  });

  res.status(201).json({
    success: true,
    products,
  });
});
