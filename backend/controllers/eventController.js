import CatchAsyncError from "../middlewares/catchAsyncErrors.js";
import Event from "../model/event.js";
import Seller from "../model/seller.js";
import ErrorHandler from "../utils/ErrorHandler.js";

// create event
export const createEvent = CatchAsyncError(async (req, res, next) => {
  const { sellerId } = req.body;

  const seller = await Seller.findById(sellerId);

  if (!seller) {
    return next(new ErrorHandler("Seller id is invalid.", 401));
  }

  const event = await Event.create({
    ...req.body,
    seller,
  });

  res.status(201).json({
    success: true,
    event,
    message: "Event created successfully.",
  });
});

// update event of a Seller
export const updateEvent = CatchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  const seller = await Seller.findById(id);

  if (!seller) {
    return next(new ErrorHandler("you are not authenticated for update.", 401));
  }

  const event = await Event.updateOne(req.body);

  if (event) {
    return next(
      new ErrorHandler("Event not updated. Something went wrong", 400)
    );
  }

  res.status(200).json({
    success: true,
    event,
    message: "Update successfully",
  });
});

// get a Event details of a Seller
export const getEventDetails = CatchAsyncError(async (req, res, next) => {
  const id = req.params;

  const event = await Event.findById({ _id: id });

  if (event) {
    return next(new ErrorHandler("Event not exist", 400));
  }

  res.status(200).json({
    success: true,
    event,
  });
});

// get all Events of a Seller
export const getAllSellerEvents = CatchAsyncError(async (req, res, next) => {
  const { sellerId } = req.params;
  const events = await Event.find({ sellerId: sellerId });

  if (!events) {
    return next(new ErrorHandler("No event going on.", 400));
  }

  res.status(200).json({
    success: true,
    events,
  });
});

// Delete a event of a Seller
export const deleteEvent = CatchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  const event = await Event.findById(id);

  if (!event) {
    return next(new ErrorHandler("Event is not found with this id", 404));
  }

  // event.images.forEach(async image => await cloudinary.v2.uploader.destroy(image.public_id));

  await event.deleteOne();

  res.status(201).json({
    success: true,
    message: "Event Deleted successfully!",
    eventId: event._id,
  });
});

// get all events
export const getAllEvents = CatchAsyncError(async (req, res, next) => {
  const events = await Event.find().sort({ createdAt: -1 });

  res.status(201).json({
    success: true,
    events,
  });
});
