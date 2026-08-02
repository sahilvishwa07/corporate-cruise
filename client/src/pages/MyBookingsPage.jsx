import { useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";

function MyBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axiosInstance.get("/bookings/my");
        setBookings(response.data);
      } catch {
        setError("Failed to load your bookings.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (loading) return <p>Loading your bookings...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="container" style={{ textAlign: "center" }}>
      <h1>My Bookings</h1>
      {bookings.length === 0 ? (
        <p>You haven't booked any cruises yet.</p>
      ) : (
        <ul className="card-grid" style={{ textAlign: "left" }}>
          {bookings.map((booking) => (
            <li key={booking._id} className="card">
              <h3>{booking.cruise.shipName}</h3>
              <p>
                Departs:{" "}
                {new Date(booking.cruise.departureDate).toLocaleDateString()}
              </p>
              <p>Cabin: {booking.cabinType}</p>
              <p>Passengers: {booking.passengers.length}</p>
              <p className="card-price">${booking.totalPrice}</p>
              <span className={`badge badge-${booking.status}`}>
                {booking.status}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default MyBookingsPage;
