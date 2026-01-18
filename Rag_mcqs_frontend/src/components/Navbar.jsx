import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";
import "./Navbar.css";

export default function Navbar() {
    const { token, role, logout } = useAuthStore();
    const navigate = useNavigate();

    function handleLogout() {
        logout();
        navigate("/");
    }

    return (
        <nav className="navbar">
            {/* LEFT */}
            <div className="navbar-left">
                <h2 className="logo">AI Base Generated MCQs</h2>
            </div>

            {/* CENTER LINKS */}
            <div className="navbar-center">
                <Link className="nav-link" to="/">Home</Link>
                <Link className="nav-link" to="/about">About</Link>
                <Link className="nav-link" to="/contact">Contact</Link>
            </div>

            {/* RIGHT */}
            <div className="navbar-right">
                {!token && (
                    <>
                        <Link className="nav-link" to="/login">Login</Link>
                        <Link className="nav-link outline" to="/signup">Signup</Link>
                    </>
                )}

                {token && role === "user" && (
                    <>
                        <Link className="nav-link" to="/user">Quiz</Link>
                        <Link className="nav-link" to="/own">UserAnalytics</Link>
                        <button className="logout-btn" onClick={handleLogout}>
                            Logout
                        </button>
                    </>
                )}

                {token && role === "admin" && (
                    <>
                        <Link className="nav-link admin" to="/admin/dashboard">Dashboard</Link>
                        <Link className="nav-link admin" to="/admin/users">Users</Link>
                        <Link className="nav-link admin" to="/admin">Upload</Link>
                        <button className="logout-btn" onClick={handleLogout}>
                            Logout
                        </button>
                    </>
                )}
            </div>
        </nav>
    );
}
