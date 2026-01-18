import { Navigate } from "react-router-dom";
import useAuthStore from "../store/authStore";

export default function ProtectedRoute({ children, role }) {
    const { token, role: userRole } = useAuthStore();

    if (!token) return <Navigate to="/" />;
    if (role && role !== userRole) return <Navigate to="/" />;

    return children;
}
