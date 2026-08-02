import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">Corporate-Cruise</Link>

      <div className="navbar-links">
        {user ? (
          <>
            <Link to="/my-bookings">My Bookings</Link>
            <span className="navbar-greeting">Hi, {user.firstName}</span>
            {user.role === 'admin' && <Link to="/admin/cruises">Manage Cruises</Link>}
            <button className="btn-secondary" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;