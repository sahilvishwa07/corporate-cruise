import mongoose from "mongoose";

const passengerSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Passenger full name is required"],
      trim: true,
    },
    passportNumber: {
      type: String,
      required: [true, "Passport number is required"],
      trim: true,
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
  },
  { _id: false },
);

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    cruise: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cruise",
      required: true,
    },
    cabinType: {
      type: String,
      enum: ["interior", "oceanview", "balcony", "suite"],
      required: true,
    },
    passengers: {
      type: [passengerSchema],
      validate: {
        validator: (arr) => arr.length > 0,
        message: "A booking must include at least one passenger",
      },
    },
    totalPrice: {
      type: Number,
      required: true,
      min: [0, "Total price cannot be negative"],
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending",
    },
    paymentIntentId: {
      type: String, // Stripe PaymentIntent ID — populated in Step 7
      default: null,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Booking", bookingSchema);
