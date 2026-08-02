import { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';

function AdminCruisesPage() {
  const [cruises, setCruises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [shipName, setShipName] = useState('');
  const [itinerary, setItinerary] = useState('');
  const [departurePort, setDeparturePort] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [durationNights, setDurationNights] = useState('');
  const [cabinTypes, setCabinTypes] = useState([
    { type: 'interior', pricePerPerson: '', totalCabins: '' },
  ]);
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchCruises = async () => {
    try {
      const response = await axiosInstance.get('/cruises');
      setCruises(response.data);
    } catch {
      setError('Failed to load cruises.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCruises();
  }, []);

  const handleCabinChange = (index, field, value) => {
    const updated = [...cabinTypes];
    updated[index] = { ...updated[index], [field]: value };
    setCabinTypes(updated);
  };

  const addCabinType = () => {
    setCabinTypes([...cabinTypes, { type: 'interior', pricePerPerson: '', totalCabins: '' }]);
  };

  const removeCabinType = (index) => {
    setCabinTypes(cabinTypes.filter((_, i) => i !== index));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setFormError('');
    setSubmitting(true);

    try {
      await axiosInstance.post('/cruises', {
        shipName,
        itinerary,
        departurePort,
        departureDate,
        returnDate,
        durationNights: Number(durationNights),
        cabinTypes: cabinTypes.map((c) => ({
          type: c.type,
          pricePerPerson: Number(c.pricePerPerson),
          totalCabins: Number(c.totalCabins),
        })),
      });

      // Reset form
      setShipName('');
      setItinerary('');
      setDeparturePort('');
      setDepartureDate('');
      setReturnDate('');
      setDurationNights('');
      setCabinTypes([{ type: 'interior', pricePerPerson: '', totalCabins: '' }]);

      fetchCruises();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to create cruise.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (cruiseId) => {
    if (!window.confirm('Delete this cruise? This cannot be undone.')) return;

    try {
      await axiosInstance.delete(`/cruises/${cruiseId}`);
      fetchCruises();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete cruise.');
    }
  };

  return (
    <div className="container">
      <h1>Manage Cruises</h1>

      <h2 style={{ marginTop: '2rem' }}>Create New Cruise</h2>
      <form onSubmit={handleCreate}>
        <div className="form-group">
          <label>Ship Name</label>
          <input type="text" value={shipName} onChange={(e) => setShipName(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Itinerary</label>
          <input type="text" value={itinerary} onChange={(e) => setItinerary(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Departure Port</label>
          <input type="text" value={departurePort} onChange={(e) => setDeparturePort(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Departure Date</label>
          <input type="date" value={departureDate} onChange={(e) => setDepartureDate(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Return Date</label>
          <input type="date" value={returnDate} onChange={(e) => setReturnDate(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Duration (nights)</label>
          <input type="number" min="1" value={durationNights} onChange={(e) => setDurationNights(e.target.value)} required />
        </div>

        {cabinTypes.map((cabin, index) => (
          <fieldset key={index}>
            <legend>Cabin Type {index + 1}</legend>
            <div className="form-group">
              <label>Type</label>
              <select
                value={cabin.type}
                onChange={(e) => handleCabinChange(index, 'type', e.target.value)}
              >
                <option value="interior">Interior</option>
                <option value="oceanview">Ocean View</option>
                <option value="balcony">Balcony</option>
                <option value="suite">Suite</option>
              </select>
            </div>
            <div className="form-group">
              <label>Price Per Person</label>
              <input
                type="number"
                min="0"
                value={cabin.pricePerPerson}
                onChange={(e) => handleCabinChange(index, 'pricePerPerson', e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Total Cabins</label>
              <input
                type="number"
                min="1"
                value={cabin.totalCabins}
                onChange={(e) => handleCabinChange(index, 'totalCabins', e.target.value)}
                required
              />
            </div>
            {cabinTypes.length > 1 && (
              <button type="button" className="btn-secondary" onClick={() => removeCabinType(index)}>
                Remove Cabin Type
              </button>
            )}
          </fieldset>
        ))}

        <button type="button" className="btn-secondary" onClick={addCabinType}>
          + Add Another Cabin Type
        </button>

        {formError && <p className="error-text">{formError}</p>}

        <div style={{ marginTop: '1rem' }}>
          <button type="submit" disabled={submitting}>
            {submitting ? 'Creating...' : 'Create Cruise'}
          </button>
        </div>
      </form>

      <h2 style={{ marginTop: '3rem' }}>Existing Cruises</h2>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="error-text">{error}</p>
      ) : (
        <ul className="card-grid">
          {cruises.map((cruise) => (
            <li key={cruise._id} className="card">
              <h3>{cruise.shipName}</h3>
              <p>{cruise.itinerary}</p>
              <p>Departs: {new Date(cruise.departureDate).toLocaleDateString()}</p>
              <button className="btn-danger" onClick={() => handleDelete(cruise._id)}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default AdminCruisesPage;