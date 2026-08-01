import Cruise from "../models/Cruise.js";
import asyncHandler from "../middleware/asyncHandler.js";

// @desc    Create a new cruise
// @route   POST /api/cruises
// @access  Private/Admin
export const createCruise = asyncHandler(async (req, res) => {
  const {
    shipName,
    itinerary,
    departurePort,
    departureDate,
    returnDate,
    durationNights,
    cabinTypes,
  } = req.body;

  if (
    !shipName ||
    !itinerary ||
    !departurePort ||
    !departureDate ||
    !returnDate ||
    !durationNights ||
    !cabinTypes
  ) {
    res.status(400);
    throw new Error("All fields are required");
  }

  const cruise = await Cruise.create({
    shipName,
    itinerary,
    departurePort,
    departureDate,
    returnDate,
    durationNights,
    cabinTypes,
  });

  res.status(201).json(cruise);
});

// @desc    Get all cruises
// @route   GET /api/cruises
// @access  Public
export const getCruises = asyncHandler(async (req, res) => {
  const cruises = await Cruise.find({ isActive: true }).sort({
    departureDate: 1,
  });
  res.status(200).json(cruises);
});

// @desc    Get a single cruise by ID
// @route   GET /api/cruises/:id
// @access  Public
export const getCruiseById = asyncHandler(async (req, res) => {
  const cruise = await Cruise.findById(req.params.id);

  if (!cruise) {
    res.status(404);
    throw new Error("Cruise not found");
  }

  res.status(200).json(cruise);
});

// @desc    Update a cruise
// @route   PUT /api/cruises/:id
// @access  Private/Admin
export const updateCruise = asyncHandler(async (req, res) => {
  const cruise = await Cruise.findById(req.params.id);

  if (!cruise) {
    res.status(404);
    throw new Error("Cruise not found");
  }

  Object.assign(cruise, req.body);
  const updatedCruise = await cruise.save();

  res.status(200).json(updatedCruise);
});

// @desc    Delete a cruise
// @route   DELETE /api/cruises/:id
// @access  Private/Admin
export const deleteCruise = asyncHandler(async (req, res) => {
  const cruise = await Cruise.findById(req.params.id);

  if (!cruise) {
    res.status(404);
    throw new Error("Cruise not found");
  }

  await cruise.deleteOne();

  res.status(200).json({ message: "Cruise removed" });
});
