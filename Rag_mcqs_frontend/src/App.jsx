import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";
import Quiz from "./pages/Quiz";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import OwnDashboard from "./pages/ownDashboard";
import AdminDashboardStat from "./pages/ADD/AdminDashboardStat";
import AdminUsers from "./pages/ADD/AdminUsers";
import AdminUserDetail from "./pages/ADD/AdminUserDetail";

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Admin Protected Route */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboardStat />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute role="admin">
              <AdminUsers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users/:id"
          element={
            <ProtectedRoute role="admin">
              <AdminUserDetail />
            </ProtectedRoute>
          }
        />



        {/* User Protected Route */}
        <Route
          path="/user"
          element={
            <ProtectedRoute role="user">
              <UserDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/own"
          element={
            <ProtectedRoute role="user">
              <OwnDashboard />
            </ProtectedRoute>
          }
        />

        {/* Quiz Route (Protected by role inside the page) */}
        <Route path="/quiz/:id" element={<Quiz />} />
      </Routes>
    </>
  );
}
