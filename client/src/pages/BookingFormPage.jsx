import { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';

function BookingFormPage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const cabinType = searchParams.get('cabinType');
  const navigate = useNavigate();

  const [cruise, setCruise] = useState(null);
  const [passengers, setPassengers] = useState([
    { fullName: '', passportNumber: '', dateOfBirth: '' },
  ]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchCruise = async () => {
      try {
        const response = await axiosInstance.get(`/cruises/${id}`);
        setCruise(response.data);
      } catch {
        setError('Failed to load cruise details.');
      }
    };
    fetchCruise();
  }, [id]);

  const cabin = cruise?.cabinTypes.find((c) => c.type === cabinType);

  const handlePassengerChange = (index, field, value) => {
    const updated = [...passengers];
    updated[index] = { ...updated[index], [field]: value };
    setPassengers(updated);
  };

  const addPassenger = () => {
    setPassengers([...passengers, { fullName: '', passportNumber: '', dateOfBirth: '' }]);
  };

  const removePassenger = (index) => {
    setPassengers(passengers.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await axiosInstance.post('/bookings', { cruiseId: id, cabinType, passengers });
      setSuccess(true);
      setTimeout(() => navigate('/my-bookings'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!cruise) {
    return (
      <div className="container" style={{ textAlign: 'center' }}>
        <p>Loading...</p>
      </div>
    );
  }

  if (!cabin) {
    return (
      <div className="container" style={{ textAlign: 'center' }}>
        <p className="error-text">Invalid cabin type selected.</p>
      </div>
    );
  }

  const totalPrice = cabin.pricePerPerson * passengers.length;

  return (
    <div className="container" style={{ textAlign: 'center' }}>
      <h2>Book {cruise.shipName} — {cabinType}</h2>
      <p>${cabin.pricePerPerson} per person</p>

      <form onSubmit={handleSubmit} style={{ margin: '1.5rem auto 0 auto', textAlign: 'left' }}>
        {passengers.map((passenger, index) => (
          <fieldset key={index}>
            <legend>Passenger {index + 1}</legend>
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                value={passenger.fullName}
                onChange={(e) => handlePassengerChange(index, 'fullName', e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Passport Number</label>
              <input
                type="text"
                value={passenger.passportNumber}
                onChange={(e) => handlePassengerChange(index, 'passportNumber', e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Date of Birth</label>
              <input
                type="date"
                value={passenger.dateOfBirth}
                onChange={(e) => handlePassengerChange(index, 'dateOfBirth', e.target.value)}
                required
              />
            </div>
            {passengers.length > 1 && (
              <button type="button" className="btn-secondary" onClick={() => removePassenger(index)}>
                Remove Passenger
              </button>
            )}
          </fieldset>
        ))}

        <button type="button" className="btn-secondary" onClick={addPassenger}>
          + Add Another Passenger
        </button>

        <p style={{ marginTop: '1rem' }}>
          <strong>Total: ${totalPrice}</strong> ({passengers.length} passenger
          {passengers.length > 1 ? 's' : ''})
        </p>

        {error && <p className="error-text">{error}</p>}
        {success && <p className="success-text">Booking confirmed! Redirecting...</p>}

        <button type="submit" disabled={submitting}>
          {submitting ? 'Booking...' : 'Confirm Booking'}
        </button>
      </form>
    </div>
  );
}

export default BookingFormPage;