import CatchAsyncError from "../middlewares/catchAsyncErrors.js";
import Order from "../model/order.js";
import Product from "../model/product.js";
import Seller from "../model/seller.js";

// Create order
export const createOrder = CatchAsyncError(async (req, res, next) => {
  const { cart, shippingAddress, user, totalPrice, paymentInfo } = req.body;

  //   group cart items by shopId
  const shopItemsMap = new Map();

  cart.forEach((item) => {
    const shopId = item.cartItem.sellerId;
    if (!shopItemsMap.has(shopId)) {
      shopItemsMap.set(shopId, []);
    }
    shopItemsMap.get(shopId).push(item);
  });

  // create an order for each shop
  const orders = [];

  for (const [shopId, items] of shopItemsMap) {
    const order = await Order.create({
      cart: items,
      shippingAddress,
      user,
      totalPrice,
      paymentInfo,
    });
    orders.push(order);
  }

  res.status(201).json({
    success: true,
    orders,
  });
});

// update order status for Seller
export const updateOrderStatus = CatchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const { status } = req.body;

  const order = await Order.findById(id);

  if (!order) {
    return next(new ErrorHandler("Order not found with this id", 400));
  }
  if (status === "Transferred to delivery partner") {
    order.cart.forEach(async ({ cartItem, qty }) => {
      await updateOrder(cartItem._id, qty);
    });
  }

  order.status = status;

  if (status === "Delivered") {
    order.deliveredAt = Date.now();
    order.paymentInfo.status = "Succeeded";
    const serviceCharge = order.totalPrice * 0.1;
    await updateSellerInfo(order.totalPrice - serviceCharge);
  }

  await order.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    order,
  });

  async function updateOrder(id, qty) {
    const product = await Product.findById(id);

    product.stock -= qty;
    product.sold_out += qty;

    await product.save({ validateBeforeSave: false });
  }

  async function updateSellerInfo(amount) {
    const seller = await Seller.findById(req.seller.id);

    seller.availableBalance = amount;

    await seller.save();
  }
});

// get a Order details
export const getOrderDetails = CatchAsyncError(async (req, res, next) => {
  const { userId } = req.params;

  const order = await Order.findById({ _id: userId });

  if (!order) {
    return next(new ErrorHandler("Order not exist", 400));
  }

  res.status(200).json({
    success: true,
    order,
  });
});

// get all Orders of a User
export const getAllUserOrders = CatchAsyncError(async (req, res, next) => {
  const { userId } = req.params;
  const orders = await Order.find({ "user._id": userId }).sort({
    createdAt: -1,
  });

  res.status(200).json({
    success: true,
    orders,
  });
});

// get all Orders of a Seller
export const getAllSellerOrders = CatchAsyncError(async (req, res, next) => {
  const { sellerId } = req.params;
  const orders = await Order.find({
    "cart.cartItem.sellerId": sellerId,
  }).sort({
    createdAt: -1,
  });

  res.status(200).json({
    success: true,
    orders,
  });
});

// Delete a order of a Seller
export const deleteOrder = CatchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  const order = await Order.findById(id);

  if (!order) {
    return next(new ErrorHandler("Order is not found with this id", 404));
  }

  await Order.deleteOne();

  res.status(201).json({
    success: true,
    message: "Order Deleted successfully!",
    eventId: order._id,
  });
});

// get all Orders
export const getAllOrders = CatchAsyncError(async (req, res, next) => {
  const orders = await Order.find().sort({ deliveredAt: -1, createdAt: -1 });

  res.status(201).json({
    success: true,
    orders,
  });
});

// Give a refund Order ---- User
export const requestRefundOrder = CatchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  const order = await Order.findById(id);

  if (!order) {
    return next(new ErrorHandler("Order not found with this id", 400));
  }

  order.status = req.body.status;

  await order.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    order,
    message: "Order Refund Request successfully!",
  });
});

// Accept refund Order ----- Seller
export const acceptRefundOrder = CatchAsyncError(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHandler("Order not found with this id", 400));
  }

  order.status = req.body.status;

  await order.save();

  res.status(200).json({
    success: true,
    message: "Order Refund successfull!",
  });

  if (req.body.status === "Refund Success") {
    order.cart.forEach(async (o) => {
      await updateOrder(o._id, o.qty);
    });
  }

  async function updateOrder(id, qty) {
    const product = await Product.findById(id);

    product.stock += qty;
    product.sold_out -= qty;

    await product.save({ validateBeforeSave: false });
  }
});
