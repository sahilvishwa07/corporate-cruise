import mongoose from 'mongoose';

const cabinTypeSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['interior', 'oceanview', 'balcony', 'suite'],
      required: true,
    },
    pricePerPerson: {
      type: Number,
      required: [true, 'Price per person is required'],
      min: [0, 'Price cannot be negative'],
    },
    totalCabins: {
      type: Number,
      required: true,
      min: [0, 'Total cabins cannot be negative'],
    },
    bookedCabins: {
      type: Number,
      default: 0,
      min: [0, 'Booked cabins cannot be negative'],
    },
  },
  { _id: false } // No need for a separate _id on each subdocument — it's not queried independently
);

const cruiseSchema = new mongoose.Schema(
  {
    shipName: {
      type: String,
      required: [true, 'Ship name is required'],
      trim: true,
    },
    itinerary: {
      type: String,
      required: [true, 'Itinerary description is required'],
      trim: true,
    },
    departurePort: {
      type: String,
      required: true,
      trim: true,
    },
    departureDate: {
      type: Date,
      required: [true, 'Departure date is required'],
    },
    returnDate: {
      type: Date,
      required: [true, 'Return date is required'],
    },
    durationNights: {
      type: Number,
      required: true,
      min: [1, 'Duration must be at least 1 night'],
    },
    cabinTypes: {
      type: [cabinTypeSchema],
      validate: {
        validator: (arr) => arr.length > 0,
        message: 'A cruise must have at least one cabin type defined',
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Cruise', cruiseSchema);