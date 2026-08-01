// import { Link, useNavigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';

// function Navbar() {
//   const { user, logout } = useAuth();
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     logout();
//     navigate('/login');
//   };

//   return (
//     <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', borderBottom: '1px solid #444' }}>
//       <Link to="/">Corporate-Cruise</Link>

//       <div style={{ display: 'flex', gap: '1rem' }}>
//         {user ? (
//           <>
//             <span>Hi, {user.firstName}</span>
//             {user.role === 'admin' && <Link to="/admin/cruises">Manage Cruises</Link>}
//             <button onClick={handleLogout}>Logout</button>
//           </>
//         ) : (
//           <>
//             <Link to="/login">Login</Link>
//             <Link to="/register">Register</Link>
//           </>
//         )}
//       </div>
//     </nav>
//   );
// }

// export default Navbar;