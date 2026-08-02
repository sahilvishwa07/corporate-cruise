import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import errorHandler from "./middleware/errorMiddleware.js";
import cruiseRoutes from "./routes/cruiseRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";

dotenv.config();
connectDB();

const app = express();

const allowedOrigins = [
  "http://localhost:5173", // local dev
  process.env.CLIENT_URL, // production frontend, set via Render env var
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);

app.use(express.json());

app.get("/api/health", (req, res) => {
  res
    .status(200)
    .json({ status: "ok", message: "Corporate-Cruise API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/cruises", cruiseRoutes);
app.use("/api/bookings", bookingRoutes);

// Catch-all for unmatched routes (must come after all real routes)
app.use((req, res, next) => {
  res.status(404);
  next(new Error(`Route not found - ${req.originalUrl}`));
});

// Error handler — must be the LAST app.use(), after all routes
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
