import { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';

function CruiseListPage() {
  const [cruises, setCruises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCruises = async () => {
      try {
        const response = await axiosInstance.get('/cruises');
        setCruises(response.data);
      } catch (err) {
        setError('Failed to load cruises. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCruises();
  }, []);

  if (loading) return <p>Loading cruises...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      <h1>Available Cruises</h1>
      {cruises.length === 0 ? (
        <p>No cruises available right now.</p>
      ) : (
        <ul>
          {cruises.map((cruise) => (
            <li key={cruise._id}>
              <h3>{cruise.shipName}</h3>
              <p>{cruise.itinerary}</p>
              <p>Departs: {new Date(cruise.departureDate).toLocaleDateString()}</p>
              <p>From: ${Math.min(...cruise.cabinTypes.map((c) => c.pricePerPerson))} per person</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default CruiseListPage;