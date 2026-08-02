import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import CruiseListPage from "./pages/CruiseListPage.jsx";
import CruiseDetailPage from "./pages/CruiseDetailPage.jsx";
import BookingFormPage from "./pages/BookingFormPage.jsx";
import MyBookingsPage from "./pages/MyBookingsPage.jsx";
import AdminCruisesPage from "./pages/AdminCruisesPage.jsx";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<CruiseListPage />} />
        <Route path="/cruises/:id" element={<CruiseDetailPage />} />
        <Route
          path="/cruises/:id/book"
          element={
            <ProtectedRoute>
              <BookingFormPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-bookings"
          element={
            <ProtectedRoute>
              <MyBookingsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/cruises"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminCruisesPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;