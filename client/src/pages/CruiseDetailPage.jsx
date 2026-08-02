import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { useAuth } from "../context/AuthContext";

function CruiseDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [cruise, setCruise] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCruise = async () => {
      try {
        const response = await axiosInstance.get(`/cruises/${id}`);
        setCruise(response.data);
      } catch {
        setError("Failed to load cruise details.");
      } finally {
        setLoading(false);
      }
    };
    fetchCruise();
  }, [id]);

  const handleBookClick = (cabinType) => {
    if (!user) {
      navigate("/login");
      return;
    }
    navigate(`/cruises/${id}/book?cabinType=${cabinType}`);
  };

  if (loading)
    return (
      <div className="container">
        <p>Loading...</p>
      </div>
    );
  if (error)
    return (
      <div className="container">
        <p className="error-text">{error}</p>
      </div>
    );
  if (!cruise)
    return (
      <div className="container">
        <p>Cruise not found.</p>
      </div>
    );

  return (
    <div className="container">
      <h1>{cruise.shipName}</h1>
      <p>{cruise.itinerary}</p>
      <p>
        Departs: {new Date(cruise.departureDate).toLocaleDateString()} ·
        Returns: {new Date(cruise.returnDate).toLocaleDateString()}
      </p>
      <p>
        Duration: {cruise.durationNights} nights · Departure Port:{" "}
        {cruise.departurePort}
      </p>

      <h2 style={{ marginTop: "2rem" }}>Cabin Options</h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {cruise.cabinTypes.map((cabin) => {
          const available = cabin.totalCabins - cabin.bookedCabins;
          return (
            <li key={cabin.type} className="cabin-option">
              <div>
                <strong>{cabin.type}</strong>
                <p
                  style={{
                    margin: "0.25rem 0 0 0",
                    color: "var(--text-muted)",
                  }}
                >
                  ${cabin.pricePerPerson} per person ·{" "}
                  {available > 0 ? `${available} cabins left` : "Sold out"}
                </p>
              </div>
              {available > 0 && (
                <button onClick={() => handleBookClick(cabin.type)}>
                  Book Now
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default CruiseDetailPage;
