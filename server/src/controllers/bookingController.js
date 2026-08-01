import Cruise from "../models/Cruise.js";
import Booking from "../models/Booking.js";
import asyncHandler from "../middleware/asyncHandler.js";

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Private (any logged-in user)
export const createBooking = asyncHandler(async (req, res) => {
  const { cruiseId, cabinType, passengers } = req.body;

  if (!cruiseId || !cabinType || !passengers || passengers.length === 0) {
    res.status(400);
    throw new Error(
      "Cruise, cabin type, and at least one passenger are required",
    );
  }

  const cruise = await Cruise.findById(cruiseId);
  if (!cruise) {
    res.status(404);
    throw new Error("Cruise not found");
  }

  const cabin = cruise.cabinTypes.find((c) => c.type === cabinType);
  if (!cabin) {
    res.status(400);
    throw new Error(`Cabin type '${cabinType}' is not offered on this cruise`);
  }

  const totalPrice = cabin.pricePerPerson * passengers.length;

  // ATOMIC inventory check-and-increment — bookedCabins is compared against
  // cabin.totalCabins (a literal captured from our read above), since $expr
  // inside $elemMatch is unsupported in newer MongoDB versions.
  const updatedCruise = await Cruise.findOneAndUpdate(
    {
      _id: cruiseId,
      cabinTypes: {
        $elemMatch: {
          type: cabinType,
          bookedCabins: { $lt: cabin.totalCabins },
        },
      },
    },
    { $inc: { "cabinTypes.$.bookedCabins": 1 } },
    { new: true },
  );

  if (!updatedCruise) {
    res.status(409);
    throw new Error(
      `No availability left for '${cabinType}' cabins on this cruise`,
    );
  }

  // Inventory is now reserved. If Booking creation fails below (e.g.
  // passenger validation), we must roll back the reservation, or we
  // permanently lose a cabin slot to a booking that was never created.
  try {
    const booking = await Booking.create({
      user: req.user._id,
      cruise: cruiseId,
      cabinType,
      passengers,
      totalPrice,
      status: "pending",
    });

    res.status(201).json(booking);
  } catch (error) {
    await Cruise.findOneAndUpdate(
      { _id: cruiseId, "cabinTypes.type": cabinType },
      { $inc: { "cabinTypes.$.bookedCabins": -1 } },
    );
    throw error;
  }
});

// @desc    Get the logged-in user's own bookings
// @route   GET /api/bookings/my
// @access  Private
export const getMyBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id })
    .populate("cruise", "shipName departureDate returnDate")
    .sort({ createdAt: -1 });

  res.status(200).json(bookings);
});

// @desc    Get a single booking by ID
// @route   GET /api/bookings/:id
// @access  Private (owner or admin only)
export const getBookingById = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id).populate(
    "cruise",
    "shipName departureDate returnDate",
  );

  if (!booking) {
    res.status(404);
    throw new Error("Booking not found");
  }

  // Ownership check: only the booking's owner OR an admin may view it
  const isOwner = booking.user.toString() === req.user._id.toString();
  const isAdmin = req.user.role === "admin";

  if (!isOwner && !isAdmin) {
    res.status(403);
    throw new Error("Not authorized to view this booking");
  }

  res.status(200).json(booking);
});

// @desc    Get all bookings (admin overview)
// @route   GET /api/bookings
// @access  Private/Admin
export const getAllBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find()
    .populate("user", "firstName lastName email")
    .populate("cruise", "shipName departureDate")
    .sort({ createdAt: -1 });

  res.status(200).json(bookings);
});
